import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Script } from "node:vm";
import ts from "typescript";
const candidate = process.env.TRACKING_EDGE_CANDIDATE_DIR;
const tracking = await import(
  candidate
    ? pathToFileURL(join(candidate, "dist/src/index.js")).href
    : "@click-cannabis/tracking-edge"
);
const edge = await import(
  candidate
    ? pathToFileURL(join(candidate, "dist/src/edge.js")).href
    : "@click-cannabis/tracking-edge/edge"
);

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = existsSync(join(root, "apps/web/src"))
  ? join(root, "apps/web")
  : root;

function sourceLoader(overrides = new Map()) {
  const modules = new Map();
  function load(file) {
    if (modules.has(file)) return modules.get(file).exports;
    const loadedModule = { exports: {} };
    modules.set(file, loadedModule);
    const output = ts.transpileModule(readFileSync(file, "utf8"), {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });
    const localRequire = (name) => {
      if (overrides.has(name)) return overrides.get(name);
      if (name === "@click-cannabis/tracking-edge") return tracking;
      if (name === "@click-cannabis/tracking-edge/edge") return edge;
      if (name.startsWith("@/"))
        return load(join(app, "src", `${name.slice(2)}.ts`));
      return require(name);
    };
    const execute = new Script(
      `(function(require, module, exports) {${output.outputText}\n})`,
      {
        filename: file,
      },
    ).runInThisContext();
    execute(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return (relative) => load(join(app, relative));
}

function observation() {
  return tracking.buildBrowserEnriched({
    trackingContextId: edge.generateTrackingContextId(),
    consent: { status: "granted", source: "default" },
    host: "127.0.0.1",
    path: "/",
    enrichment: {},
  });
}

function request(payload, headers = {}) {
  return new NextRequest("http://127.0.0.1/api/tracking/observations", {
    method: "POST",
    headers: {
      host: "127.0.0.1",
      origin: "http://127.0.0.1",
      "content-type": "application/json",
      cookie: `ctx1=${payload.tracking_context_id}`,
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

test("tracking consumers require the upstream receipt", async (t) => {
  const saved = Object.fromEntries(
    ["VERCEL_ENV", "TRACKING_SINK_URL", "TRACKING_INGEST_TOKEN"].map((key) => [
      key,
      process.env[key],
    ]),
  );
  t.diagnostic(
    `tracking package: ${candidate ?? require.resolve("@click-cannabis/tracking-edge")}`,
  );
  t.diagnostic(
    `Node ${process.version}; TypeScript ${ts.version}; Next ${require("next/package.json").version}`,
  );
  const calls = [];
  let reply = (value) => ({
    status: 200,
    body: { accepted: true, observation_id: value.observation_id },
  });
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const value = JSON.parse(Buffer.concat(chunks).toString());
    calls.push({ value, authorization: req.headers.authorization });
    const result = reply(value);
    if (!result) return;
    res.writeHead(result.status, {
      "content-type": "application/json",
      ...result.headers,
    });
    res.end(result.raw ?? JSON.stringify(result.body));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  process.env.VERCEL_ENV = "development";
  process.env.TRACKING_SINK_URL = `http://127.0.0.1:${server.address().port}/observations`;
  process.env.TRACKING_INGEST_TOKEN = "synthetic-local-receipts-token";
  try {
    const load = sourceLoader();
    const { POST } = load("src/app/api/tracking/observations/route.ts");
    const cases = [
      ["missing receipt", { accepted: true }, 200, 503],
      ["null receipt", { accepted: true, observation_id: null }, 200, 503],
      ["empty receipt", { accepted: true, observation_id: "" }, 200, 503],
      [
        "mismatched receipt",
        { accepted: true, observation_id: "obs_other" },
        200,
        503,
      ],
      ["non-JSON receipt", null, 200, 503, {}, "invalid-json"],
      ["conflict", { accepted: false, conflict: true }, 409, 409],
      [
        "conflict with successful HTTP",
        { accepted: true, conflict: true },
        200,
        409,
      ],
      [
        "rate limited upstream",
        { accepted: false },
        429,
        429,
        { "retry-after": "1.2" },
      ],
      [
        "unavailable upstream",
        { accepted: false },
        503,
        503,
        { "retry-after": "1.2" },
      ],
      ["invalid upstream request", { accepted: false }, 422, 422],
    ];
    for (const [name, body, status, expected, headers, raw] of cases) {
      await t.test(name, async () => {
        reply = () => ({ status, body, headers, raw });
        const response = await POST(request(observation()));
        assert.equal(response.status, expected);
        assert.deepEqual(await response.json(), { accepted: false });
        assert.equal(response.headers.get("cache-control"), "no-store");
        if (headers?.["retry-after"])
          assert.equal(response.headers.get("retry-after"), "2");
        assert.equal(
          calls.at(-1).authorization,
          "Bearer synthetic-local-receipts-token",
        );
      });
    }
    await t.test(
      "permissive transport reproduces the original missing-receipt defect",
      async () => {
        reply = () => ({ status: 200, body: { accepted: true } });
        const permissive = sourceLoader(
          new Map([
            [
              "@click-cannabis/tracking-edge",
              {
                ...tracking,
                createHttpSinkTransport: (options) =>
                  tracking.createHttpSinkTransport({
                    ...options,
                    requireObservationId: false,
                  }),
              },
            ],
          ]),
        )("src/app/api/tracking/observations/route.ts");
        const value = observation();
        const weak = await permissive.POST(request(value));
        assert.equal(weak.status, 200);
        assert.deepEqual(await weak.json(), {
          accepted: true,
          duplicate: false,
          observation_id: value.observation_id,
        });
        const strict = await POST(request(value));
        assert.equal(strict.status, 503);
        assert.deepEqual(await strict.json(), { accepted: false });
      },
    );
    await t.test("exact receipt and duplicate propagate", async () => {
      const value = observation();
      reply = (payload) => ({
        status: 200,
        body: {
          accepted: true,
          duplicate: true,
          observation_id: payload.observation_id,
        },
      });
      const response = await POST(request(value));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), {
        accepted: true,
        duplicate: true,
        observation_id: value.observation_id,
      });
      assert.deepEqual(calls.at(-1).value, value);
    });
    await t.test(
      "origin, context and payload validation never reach upstream",
      async () => {
        const before = calls.length;
        const value = observation();
        for (const [payload, headers, status] of [
          [value, { origin: "http://foreign.invalid" }, 403],
          [value, { "sec-fetch-site": "cross-site" }, 403],
          [value, { cookie: `ctx1=${edge.generateTrackingContextId()}` }, 403],
          [
            {
              ...value,
              provenance: { ...value.provenance, host: "foreign.invalid" },
            },
            {},
            403,
          ],
          [{ ...value, type: "invalid" }, {}, 422],
          [value, { "content-type": "text/plain" }, 415],
          [
            value,
            { "content-length": String(tracking.MAX_PAYLOAD_BYTES + 1) },
            413,
          ],
        ])
          assert.equal((await POST(request(payload, headers))).status, status);
        assert.equal(calls.length, before);
      },
    );
    await t.test("local rate limit keeps Retry-After", async () => {
      load("src/lib/tracking-rate-limit.ts").limpaJanelas();
      reply = (value) => ({
        status: 200,
        body: { accepted: true, observation_id: value.observation_id },
      });
      const value = observation();
      for (let i = 0; i < 30; i++)
        assert.equal((await POST(request(value))).status, 200);
      const before = calls.length;
      const response = await POST(request(value));
      assert.equal(response.status, 429);
      assert.ok(Number(response.headers.get("retry-after")) > 0);
      assert.equal(calls.length, before);
    });
    await t.test("upstream timeout remains retryable", async () => {
      reply = () => null;
      const response = await POST(request(observation()));
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), { accepted: false });
    });
    await t.test("missing server auth fails closed", async () => {
      delete process.env.TRACKING_INGEST_TOKEN;
      const withoutAuth = sourceLoader()(
        "src/app/api/tracking/observations/route.ts",
      );
      const before = calls.length;
      assert.equal(
        (await withoutAuth.POST(request(observation()))).status,
        503,
      );
      assert.equal(calls.length, before);
      process.env.TRACKING_INGEST_TOKEN = "synthetic-local-receipts-token";
    });
    for (const valid of [false, true]) {
      await t.test(
        `middleware ${valid ? "accepts exact receipt" : "retries missing receipt"}`,
        async (subtest) => {
          reply = (value) => ({
            status: 200,
            body: {
              accepted: true,
              ...(valid ? { observation_id: value.observation_id } : {}),
            },
          });
          const errors = [];
          subtest.mock.method(console, "error", (...args) => errors.push(args));
          const { middleware } = sourceLoader()("src/middleware.ts");
          const pending = [];
          const before = calls.length;
          const response = middleware(
            new NextRequest("http://127.0.0.1/", {
              headers: { host: "127.0.0.1", accept: "text/html" },
            }),
            { waitUntil: (promise) => pending.push(promise) },
          );
          assert.equal(response.status, 200);
          assert.equal(
            response.headers.get("cache-control"),
            "private, no-store",
          );
          assert.ok(response.cookies.get("ctx1"));
          await Promise.all(pending);
          assert.equal(calls.length - before, valid ? 1 : 3);
          assert.equal(errors.length, valid ? 0 : 1);
          assert.ok(
            calls
              .slice(before)
              .every(
                (call) =>
                  call.authorization ===
                  "Bearer synthetic-local-receipts-token",
              ),
          );
          if (!valid) assert.equal(errors[0][0], "[edge] entrega-esgotada");
        },
      );
    }
    await t.test(
      "browser endpoint follows the application slash policy",
      () => {
        const options = [];
        const loadComponent = sourceLoader(
          new Map([
            [
              "react",
              {
                useEffect: (effect) => effect(),
                useRef: (value) => ({ current: value }),
              },
            ],
            [
              "next/navigation",
              {
                usePathname: () => "/",
                useSearchParams: () => new URLSearchParams(),
              },
            ],
            [
              "@click-cannabis/tracking-edge/browser",
              {
                startBrowserTracking: (value) => {
                  options.push(value);
                  return { capture() {}, stop() {} };
                },
              },
            ],
          ]),
        );
        const { default: Component } = loadComponent(
          "src/components/TrackingContextCapture.tsx",
        );
        Component({ enabled: true, cookieDomain: "127.0.0.1" });
        assert.equal(
          options[0].endpoint,
          app === root
            ? "/api/tracking/observations/"
            : "/api/tracking/observations",
        );
      },
    );
  } finally {
    for (const key of [
      "VERCEL_ENV",
      "TRACKING_SINK_URL",
      "TRACKING_INGEST_TOKEN",
    ]) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
  }
});
