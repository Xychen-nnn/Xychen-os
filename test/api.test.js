const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const app = require('../server');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('health endpoint reports the current service version', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.version, '1.2.0');
  assert.equal(body.website, 'operational');
  assert.equal(body.api, 'operational');
});

test('site metadata describes only currently available features', async () => {
  const response = await fetch(`${baseUrl}/api/site`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.name, 'Xychen OS');
  assert.equal(body.features.projects, true);
  assert.equal(body.features.browserTools, true);
  assert.equal(body.features.accounts, false);
  assert.equal(body.features.communitySubmissions, false);
  assert.equal(body.features.admin, false);
  assert.equal(body.features.externalIntegrations, false);
  assert.equal(Object.hasOwn(body.links, 'playground'), false);
});

test('public pages are served successfully', async () => {
  for (const page of ['/', '/about.html', '/projects.html', '/tools.html', '/links.html']) {
    const response = await fetch(`${baseUrl}${page}`);
    const html = await response.text();

    assert.equal(response.status, 200, `${page} should return 200`);
    assert.match(response.headers.get('content-type') || '', /text\/html/);
    assert.match(html, /<html lang="en"/);
  }
});

test('removed Playground page returns the not-found page', async () => {
  const response = await fetch(`${baseUrl}/playground.html`);
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, /404|not found/i);
});

test('unknown API routes return a JSON 404 response', async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, { error: 'Not found' });
});
