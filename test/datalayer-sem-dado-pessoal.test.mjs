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
const personalData =
  /patolog|patholog|sintoma|nome|name|trimmed|selected|leadData|outro|objetivo|goal|phone|telefone|fbp|fbc|pageUrl/i;
const staticValues = new Set([`r.pedido ?? ""`]);
const whatsappKeys = new Set([
  "event",
  "category",
  "action",
  "label",
  "premio",
]);

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
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

function isPush(call) {
  const callee = call.expression.getText();
  return (
    callee === "sendGTMEvent" ||
    callee === "sendCorrelatedLeadEvent" ||
    /(^|\.)dataLayer\.push$/.test(callee) ||
    callee === "gtag"
  );
}

function pushes(path) {
  const ast = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  return descendants(ast, (node) => ts.isCallExpression(node) && isPush(node));
}

function keyName(property) {
  return ts.isShorthandPropertyAssignment(property) ||
    ts.isPropertyAssignment(property)
    ? property.name.text
    : undefined;
}

function eventName(literal) {
  const property = literal.properties.find(
    (item) => ts.isPropertyAssignment(item) && keyName(item) === "event",
  );
  return property && ts.isStringLiteral(property.initializer)
    ? property.initializer.text
    : undefined;
}

function violations(call, file) {
  const found = [];
  const callee = call.expression.getText();
  const literal = call.arguments[0];
  if (!literal || !ts.isObjectLiteralExpression(literal)) {
    return [`${callee}: argumento que não é objeto literal`];
  }
  if (file === helperFile) {
    for (const property of literal.properties) {
      const spreadsEvent =
        ts.isSpreadAssignment(property) &&
        property.expression.getText() === "event";
      if (!spreadsEvent && keyName(property) !== "lead_observation_id") {
        found.push(
          `${callee}: ${property.getText()} fora do contrato do helper`,
        );
      }
    }
    return found;
  }
  if (literal.properties.some(ts.isSpreadAssignment)) {
    found.push(`${callee}: spread no push`);
  }
  for (const identifier of descendants(literal, ts.isIdentifier)) {
    if (personalData.test(identifier.text)) {
      found.push(`${callee}: identificador ${identifier.text}`);
    }
  }
  for (const property of descendants(literal, ts.isPropertyAssignment)) {
    const key = keyName(property);
    if (personalData.test(key)) found.push(`${callee}: chave ${key}`);
    if (key === "value") {
      const initializer = property.initializer;
      const literalValue =
        ts.isStringLiteral(initializer) ||
        ts.isNoSubstitutionTemplateLiteral(initializer);
      if (!literalValue && !staticValues.has(initializer.getText())) {
        found.push(`${callee}: value ${initializer.getText()}`);
      }
    }
  }
  if (eventName(literal) === "buttonWhatsappClicked") {
    for (const property of literal.properties) {
      const key = keyName(property);
      if (!whatsappKeys.has(key)) {
        found.push(`${callee}: buttonWhatsappClicked com ${key}`);
      }
    }
  }
  return found;
}

const files = sourceFiles(src)
  .map((path) => ({ path, file: relative(src, path).split("\\").join("/") }))
  .filter(({ path }) => pushes(path).length > 0);

test("the scanner finds the pushes of the lead events", () => {
  assert.ok(files.length > 0);
  const whatsapp = files.flatMap(({ path }) =>
    pushes(path).filter((call) =>
      /buttonWhatsappClicked/.test(call.arguments[0]?.getText() ?? ""),
    ),
  );
  assert.ok(whatsapp.length > 0);
});

test("only the loader and the helper touch the dataLayer directly", () => {
  const direct = sourceFiles(src)
    .filter((path) => /dataLayer|gtag\(|fbq\(/.test(readFileSync(path, "utf8")))
    .map((path) => relative(src, path).split("\\").join("/"));
  assert.deepEqual(direct, [bootstrapFile]);
});

for (const { path, file } of files) {
  test(`dataLayer pushes carry no personal data: ${file}`, () => {
    const found = pushes(path).flatMap((call) => violations(call, file));
    assert.deepEqual(found, []);
  });
}
