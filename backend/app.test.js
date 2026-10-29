// Pruebas de las 3 funciones: acortar, redirigir y estadísticas.
// Se ejecutan con: npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createApp } = require("./app");
const { createStore } = require("./store");

let server;
let baseUrl;
const dataFile = path.join(os.tmpdir(), `urls-test-${Date.now()}.json`);

before(async () => {
  const store = createStore(dataFile);
  const app = createApp(store, () => baseUrl);
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(dataFile, { force: true });
});

async function shorten(url) {
  const res = await fetch(`${baseUrl}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  return { status: res.status, body: await res.json() };
}

test("POST /shorten genera un código y la URL corta", async () => {
  const { status, body } = await shorten("https://youtube.com");
  assert.strictEqual(status, 200);
  assert.match(body.code, /^[a-z0-9]{1,6}$/);
  assert.strictEqual(body.shortUrl, `${baseUrl}/${body.code}`);
});

test("POST /shorten rechaza una URL inválida", async () => {
  const { status } = await shorten("esto no es una url");
  assert.strictEqual(status, 400);
});

test("GET /:codigo redirige con 302 y cuenta la visita", async () => {
  const { body } = await shorten("https://github.com");

  const res = await fetch(`${baseUrl}/${body.code}`, { redirect: "manual" });
  assert.strictEqual(res.status, 302);
  assert.strictEqual(res.headers.get("location"), "https://github.com");

  const stats = await (await fetch(`${baseUrl}/stats/${body.code}`)).json();
  assert.strictEqual(stats.totalClicks, 1);
  assert.strictEqual(stats.visits.length, 1);
});

test("GET /stats/:codigo filtra por fecha", async () => {
  const { body } = await shorten("https://example.com");
  await fetch(`${baseUrl}/${body.code}`, { redirect: "manual" });

  const today = new Date().toISOString().split("T")[0];
  const hoy = await (await fetch(`${baseUrl}/stats/${body.code}?date=${today}`)).json();
  const otra = await (await fetch(`${baseUrl}/stats/${body.code}?date=2000-01-01`)).json();

  assert.strictEqual(hoy.visits.length, 1);
  assert.strictEqual(otra.visits.length, 0);
  assert.strictEqual(otra.filteredDate, "2000-01-01");
});

test("código inexistente devuelve 404", async () => {
  const res1 = await fetch(`${baseUrl}/noexiste`, { redirect: "manual" });
  const res2 = await fetch(`${baseUrl}/stats/noexiste`);
  assert.strictEqual(res1.status, 404);
  assert.strictEqual(res2.status, 404);
});
