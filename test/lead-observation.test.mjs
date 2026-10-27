import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const id = "obs_submission_20261015";
const secondId = "obs_second_submission";
const forms = [
  "sono/ScheduleDialog.tsx",
  "lp3/LandingClient.tsx",
  "bem-estar/LandingClient.tsx",
  "lp7/QuizClient.tsx",
  "lp2/page.tsx",
  "lp13/ScheduleDialog.tsx",
  "lp11/LandingClient.tsx",
  "vsl/ScheduleDialog.tsx",
  "objetivo/LandingClient.tsx",
  "oferta/LandingClient.tsx",
  "(lp)/page.tsx",
  "lp4/LandingClient.tsx",
  "lp5/LandingClient.tsx",
  "consulta/LandingClient.tsx",
  "lp8/QuizClient.tsx",
  "primeiro-passo/LandingClient.tsx",
  "lp15/ScheduleDialog.tsx",
  "lp9/LandingClient.tsx",
  "click/ClickLanding.tsx",
  "lp14/ScheduleDialog.tsx",
  "lp6/QuizClient.tsx",
  "lp12/LandingClient.tsx",
  "bio/ScheduleDialog.tsx",
  "online/LandingClient.tsx",
  "ajuda/LandingClient.tsx",
  "dormir/LandingClient.tsx",
  "especialistas/LandingClient.tsx",
  "primeiro-passo-sono/LandingClient.tsx",
];
const withoutLegacy = new Set([
  "lp2/page.tsx",
  "lp11/LandingClient.tsx",
  "oferta/LandingClient.tsx",
  "(lp)/page.tsx",
  "lp9/LandingClient.tsx",
  "click/ClickLanding.tsx",
]);
const plain = (value) => JSON.parse(JSON.stringify(value));
const source = (path) => readFileSync(join(root, path), "utf8");

function parse(path) {
  return ts.createSourceFile(path, source(path), ts.ScriptTarget.Latest, true);
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

function calls(node, name) {
  return descendants(
    node,
    (item) => ts.isCallExpression(item) && item.expression.getText() === name,
  );
}

function containingFunction(node) {
  while (node && !ts.isFunctionLike(node)) node = node.parent;
  return node;
}

function load(path, context, imports = {}, text = source(path)) {
  const output = ts.transpileModule(text, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: path,
    reportDiagnostics: true,
  });
  assert.equal(output.diagnostics.length, 0);
  const exports = {};
  runInNewContext(
    output.outputText,
    {
      exports,
      module: { exports },
      URL,
      URLSearchParams,
      Blob,
      ...context,
      require(name) {
        assert.ok(Object.hasOwn(imports, name), `Unexpected import ${name}`);
        return imports[name];
      },
    },
    { filename: path },
  );
  return exports;
}

function harness(options = {}) {
  const messages = [];
  const requests = [];
  const beacons = [];
  let captures = 0;
  const location = new URL(
    `https://lp.example.test/form${options.search ?? ""}`,
  );
  const context = {
    window: { location },
    document: {
      cookie: options.cookie ?? "_fbp=fb.fixture; _fbc=fb.1.123.click.fixture",
      referrer: "https://referrer.example.test/",
    },
    navigator: {
      language: "pt-BR",
      platform: "FixtureOS",
      userAgent: "Synthetic browser",
      appVersion: "Fixture1",
      sendBeacon(endpoint, body) {
        beacons.push({ endpoint, body });
        return options.beaconAccepted ?? false;
      },
    },
    process: { env: { NODE_ENV: "production" } },
    fetch(endpoint, init) {
      requests.push({ endpoint, ...init });
      return Promise.resolve({ ok: true });
    },
  };
  const helper = load("apps/web/src/lib/lead-observation.ts", context, {
    "@click-cannabis/tracking-edge/browser": {
      captureLead() {
        captures++;
        if (options.captureThrows) throw new Error("SDK unavailable");
        return Object.hasOwn(options, "result") ? options.result : id;
      },
    },
    "@next/third-parties/google": {
      sendGTMEvent(message) {
        messages.push(message);
        options.onMessage?.(message);
        if (options.sendThrows?.includes(messages.length)) {
          throw new Error("GTM unavailable");
        }
      },
    },
  });
  const crm = load("apps/web/src/lib/crmLead.ts", context);
  return {
    helper,
    crm,
    context,
    messages,
    requests,
    beacons,
    get captures() {
      return captures;
    },
  };
}

test("accepts only a complete opaque observation ID", () => {
  const { normalizeLeadObservationId } = harness().helper;
  for (const value of [
    id,
    "obs_12345678",
    `obs_${"a".repeat(64)}`,
    "obs_a_B-c_D-",
  ]) {
    assert.equal(normalizeLeadObservationId(value), value);
  }
  for (const value of [
    undefined,
    null,
    false,
    42,
    {},
    [],
    Promise.resolve(id),
    "",
    "ctx_12345678",
    "person@example.test",
    "obs_short",
    `obs_${"a".repeat(65)}`,
    ` ${id}`,
    `${id} `,
    `${id}\n`,
    `${id}\r\n`,
    `${id}/`,
    "obs_1234567é",
    { observation_id: id },
  ]) {
    assert.equal(normalizeLeadObservationId(value), undefined);
  }
});

test("copies the legacy data object without changing existing fields", () => {
  const h = harness();
  const data = Object.freeze({
    utm_source: "fixture",
    referrer: "ref",
    pageUrl: "url",
  });
  const payload = Object.freeze({
    name: "Synthetic",
    patologies: ["Fixture"],
    data,
  });
  const enriched = h.helper.withLeadObservation(payload, id);
  assert.deepEqual(plain(enriched), {
    ...payload,
    data: { ...data, lead_observation_id: id },
  });
  assert.notEqual(enriched, payload);
  assert.notEqual(enriched.data, payload.data);
  assert.equal(enriched.patologies, payload.patologies);
  assert.equal(Object.hasOwn(payload.data, "lead_observation_id"), false);
  for (const value of [undefined, "ctx_12345678", "invalid"]) {
    assert.equal(h.helper.withLeadObservation(payload, value), payload);
  }
});

test("one capture supplies the same ID to the existing event and legacy request", () => {
  const h = harness();
  const captured = h.helper.captureLeadObservation();
  const payload = {
    name: "Synthetic",
    patologies: ["Fixture"],
    data: { utm_source: "fixture" },
  };
  h.context.fetch("/api/leads", {
    body: JSON.stringify(h.helper.withLeadObservation(payload, captured)),
  });
  const event = Object.freeze({
    event: "buttonWhatsappClicked",
    category: "Lead",
    action: "Click",
    label: "Existing label",
    value: "Fixture",
    leadData: payload,
  });
  h.helper.sendCorrelatedLeadEvent(event, captured);
  assert.equal(h.captures, 1);
  assert.equal(JSON.parse(h.requests[0].body).data.lead_observation_id, id);
  assert.deepEqual(plain(h.messages), [
    { ...event, lead_observation_id: id },
    { lead_observation_id: null },
  ]);
  assert.equal(Object.hasOwn(event, "lead_observation_id"), false);
});

for (const sendThrows of [[], [1], [2], [1, 2]]) {
  test(`event result reports invocation failures without blocking submission: ${JSON.stringify(sendThrows)}`, () => {
    const h = harness({ sendThrows });
    const event = Object.freeze({
      event: "buttonWhatsappClicked",
      label: "Existing label",
    });
    const result = h.helper.sendCorrelatedLeadEvent(event, id);
    h.crm.sendLeadToCrm("Synthetic", ["Fixture"]);
    h.context.fetch("/api/leads", { body: JSON.stringify({ data: {} }) });
    assert.equal(result, sendThrows.length === 0);
    assert.deepEqual(plain(h.messages), [
      { ...event, lead_observation_id: id },
      { lead_observation_id: null },
    ]);
    assert.equal(h.captures, 0);
    assert.equal(h.requests.length, 2);
    assert.equal(Object.hasOwn(event, "lead_observation_id"), false);
  });
}

for (const options of [
  { result: undefined },
  { result: "ctx_12345678" },
  { result: {} },
  { captureThrows: true },
  { sendThrows: [1] },
  { sendThrows: [1, 2] },
]) {
  test(`tracking failure preserves submission: ${JSON.stringify(options)}`, () => {
    const h = harness(options);
    let continued = false;
    const captured = h.helper.captureLeadObservation();
    h.helper.sendCorrelatedLeadEvent(
      { event: "buttonWhatsappClicked" },
      captured,
    );
    h.crm.sendLeadToCrm("Synthetic", ["Fixture"]);
    const payload = h.helper.withLeadObservation({ data: {} }, captured);
    h.context.fetch("/api/leads", { body: JSON.stringify(payload) });
    continued = true;
    assert.equal(continued, true);
    assert.equal(h.captures, 1);
    assert.equal(h.requests.length, 2);
    assert.equal(h.messages.length, 2);
    assert.deepEqual(plain(h.messages[1]), { lead_observation_id: null });
    assert.equal(h.messages[0].lead_observation_id, captured ?? null);
    assert.equal(
      JSON.parse(h.requests[1].body).data.lead_observation_id,
      captured,
    );
  });
}

function consumer() {
  const state = {};
  const events = [];
  return {
    events,
    consume(message) {
      Object.assign(state, message);
      if (message.event) events.push({ ...state });
    },
  };
}

test("FIFO cleanup prevents stale IDs in two live and two late container models", () => {
  const live = [consumer(), consumer()];
  const h = harness({
    onMessage: (message) => live.forEach((item) => item.consume(message)),
  });
  h.helper.sendCorrelatedLeadEvent(
    { event: "buttonWhatsappClicked", label: "first" },
    id,
  );
  h.helper.sendCorrelatedLeadEvent(
    { event: "buttonWhatsappClicked", label: "second" },
    secondId,
  );
  h.helper.sendCorrelatedLeadEvent(
    {
      event: "buttonWhatsappClicked",
      label: "missing",
      lead_observation_id: id,
    },
    undefined,
  );
  const unrelated = { event: "buttonClick", label: "unrelated" };
  live.forEach((item) => item.consume(unrelated));
  const late = [consumer(), consumer()];
  late.forEach((item) => [...h.messages, unrelated].forEach(item.consume));
  for (const item of [...live, ...late]) {
    assert.deepEqual(
      item.events.map((event) => event.lead_observation_id),
      [id, secondId, null, null],
    );
    assert.equal(
      item.events.filter((event) => event.event === "buttonWhatsappClicked")
        .length,
      3,
    );
  }
  assert.equal(
    h.messages.filter((message) => Object.hasOwn(message, "event")).length,
    3,
  );
  assert.equal(h.messages.length, 6);
});

test("CRM request retains its existing bytes, endpoint, keepalive and atomic UTM defaults", () => {
  const defaults = {
    utmSource: "organico_bio",
    utmMedium: "bio",
    utmContent: "lp_bio",
  };
  for (const [search, origin, expectedUtm] of [
    ["", undefined, {}],
    ["", defaults, defaults],
    [
      "?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
      defaults,
      { utmSource: "ig", utmMedium: "social", utmContent: "link_in_bio" },
    ],
    ["?utm_medium=&utm_source=%20", defaults, defaults],
    ["?utm_campaign=fixture", defaults, { utmCampaign: "fixture" }],
    [
      "?utm_source=%20&utm_medium=",
      undefined,
      { utmSource: " ", utmMedium: "" },
    ],
  ]) {
    const h = harness({ search });
    h.crm.sendLeadToCrm("Synthetic", ["Fixture"], origin);
    assert.equal(h.captures, 0);
    assert.equal(h.requests.length, 1);
    const expected = {
      name: "Synthetic",
      pathologies: ["Fixture"],
      utmSource: expectedUtm.utmSource,
      utmMedium: expectedUtm.utmMedium,
      utmCampaign: expectedUtm.utmCampaign,
      utmContent: expectedUtm.utmContent,
      fbclid: "click.fixture",
      fbp: "fb.fixture",
      fbc: "fb.1.123.click.fixture",
      pageUrl: `https://lp.example.test/form${search}`,
      referrer: "https://referrer.example.test/",
      language: "pt-BR",
      platform: "FixtureOS",
      userAgent: "Synthetic browser",
      appVersion: "lpclick-v1",
    };
    assert.equal(
      h.requests[0].endpoint,
      "https://projetocrm-api.runveloz.com/public/site-leads",
    );
    assert.equal(h.requests[0].method, "POST");
    assert.equal(h.requests[0].keepalive, true);
    assert.equal(h.requests[0].body, JSON.stringify(expected));
    assert.equal(h.requests[0].headers["Content-Type"], "application/json");
  }
});

for (const form of forms) {
  test(`structural wiring, not UI execution: ${form}`, () => {
    const ast = parse(`apps/web/src/app/${form}`);
    const captures = calls(ast, "captureLeadObservation");
    const crm = calls(ast, "sendLeadToCrm");
    const events = calls(ast, "sendCorrelatedLeadEvent");
    assert.equal(captures.length, 1);
    assert.equal(crm.length, 1);
    assert.equal(events.length, 1);
    assert.equal(calls(ast, "captureLead").length, 0);
    const handler = containingFunction(captures[0]);
    assert.equal(containingFunction(crm[0]), handler);
    assert.equal(containingFunction(events[0]), handler);
    assert.ok(captures[0].pos < crm[0].pos);
    assert.ok(captures[0].pos < events[0].pos);
    assert.ok(ts.isVariableDeclaration(captures[0].parent));
    assert.equal(captures[0].parent.name.getText(), "leadObservationId");
    assert.equal(events[0].arguments[1].getText(), "leadObservationId");
    assert.match(
      events[0].arguments[0].getText(),
      /event:\s*"buttonWhatsappClicked"/,
    );
    assert.ok(
      descendants(
        handler,
        (node) =>
          ts.isIfStatement(node) &&
          node.end < captures[0].pos &&
          /!trimmed|!cleanName/.test(node.expression.getText()) &&
          descendants(node, ts.isReturnStatement).length > 0,
      ).length > 0,
    );
    assert.equal(
      calls(ast, "sendGTMEvent").filter((call) =>
        /buttonWhatsappClicked/.test(call.getText()),
      ).length,
      0,
    );
    const legacy = calls(ast, "sendLeadToApi");
    assert.equal(legacy.length, withoutLegacy.has(form) ? 0 : 1);
    if (!legacy.length) return;
    assert.ok(captures[0].pos < legacy[0].pos);
    assert.equal(containingFunction(legacy[0]), handler);
    if (form.includes("QuizClient")) {
      assert.equal(legacy[0].arguments[2].getText(), "leadObservationId");
      const sender = ast.statements.find(
        (node) =>
          ts.isFunctionDeclaration(node) && node.name?.text === "sendLeadToApi",
      );
      assert.equal(sender.parameters[2].name.getText(), "leadObservationId");
      assert.ok(sender.parameters[2].questionToken);
      assert.equal(
        calls(sender, "withLeadObservation")[0].arguments[1].getText(),
        "leadObservationId",
      );
    } else {
      const wrapped = legacy[0].arguments[0];
      assert.ok(ts.isCallExpression(wrapped));
      assert.equal(wrapped.expression.getText(), "withLeadObservation");
      assert.equal(wrapped.arguments[0].getText(), "leadData");
      assert.equal(wrapped.arguments[1].getText(), "leadObservationId");
    }
  });
}

test("CRM caller inventory includes every current form", () => {
  const found = [];
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (
        /\.tsx?$/.test(path) &&
        /sendLeadToCrm\(/.test(readFileSync(path, "utf8"))
      ) {
        found.push(path.slice(join(root, "apps/web/src/app").length + 1));
      }
    }
  }
  visit(join(root, "apps/web/src/app"));
  assert.deepEqual(found.sort(), [...forms].sort());
});

function legacySender(form, h) {
  const path = `apps/web/src/app/${form}`;
  const ast = parse(path);
  const localSender = ast.statements.some(
    (node) =>
      ts.isFunctionDeclaration(node) && node.name?.text === "sendLeadToApi",
  );
  const senderPath = localSender
    ? path
    : `apps/web/src/app/${dirname(form)}/lead.ts`;
  const senderAst = parse(senderPath);
  const functionNames = new Set([
    "readCookie",
    "readFbclid",
    "readDeprecatedNav",
    "collectLeadData",
    "sendLeadToApi",
  ]);
  const variableNames = new Set([
    "LEADS_API_ENDPOINT",
    "BIO_ORIGIN",
    "UTM_KEYS",
  ]);
  const selected = senderAst.statements.filter(
    (node) =>
      (ts.isFunctionDeclaration(node) && functionNames.has(node.name?.text)) ||
      (ts.isVariableStatement(node) &&
        node.declarationList.declarations.every((declaration) =>
          variableNames.has(declaration.name.getText()),
        )),
  );
  const declarations = selected.map((node) => node.getText()).join("\n");
  return load(
    senderPath,
    { ...h.context, withLeadObservation: h.helper.withLeadObservation },
    {},
    `${declarations}\nexport { sendLeadToApi${form.includes("QuizClient") ? "" : ", collectLeadData"} };`,
  );
}

for (const form of forms.filter((form) => !withoutLegacy.has(form))) {
  for (const beaconAccepted of [false, true]) {
    test(`actual legacy sender in fake browser (${beaconAccepted ? "beacon" : "fetch"}): ${form}`, async () => {
      const h = harness({
        beaconAccepted,
        search: "?utm_source=fixture&utm_medium=unit&utm_campaign=preserved",
      });
      const sender = legacySender(form, h);
      const captured = h.helper.captureLeadObservation();
      let original;
      if (form.includes("QuizClient")) {
        sender.sendLeadToApi("Synthetic", ["Fixture"], captured);
      } else {
        original = sender.collectLeadData("Synthetic", ["Fixture"]);
        sender.sendLeadToApi(h.helper.withLeadObservation(original, captured));
      }
      h.helper.sendCorrelatedLeadEvent(
        { event: "buttonWhatsappClicked" },
        captured,
      );
      assert.equal(h.captures, 1);
      assert.equal(h.beacons.length, 1);
      assert.equal(h.requests.length, beaconAccepted ? 0 : 1);
      const body = beaconAccepted
        ? await h.beacons[0].body.text()
        : h.requests[0].body;
      const payload = JSON.parse(body);
      assert.equal(
        payload.data.lead_observation_id,
        h.messages[0].lead_observation_id,
      );
      assert.equal(payload.data.lead_observation_id, id);
      assert.equal(payload.data.utm_source, "fixture");
      assert.equal(payload.data.utm_medium, "unit");
      assert.equal(payload.data.utm_campaign, "preserved");
      if (original) {
        assert.deepEqual(payload, {
          ...plain(original),
          data: { ...plain(original.data), lead_observation_id: id },
        });
        assert.equal(
          Object.hasOwn(original.data, "lead_observation_id"),
          false,
        );
      }
      if (!beaconAccepted) {
        assert.equal(h.requests[0].endpoint, "/api/leads");
        assert.equal(h.requests[0].keepalive, true);
      }
    });
  }
}
