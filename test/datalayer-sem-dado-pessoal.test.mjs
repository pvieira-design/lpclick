import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "apps/web/src");
const helperFile = "lib/lead-observation.ts";
const bootstrapFile = "app/DeferredGTM.tsx";
const gtmModule = "@next/third-parties/google";
const whatsappEvent = "buttonWhatsappClicked";
const pushKeys = new Set([
  "event",
  "category",
  "action",
  "label",
  "value",
  "premio",
]);
const whatsappKeys = ["event", "category", "action", "label"];
const conditionKeys = new Set(["patologia", "frase", "pedido"]);
const conditionLists = /^(PATOLOGIAS|SINTOMAS|OBJETIVOS|GOALS)$/;
const historyTerms = ["ajuda-inicio", "acao-paciente", "parabens", "retorno"];
const patientSteps = [
  "tratamento",
  "ajuda-inicio",
  "retorno",
  "parabens",
  "acao-paciente",
];
const stepTable = "ROTULO_DO_PASSO";

class Unresolved extends Error {}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function toFile(path) {
  return relative(src, path).split("\\").join("/");
}

function parse(path, text) {
  return ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
}

const baseAsts = new Map(
  sourceFiles(src).map((path) => [
    path,
    parse(path, readFileSync(path, "utf8")),
  ]),
);

function projectWith(overrides = {}) {
  const asts = new Map(baseAsts);
  for (const [file, text] of Object.entries(overrides)) {
    const path = join(src, file);
    asts.set(path, parse(path, text));
  }
  return { asts, paths: [...asts.keys()] };
}

function mutation(file, from, to) {
  const text = baseAsts.get(join(src, file)).getFullText();
  const occurrences =
    typeof from === "string"
      ? text.split(from).length - 1
      : (text.match(new RegExp(from, "g")) ?? []).length;
  assert.equal(occurrences, 1, `${file}: trecho da mutação ${from}`);
  return { [file]: text.replace(from, () => to) };
}

function descendants(node, predicate) {
  const result = [];
  function visit(current) {
    if (predicate(current)) result.push(current);
    ts.forEachChild(current, visit);
  }
  visit(node);
  return result;
}

function unwrap(node) {
  let current = node;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function literalText(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
    ? node.text
    : undefined;
}

function keyName(property) {
  const named =
    ts.isShorthandPropertyAssignment(property) ||
    ts.isPropertyAssignment(property);
  return named &&
    (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
    ? property.name.text
    : undefined;
}

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isPush(call) {
  const callee = call.expression.getText();
  return (
    callee === "sendGTMEvent" ||
    callee === "sendCorrelatedLeadEvent" ||
    /(^|\.)dataLayer\.push$/.test(callee) ||
    callee === "gtag"
  );
}

function pushes(project, path) {
  return descendants(
    project.asts.get(path),
    (node) => ts.isCallExpression(node) && isPush(node),
  );
}

function sameDirectory(project, path) {
  const directory = dirname(path);
  return [
    path,
    ...project.paths.filter(
      (other) => other !== path && dirname(other) === directory,
    ),
  ];
}

function findTopLevel(project, path, match) {
  for (const candidate of sameDirectory(project, path)) {
    for (const statement of project.asts.get(candidate).statements) {
      const node = match(statement);
      if (node) return { node, path: candidate };
    }
  }
  return undefined;
}

function constant(project, path, name) {
  return findTopLevel(project, path, (statement) =>
    ts.isVariableStatement(statement)
      ? statement.declarationList.declarations.find(
          (declaration) =>
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === name &&
            declaration.initializer,
        )
      : undefined,
  );
}

function unionMembers(project, path, name) {
  const found = findTopLevel(project, path, (statement) =>
    ts.isTypeAliasDeclaration(statement) && statement.name.text === name
      ? statement
      : undefined,
  );
  if (!found || !ts.isUnionTypeNode(found.node.type))
    throw new Unresolved(name);
  return found.node.type.types.map((member) => {
    if (!ts.isLiteralTypeNode(member) || !ts.isStringLiteral(member.literal)) {
      throw new Unresolved(member.getText());
    }
    return member.literal.text;
  });
}

function tableValues(project, path, name, property) {
  const found = constant(project, path, name);
  const table = found && unwrap(found.node.initializer);
  if (!table || !ts.isObjectLiteralExpression(table)) {
    throw new Unresolved(name);
  }
  return table.properties.flatMap((item) => {
    if (!ts.isPropertyAssignment(item)) throw new Unresolved(item.getText());
    if (!property) return valuesOf(item.initializer, project, found.path);
    const entry = unwrap(item.initializer);
    const member =
      ts.isObjectLiteralExpression(entry) &&
      entry.properties.find(
        (candidate) =>
          ts.isPropertyAssignment(candidate) && keyName(candidate) === property,
      );
    if (!member) throw new Unresolved(`${name}.${property}`);
    return valuesOf(member.initializer, project, found.path);
  });
}

function originValues(project, path) {
  const values = [];
  for (const candidate of sameDirectory(project, path)) {
    const ast = project.asts.get(candidate);
    for (const call of descendants(
      ast,
      (node) =>
        ts.isCallExpression(node) &&
        node.expression.getText() === "openSchedule",
    )) {
      const detail = call.arguments[0] && unwrap(call.arguments[0]);
      const literal = detail && ts.isObjectLiteralExpression(detail);
      if (!literal || detail.properties.some(ts.isSpreadAssignment)) {
        throw new Unresolved(`openSchedule em ${toFile(candidate)}`);
      }
    }
    for (const property of descendants(
      ast,
      (node) =>
        (ts.isPropertyAssignment(node) ||
          ts.isShorthandPropertyAssignment(node)) &&
        keyName(node) === "origem",
    )) {
      try {
        values.push(
          ...valuesOf(
            ts.isPropertyAssignment(property)
              ? property.initializer
              : property.name,
            project,
            candidate,
          ),
        );
      } catch (error) {
        if (!(error instanceof Unresolved)) throw error;
        throw new Unresolved(
          `origem ${property.getText()} em ${toFile(candidate)}`,
        );
      }
    }
  }
  return values;
}

function originRefValues(project, path) {
  const ast = project.asts.get(path);
  const assigned = descendants(
    ast,
    (node) =>
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      node.left.getText() === "originRef.current",
  ).map((node) => node.right);
  const initial = descendants(
    ast,
    (node) =>
      ts.isVariableDeclaration(node) &&
      node.name.getText() === "originRef" &&
      node.initializer &&
      ts.isCallExpression(node.initializer),
  ).flatMap((node) => [...node.initializer.arguments]);
  return [...assigned, ...initial].flatMap((node) =>
    valuesOf(node, project, path),
  );
}

function mappedElements(project, path, identifier) {
  for (let scope = identifier.parent; scope; scope = scope.parent) {
    const callback =
      ts.isArrowFunction(scope) || ts.isFunctionExpression(scope);
    if (!callback || scope.parameters[0]?.name.getText() !== identifier.text) {
      continue;
    }
    const call = scope.parent;
    const mapped =
      ts.isCallExpression(call) &&
      call.arguments[0] === scope &&
      ts.isPropertyAccessExpression(call.expression) &&
      call.expression.name.text === "map" &&
      ts.isIdentifier(call.expression.expression);
    const found =
      mapped && constant(project, path, call.expression.expression.text);
    const list = found && unwrap(found.node.initializer);
    if (!list || !ts.isArrayLiteralExpression(list)) return undefined;
    return list.elements.flatMap((element) =>
      valuesOf(element, project, found.path),
    );
  }
  return undefined;
}

function valuesOf(node, project, path) {
  const expression = unwrap(node);
  const text = literalText(expression);
  if (text !== undefined) return [text];
  if (ts.isNumericLiteral(expression)) return [expression.text];
  if (ts.isTemplateExpression(expression)) {
    return expression.templateSpans.reduce(
      (prefixes, span) =>
        prefixes.flatMap((prefix) =>
          valuesOf(span.expression, project, path).map(
            (value) => prefix + value + span.literal.text,
          ),
        ),
      [expression.head.text],
    );
  }
  if (ts.isConditionalExpression(expression)) {
    return [
      ...valuesOf(expression.whenTrue, project, path),
      ...valuesOf(expression.whenFalse, project, path),
    ];
  }
  if (
    ts.isBinaryExpression(expression) &&
    expression.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
  ) {
    return [
      ...valuesOf(expression.left, project, path),
      ...valuesOf(expression.right, project, path),
    ];
  }
  if (ts.isIdentifier(expression)) {
    const elements = mappedElements(project, path, expression);
    if (elements) return elements;
    const found = constant(project, path, expression.text);
    if (found) return valuesOf(found.node.initializer, project, found.path);
    if (expression.text === "label" && /\/LinkList\.tsx$/.test(path)) {
      return descendants(
        project.asts.get(path),
        (item) =>
          ts.isPropertyAssignment(item) &&
          keyName(item) === "label" &&
          ts.isArrayLiteralExpression(item.parent.parent),
      ).flatMap((item) => valuesOf(item.initializer, project, path));
    }
  }
  const source = expression.getText();
  if (source === "detail.origem") return originValues(project, path);
  if (source === "originRef.current") return originRefValues(project, path);
  if (source === "r.premio") return unionMembers(project, path, "PremioId");
  if (
    ts.isElementAccessExpression(expression) &&
    ts.isIdentifier(expression.expression)
  ) {
    return tableValues(project, path, expression.expression.text);
  }
  if (
    ts.isPropertyAccessExpression(expression) &&
    ts.isElementAccessExpression(expression.expression) &&
    ts.isIdentifier(expression.expression.expression)
  ) {
    return tableValues(
      project,
      path,
      expression.expression.expression.text,
      expression.name.text,
    );
  }
  throw new Unresolved(source);
}

function vocabulary(project) {
  const terms = new Set(historyTerms.map(normalize));
  const add = (node) => {
    const text = node && literalText(unwrap(node));
    if (text !== undefined && normalize(text).length > 2) {
      terms.add(normalize(text));
    }
  };
  for (const ast of project.asts.values()) {
    for (const property of descendants(ast, ts.isPropertyAssignment)) {
      if (conditionKeys.has(keyName(property))) add(property.initializer);
    }
    for (const declaration of descendants(ast, ts.isVariableDeclaration)) {
      if (
        !ts.isIdentifier(declaration.name) ||
        !conditionLists.test(declaration.name.text) ||
        !declaration.initializer
      ) {
        continue;
      }
      const list = unwrap(declaration.initializer);
      if (!ts.isArrayLiteralExpression(list)) continue;
      for (const item of list.elements) {
        const element = unwrap(item);
        if (!ts.isObjectLiteralExpression(element)) {
          add(element);
          continue;
        }
        for (const property of element.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            ["label", "patologia"].includes(keyName(property))
          ) {
            add(property.initializer);
          }
        }
      }
    }
  }
  return [...terms].map((term) => ({
    term,
    pattern: new RegExp(
      `(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`,
    ),
  }));
}

function eventName(literal) {
  const property = literal.properties.find(
    (item) => ts.isPropertyAssignment(item) && keyName(item) === "event",
  );
  return property && literalText(property.initializer);
}

function helperViolations(project) {
  const path = join(src, helperFile);
  const ast = project.asts.get(path);
  const sender = ast.statements.find(
    (node) =>
      ts.isFunctionDeclaration(node) &&
      node.name?.text === "sendCorrelatedLeadEvent",
  );
  const calls = sender
    ? descendants(
        sender,
        (node) =>
          ts.isCallExpression(node) &&
          node.expression.getText() === "sendGTMEvent",
      )
    : [];
  if (calls.length !== 2) {
    return [`esperados 2 pushes no helper, achados ${calls.length}`];
  }
  const found = [];
  const [carrier, reset] = calls;
  const carried = carrier.arguments[0];
  const shape = ts.isObjectLiteralExpression(carried)
    ? carried.properties.map((property) =>
        property.getText().replace(/\s+/g, " "),
      )
    : [];
  if (
    shape.join("|") !==
    "...event|lead_observation_id: normalizeLeadObservationId(leadObservationId) ?? null"
  ) {
    found.push(`push do evento fora do contrato do helper: ${shape}`);
  }
  if (
    reset.arguments[0].getText().replace(/\s+/g, " ") !==
    "{ lead_observation_id: null }"
  ) {
    found.push("o push seguinte não zera o campo");
  }
  return found;
}

function bootstrapViolations(project) {
  const found = [];
  for (const call of pushes(project, join(src, bootstrapFile))) {
    const literal = call.arguments[0];
    const keys = ts.isObjectLiteralExpression(literal)
      ? literal.properties.map(keyName)
      : [];
    if (keys.join() !== "gtm.start,event" || eventName(literal) !== "gtm.js") {
      found.push("push fora do contrato do loader");
    }
  }
  return found;
}

function pushViolations(project, path, call, terms) {
  const found = [];
  const callee = call.expression.getText();
  const literal = call.arguments[0];
  if (!literal || !ts.isObjectLiteralExpression(literal)) {
    return [`${callee}: argumento que não é objeto literal`];
  }
  if (literal.properties.some(ts.isSpreadAssignment)) {
    found.push(`${callee}: spread no push`);
  }
  const keys = literal.properties.map(keyName);
  for (const property of literal.properties) {
    const key = keyName(property);
    if (key !== undefined && !pushKeys.has(key)) {
      found.push(`${callee}: chave ${key} fora do contrato`);
    }
  }
  for (const property of literal.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const key = keyName(property);
    if (
      key === "value" &&
      literalText(unwrap(property.initializer)) === undefined
    ) {
      found.push(`${callee}: value ${property.initializer.getText()}`);
      continue;
    }
    let values;
    try {
      values = valuesOf(property.initializer, project, path);
    } catch (error) {
      if (!(error instanceof Unresolved)) throw error;
      found.push(`${callee}: ${key} não resolvido (${error.message})`);
      continue;
    }
    for (const value of values) {
      const hit = terms.find(({ pattern }) => pattern.test(normalize(value)));
      if (hit) found.push(`${callee}: ${key} "${value}" contém "${hit.term}"`);
    }
  }
  const event = eventName(literal);
  if (event === undefined) found.push(`${callee}: evento que não é literal`);
  if (callee === "sendCorrelatedLeadEvent") {
    if (event !== whatsappEvent) {
      found.push(`${callee}: evento ${event} em vez de ${whatsappEvent}`);
    }
    if (call.arguments[1]?.getText() !== "leadObservationId") {
      found.push(`${callee}: sem o leadObservationId da captura`);
    }
  }
  if (event === whatsappEvent) {
    if (callee !== "sendCorrelatedLeadEvent") {
      found.push(`${callee}: ${whatsappEvent} fora do helper de correlação`);
    }
    for (const key of whatsappKeys) {
      if (!keys.includes(key)) found.push(`${callee}: ${event} sem ${key}`);
    }
    const fixed = { category: "Lead", action: "Click" };
    for (const [key, expected] of Object.entries(fixed)) {
      const property = literal.properties.find(
        (item) => ts.isPropertyAssignment(item) && keyName(item) === key,
      );
      if (property && literalText(property.initializer) !== expected) {
        found.push(`${callee}: ${event} com ${key} diferente de ${expected}`);
      }
    }
  }
  return found;
}

function patientLabels(project, path) {
  const found = constant(project, path, stepTable);
  const table = found && unwrap(found.node.initializer);
  return patientSteps.map((step) => {
    const property =
      table &&
      ts.isObjectLiteralExpression(table) &&
      table.properties.find(
        (item) => ts.isPropertyAssignment(item) && keyName(item) === step,
      );
    if (!property) return null;
    try {
      return valuesOf(property.initializer, project, found.path).join("|");
    } catch (error) {
      if (!(error instanceof Unresolved)) throw error;
      return null;
    }
  });
}

function fileViolations(project, path, terms) {
  const file = toFile(path);
  const found = [];
  const ast = project.asts.get(path);
  for (const statement of ast.statements) {
    const bindings =
      ts.isImportDeclaration(statement) &&
      statement.moduleSpecifier.text === gtmModule &&
      statement.importClause?.namedBindings;
    if (
      bindings &&
      ts.isNamedImports(bindings) &&
      bindings.elements.some((element) => element.propertyName)
    ) {
      found.push("sendGTMEvent importado com alias");
    }
  }
  if (ast.getFullText().includes(stepTable)) {
    const labels = patientLabels(project, path);
    if (labels.includes(null) || new Set(labels).size !== 1) {
      found.push(
        `telas do ramo paciente distinguíveis no ${stepTable}: ${labels}`,
      );
    }
  }
  if (file === helperFile) found.push(...helperViolations(project));
  else if (file === bootstrapFile) found.push(...bootstrapViolations(project));
  else {
    for (const call of pushes(project, path)) {
      found.push(...pushViolations(project, path, call, terms));
    }
  }
  return found.map((message) => `${file}: ${message}`);
}

function scan(project) {
  const terms = vocabulary(project);
  return project.paths.flatMap((path) => fileViolations(project, path, terms));
}

const base = projectWith();
const baseTerms = vocabulary(base);
const files = base.paths
  .filter((path) => pushes(base, path).length > 0)
  .map((path) => ({ path, file: toFile(path) }));

test("the scanner finds the pushes of the lead events", () => {
  assert.ok(files.length > 0);
  const whatsapp = files.flatMap(({ path }) =>
    pushes(base, path).filter((call) =>
      new RegExp(whatsappEvent).test(call.arguments[0]?.getText() ?? ""),
    ),
  );
  assert.ok(whatsapp.length > 0);
});

test("the vocabulary of conditions and consultation history comes from the source", () => {
  const terms = baseTerms.map(({ term }) => term);
  for (const expected of [
    "insonia",
    "ansiedade",
    "depressao",
    "tdah",
    "enxaqueca",
    "dormir melhor",
    "ja passei em consulta e quero ajuda para iniciar meu tratamento.",
    "retorno",
  ]) {
    assert.ok(terms.includes(expected), expected);
  }
});

test("only the loader and the helper touch the dataLayer directly", () => {
  const direct = base.paths
    .filter((path) =>
      /dataLayer|gtag\(|fbq\(/.test(base.asts.get(path).getFullText()),
    )
    .map(toFile);
  assert.deepEqual(direct, [bootstrapFile]);
});

for (const { path, file } of files) {
  test(`dataLayer pushes carry no personal data: ${file}`, () => {
    assert.deepEqual(fileViolations(base, path, baseTerms), []);
  });
}

const whatsappPush = {
  file: "app/lp5/LandingClient.tsx",
  from: 'label: "Falar com o médico - LP3"',
};

const mutations = [
  {
    name: "condition as the label literal",
    ...whatsappPush,
    to: 'label: "Ansiedade"',
    expect: /ansiedade/,
  },
  {
    name: "condition inside the label text",
    ...whatsappPush,
    to: 'label: "Falar com o médico - Insônia"',
    expect: /insonia/,
  },
  {
    name: "selection interpolated in the label",
    ...whatsappPush,
    to: "label: `Falar com o médico - ${patologias[0]}`",
    expect: /não resolvido/,
  },
  {
    name: "label read from a variable",
    ...whatsappPush,
    to: "label: alvo",
    expect: /não resolvido/,
  },
  {
    name: "name in value",
    ...whatsappPush,
    to: `${whatsappPush.from}, value: name`,
    expect: /value name/,
  },
  {
    name: "pathologies in value",
    ...whatsappPush,
    to: `${whatsappPush.from}, value: patologias.join(", ")`,
    expect: /value patologias/,
  },
  {
    name: "leadData key",
    ...whatsappPush,
    to: `${whatsappPush.from}, leadData`,
    expect: /chave leadData/,
  },
  {
    name: "spread of the lead",
    ...whatsappPush,
    to: `${whatsappPush.from}, ...leadData`,
    expect: /spread/,
  },
  {
    name: "phone key",
    ...whatsappPush,
    to: `${whatsappPush.from}, telefone: "21999999999"`,
    expect: /chave telefone/,
  },
  {
    name: "category removed",
    file: "app/lp5/LandingClient.tsx",
    from: 'category: "Lead",\n        action: "Click",\n        label: "Falar',
    to: 'action: "Click",\n        label: "Falar',
    expect: /sem category/,
  },
  {
    name: "action removed",
    file: "app/lp5/LandingClient.tsx",
    from: 'action: "Click",\n        label: "Falar',
    to: 'label: "Falar',
    expect: /sem action/,
  },
  {
    name: "label removed",
    file: "app/lp5/LandingClient.tsx",
    from: 'label: "Falar com o médico - LP3",',
    to: "",
    expect: /sem label/,
  },
  {
    name: "event renamed",
    file: "app/lp5/LandingClient.tsx",
    from: `event: "${whatsappEvent}"`,
    to: 'event: "buttonWhatsappClick"',
    expect: /em vez de/,
  },
  {
    name: "observation ID dropped",
    file: "app/lp5/LandingClient.tsx",
    from: /\},\s*leadObservationId,\s*\);/,
    to: "});",
    expect: /sem o leadObservationId/,
  },
  {
    name: "button click carrying the selection",
    file: "app/lp5/LandingClient.tsx",
    from: 'label: "Abrir modal - LP3"',
    to: 'label: "Abrir modal - LP3", value: selected.join(",")',
    expect: /value selected/,
  },
  {
    name: "objective in a fixed label",
    file: "app/lp12/LandingClient.tsx",
    from: 'label: "Selecionar objetivo - Inicio"',
    to: 'label: "Selecionar objetivo - Dormir melhor"',
    expect: /dormir melhor/,
  },
  {
    name: "chip selection in the origin of /bio",
    file: "app/bio/BioClient.tsx",
    from: 'origem: "chip"',
    to: "origem: `chip:${p}`",
    expect: /Abrir agendamento \(chip:Ansiedade\) - BIO/,
  },
  {
    name: "chip selection in the origin of /lp13",
    file: "app/lp13/LandingClient.tsx",
    from: 'origem: "chip"',
    to: "origem: `chip:${p}`",
    expect: /Abrir agendamento \(chip:Dormir melhor\) - LP13/,
  },
  {
    name: "selection in the origin of another dialog",
    file: "app/sono/LandingClient.tsx",
    from: 'patologias: Array.from(selected), origem: "hero"',
    to: "patologias: Array.from(selected), origem: Array.from(selected).join()",
    expect: /origem/,
  },
  {
    name: "dialog origin assigned from the selection",
    file: "app/bio/ScheduleDialog.tsx",
    from: "originRef.current = detail.origem;",
    to: 'originRef.current = Array.from(selected).join(",");',
    expect: /não resolvido/,
  },
  {
    name: "consultation history in value of /avaliacao",
    file: "app/avaliacao/AvaliacaoClient.tsx",
    from: 'label: "Enviar no WhatsApp - Avaliacao paciente" }',
    to: 'label: "Enviar no WhatsApp - Avaliacao paciente", value: r.pedido ?? "" }',
    expect: /value r\.pedido/,
  },
  {
    name: "consultation history in value of /green-friday",
    file: "app/green-friday/GreenFridayClient.tsx",
    from: 'label: "Enviar no WhatsApp - Green Friday paciente" }',
    to: 'label: "Enviar no WhatsApp - Green Friday paciente", value: r.pedido ?? "" }',
    expect: /value r\.pedido/,
  },
  {
    name: "consultation history as a literal value",
    file: "app/avaliacao/AvaliacaoClient.tsx",
    from: 'label: "Enviar no WhatsApp - Avaliacao paciente" }',
    to: 'label: "Enviar no WhatsApp - Avaliacao paciente", value: "Já passei em consulta e quero ajuda para iniciar meu tratamento." }',
    expect: /ja passei em consulta/,
  },
  {
    name: "raw quiz step in /avaliacao",
    file: "app/avaliacao/AvaliacaoClient.tsx",
    from: `\${${stepTable}[step]}`,
    to: "${step}",
    expect: /label não resolvido/,
  },
  {
    name: "raw quiz step in /green-friday",
    file: "app/green-friday/GreenFridayClient.tsx",
    from: `\${${stepTable}[step]}`,
    to: "${step}",
    expect: /label não resolvido/,
  },
  {
    name: "patient screens told apart in /avaliacao",
    file: "app/avaliacao/AvaliacaoClient.tsx",
    from: 'retorno: "paciente"',
    to: 'retorno: "retorno"',
    expect: /distinguíveis/,
  },
  {
    name: "patient screens told apart in /green-friday",
    file: "app/green-friday/GreenFridayClient.tsx",
    from: '"ajuda-inicio": "paciente"',
    to: '"ajuda-inicio": "ajuda-inicio"',
    expect: /distinguíveis/,
  },
  {
    name: "reset push removed from the helper",
    file: "lib/lead-observation.ts",
    from: "sendGTMEvent({ lead_observation_id: null });",
    to: "succeeded = true;",
    expect: /esperados 2 pushes/,
  },
  {
    name: "reset push no longer clears",
    file: "lib/lead-observation.ts",
    from: "sendGTMEvent({ lead_observation_id: null });",
    to: "sendGTMEvent({ lead_observation_id: leadObservationId });",
    expect: /não zera/,
  },
  {
    name: "extra field in the helper push",
    file: "lib/lead-observation.ts",
    from: "...event,",
    to: "...event, leadData: event,",
    expect: /fora do contrato/,
  },
  {
    name: "sendGTMEvent imported with an alias",
    file: "app/lp5/LandingClient.tsx",
    from: /import \{ sendGTMEvent \} from "@next\/third-parties\/google";/,
    to: 'import { sendGTMEvent as enviar } from "@next/third-parties/google";',
    expect: /alias/,
  },
];

for (const { name, file, from, to, expect } of mutations) {
  test(`the scanner rejects: ${name}`, () => {
    const found = scan(projectWith(mutation(file, from, to)));
    assert.ok(
      found.some((message) => expect.test(message)),
      `${expect} em ${JSON.stringify(found)}`,
    );
  });
}
