import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const routes = [
  {
    route: "/avaliacao",
    file: "apps/web/src/app/avaliacao/AvaliacaoClient.tsx",
    name: "Avaliacao",
  },
  {
    route: "/green-friday",
    file: "apps/web/src/app/green-friday/GreenFridayClient.tsx",
    name: "Green Friday",
  },
];
const entry = "Já fiz uma consulta";
const patientPaths = [
  ["Ainda não", "Quero começar meu tratamento"],
  ["Ainda não", "Ainda tenho dúvidas"],
  ["Sim, já comecei", "Ainda não", "Agendar meu retorno grátis"],
  ["Sim, já comecei", "Sim, já fiz", "Agendar uma nova consulta de retorno"],
  [
    "Sim, já comecei",
    "Sim, já fiz",
    "Tirar uma dúvida com um médico especialista",
  ],
];
const leadPath = [
  "Quero agendar a 1ª consulta",
  "Para mim",
  "Dormir melhor",
  "Continuar",
  "Continuar",
  "Menos de 6 meses",
  "Sim",
  "Ver como funciona",
  "Quero agendar minha consulta",
  "Não, obrigado",
];

function quizStep(name, screen) {
  return {
    event: "quizStep",
    category: "Quiz",
    action: "View",
    label: `${name} - ${screen}`,
  };
}

function text(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  if (node && typeof node === "object") return text(node.props?.children);
  return "";
}

function actions(node, found = []) {
  if (Array.isArray(node)) {
    for (const item of node) actions(item, found);
    return found;
  }
  if (!node || typeof node !== "object" || !node.props) return found;
  const { opcoes, onClick, children } = node.props;
  if (Array.isArray(opcoes)) {
    for (const item of opcoes) {
      found.push({ label: item.label, run: item.onClick });
    }
  }
  if (typeof onClick === "function") {
    found.push({
      label: node.props["aria-label"] ?? text(children),
      run: onClick,
    });
  }
  return actions(children, found);
}

function field(node, placeholder) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = field(item, placeholder);
      if (hit) return hit;
    }
    return null;
  }
  if (!node || typeof node !== "object" || !node.props) return null;
  if (node.props.placeholder === placeholder) return node;
  return field(node.props.children, placeholder);
}

function session(file) {
  const cells = [];
  const pending = [];
  const dataLayer = [];
  let cursor = 0;
  let dirty = false;
  let tree = null;

  const sameDeps = (a, b) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => Object.is(value, b[index]));
  const cell = (create) => {
    const index = cursor++;
    cells[index] ??= create();
    return cells[index];
  };
  const react = {
    useState(initial) {
      const state = cell(() => {
        const box = { value: initial };
        box.set = (next) => {
          const value = typeof next === "function" ? next(box.value) : next;
          if (!Object.is(value, box.value)) {
            box.value = value;
            dirty = true;
          }
        };
        return box;
      });
      return [state.value, state.set];
    },
    useRef(initial) {
      return cell(() => ({ current: initial }));
    },
    useCallback(callback, deps) {
      const memo = cell(() => ({ callback, deps }));
      if (!sameDeps(memo.deps, deps)) {
        memo.callback = callback;
        memo.deps = deps;
      }
      return memo.callback;
    },
    useEffect(effect, deps) {
      const slot = cell(() => ({ deps: null, cleanup: undefined }));
      if (!sameDeps(slot.deps, deps)) {
        slot.deps = deps;
        pending.push({ slot, effect });
      }
    },
  };
  const jsx = (type, props, key) => ({ type, props, key });
  const imports = {
    react,
    "react/jsx-runtime": { Fragment: Symbol("Fragment"), jsx, jsxs: jsx },
    "framer-motion": {
      AnimatePresence: "AnimatePresence",
      motion: new Proxy({}, { get: (_, tag) => tag }),
      useReducedMotion: () => true,
    },
    "@next/third-parties/google": {
      sendGTMEvent(message) {
        dataLayer.push(JSON.parse(JSON.stringify(message)));
      },
    },
    "@/lib/crmLead": { sendLeadToCrm() {} },
    "@/lib/lead-observation": {
      captureLeadObservation: () => undefined,
      withLeadObservation: (payload) => payload,
      sendCorrelatedLeadEvent() {},
    },
    "./lead": {
      buildWhatsAppUrl: (message) =>
        `https://wa.example.test/?text=${encodeURIComponent(message)}`,
      collectLeadData: () => ({}),
      sendLeadToApi() {},
      sendQuizAnswers() {},
    },
    "./Ilustra": { Cena: "Cena", SimboloClick: "SimboloClick" },
    "./som": { tocarToque() {} },
    "./Roleta": { default: "Roleta", PREMIOS: {}, premioSalvo: () => null },
  };
  const output = ts.transpileModule(readFileSync(join(root, file), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: file,
    reportDiagnostics: true,
  });
  assert.equal(output.diagnostics.length, 0);
  const exports = {};
  runInNewContext(
    output.outputText,
    {
      exports,
      module: { exports },
      window: { scrollTo() {}, open() {} },
      setTimeout: () => 0,
      clearTimeout() {},
      require(name) {
        assert.ok(Object.hasOwn(imports, name), `Unexpected import ${name}`);
        return imports[name];
      },
    },
    { filename: file },
  );
  const props = { depoimentos: new Proxy({}, { get: () => [] }) };

  function render() {
    for (let round = 0; round < 50; round++) {
      cursor = 0;
      dirty = false;
      tree = exports.default(props);
      for (const { slot, effect } of pending.splice(0)) {
        slot.cleanup?.();
        slot.cleanup = effect();
      }
      if (!dirty) return;
    }
    assert.fail("render did not settle");
  }

  render();
  return {
    dataLayer,
    has: (label) => actions(tree).some((action) => action.label === label),
    click(label) {
      const found = actions(tree).filter((action) => action.label === label);
      assert.equal(
        found.length,
        1,
        `${label} in ${JSON.stringify(actions(tree).map((a) => a.label))}`,
      );
      found[0].run();
      render();
    },
    type(placeholder, value) {
      const input = field(tree, placeholder);
      assert.ok(input, placeholder);
      input.props.onChange({ target: { value } });
      render();
    },
  };
}

function patient(file, path) {
  const view = session(file);
  view.click(entry);
  for (const label of path) view.click(label);
  return view;
}

for (const { route, file, name } of routes) {
  const label = (path) => path.join(" > ");

  test(`${route}: every patient path leaves the same dataLayer sequence`, () => {
    const expected = [
      quizStep(name, "inicio"),
      quizStep(name, "paciente"),
      quizStep(name, "nome"),
      {
        event: "buttonClick",
        category: "Paciente",
        action: "Click",
        label: `Enviar no WhatsApp - ${name} paciente`,
      },
    ];
    for (const path of patientPaths) {
      const view = patient(file, path);
      view.type("Digite seu nome", "Maria");
      view.click("Ir para o WhatsApp");
      assert.deepEqual(view.dataLayer, expected, label(path));
    }
  });

  test(`${route}: going back from the name step leaves the same dataLayer sequence`, () => {
    const expected = [
      quizStep(name, "inicio"),
      quizStep(name, "paciente"),
      quizStep(name, "nome"),
      quizStep(name, "paciente"),
      quizStep(name, "inicio"),
    ];
    for (const path of patientPaths) {
      const view = patient(file, path);
      while (!view.has(entry)) view.click("Voltar");
      assert.deepEqual(view.dataLayer, expected, label(path));
    }
  });

  test(`${route}: the lead branch emits one quizStep per screen`, () => {
    const view = session(file);
    for (const step of leadPath) view.click(step);
    assert.deepEqual(
      view.dataLayer,
      [
        "inicio",
        "para-quem",
        "objetivo",
        "prova",
        "tempo",
        "contato",
        "acolhimento",
        "como-funciona",
        "condicao",
        "nome",
      ].map((screen) => quizStep(name, screen)),
    );
  });
}
