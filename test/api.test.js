const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { after, before, test } = require('node:test');
const app = require('../server');
const { errorHandler } = require('../src/middleware/errors');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  baseUrl = 'http://127.0.0.1:' + address.port;
});

after(async () => {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('health endpoint reports the current service version', async () => {
  const response = await fetch(baseUrl + '/api/health');
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.version, '1.3.0');
  assert.equal(body.website, 'operational');
  assert.equal(body.api, 'operational');
});

test('site metadata describes only currently available features', async () => {
  const response = await fetch(baseUrl + '/api/site');
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.name, 'Xychen OS');
  assert.equal(body.features.projects, true);
  assert.equal(body.features.informationHub, true);
  assert.equal(body.features.browserTools, undefined);
  assert.equal(body.links.explore, '/explore.html');
  assert.equal(Object.hasOwn(body.links, 'tools'), false);
  assert.equal(body.features.accounts, false);
  assert.equal(body.features.communitySubmissions, false);
  assert.equal(body.features.admin, false);
  assert.equal(body.features.externalIntegrations, false);
  assert.equal(Object.hasOwn(body.links, 'playground'), false);
});

test('public pages are served successfully', async () => {
  for (const page of ['/', '/about.html', '/projects.html', '/explore.html', '/article.html', '/links.html']) {
    const response = await fetch(baseUrl + page);
    const html = await response.text();

    assert.equal(response.status, 200, page + ' should return 200');
    assert.match(response.headers.get('content-type') || '', /text\/html/);
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /id="main-content"/);
    assert.match(html, /<noscript><nav aria-label="Main navigation">/);
    assert.match(html, /src="\/js\/theme\.js" defer/);
  }
});

test('content API exposes categories and an honest empty published library', async () => {
  const categoriesResponse = await fetch(baseUrl + '/api/content/categories');
  const articlesResponse = await fetch(baseUrl + '/api/content/articles');
  const categoriesBody = await categoriesResponse.json();
  const articlesBody = await articlesResponse.json();

  assert.equal(categoriesResponse.status, 200);
  assert.ok(categoriesBody.categories.length > 0);
  assert.ok(categoriesBody.categories.every((category) =>
    typeof category.description === 'string' && category.description.trim().length > 0
  ));
  assert.equal(articlesResponse.status, 200);
  assert.deepEqual(articlesBody.articles, []);
});

test('removed Playground page returns the not-found page without caching it', async () => {
  const response = await fetch(baseUrl + '/playground.html');
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type') || '', /text\/html/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(html, /404|not found/i);
});

test('retired Tools page and its old API metadata are no longer exposed', async () => {
  const response = await fetch(baseUrl + '/tools.html');
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('unknown API routes return a JSON 404 response', async () => {
  const response = await fetch(baseUrl + '/api/does-not-exist');
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, { error: 'Not found' });
});

test('robots and sitemap are publicly available', async () => {
  const robots = await fetch(baseUrl + '/robots.txt');
  const sitemap = await fetch(baseUrl + '/sitemap.xml');
  const sitemapXml = await sitemap.text();

  assert.equal(robots.status, 200);
  assert.ok((await robots.text()).includes('Sitemap: https://xychen-os.vercel.app/sitemap.xml'));
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get('content-type') || '', /xml/);
  assert.ok(sitemapXml.includes('<loc>https://xychen-os.vercel.app/</loc>'));
  assert.ok(sitemapXml.includes('<loc>https://xychen-os.vercel.app/explore.html</loc>'));
  assert.ok(!sitemapXml.includes('/tools.html'));
});

test('security headers are applied to API responses', async () => {
  const response = await fetch(baseUrl + '/api/health', {
    headers: { 'x-forwarded-proto': 'https' }
  });
  const policy = response.headers.get('content-security-policy') || '';

  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=()');
  assert.match(policy, /script-src 'self'/);
  assert.doesNotMatch(policy, /unsafe-inline/);
  assert.match(response.headers.get('strict-transport-security') || '', /max-age=31536000/);
});

test('HTML and static assets use deliberate cache policies', async () => {
  const page = await fetch(baseUrl + '/about.html');
  const stylesheet = await fetch(baseUrl + '/css/styles.css');

  assert.match(page.headers.get('cache-control') || '', /max-age=0/);
  assert.match(page.headers.get('cache-control') || '', /must-revalidate/);
  assert.match(stylesheet.headers.get('cache-control') || '', /max-age=3600/);
  assert.match(stylesheet.headers.get('cache-control') || '', /stale-while-revalidate=86400/);
});

test('all local links and asset references in public HTML resolve to files', () => {
  const publicDir = path.join(__dirname, '..', 'public');
  const htmlFiles = fs.readdirSync(publicDir).filter((file) => file.endsWith('.html'));
  const origin = 'https://xychen-os.vercel.app';

  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
    const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)];

    for (const [, reference] of references) {
      const url = new URL(reference, origin + '/' + file);
      if (url.origin !== origin) continue;

      const pathname = decodeURIComponent(url.pathname);
      const requestedPath = path.normalize(path.join(publicDir, pathname));
      assert.ok(
        requestedPath === publicDir || requestedPath.startsWith(publicDir + path.sep),
        'Reference escapes public directory: ' + reference + ' in ' + file
      );

      const candidates = pathname === '/'
        ? [path.join(publicDir, 'index.html')]
        : [
            requestedPath,
            requestedPath + '.html',
            path.join(requestedPath, 'index.html')
          ];

      assert.ok(
        candidates.some((candidate) => fs.existsSync(candidate)),
        'Broken local reference: ' + reference + ' in ' + file
      );
    }
  }
});

test('error handler returns safe JSON for API failures and HTML for page failures', () => {
  const createResponse = () => ({
    headersSent: false,
    statusCode: 200,
    body: null,
    contentType: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; this.contentType = 'json'; return this; },
    type(value) { this.contentType = value; return this; },
    send(body) { this.body = body; return this; }
  });

  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const apiResponse = createResponse();
    errorHandler(new Error('private internal detail'), { path: '/api/private' }, apiResponse, () => {});
    assert.equal(apiResponse.statusCode, 500);
    assert.deepEqual(apiResponse.body, { error: 'Internal server error' });

    const pageResponse = createResponse();
    errorHandler(new Error('private internal detail'), { path: '/about.html' }, pageResponse, () => {});
    assert.equal(pageResponse.statusCode, 500);
    assert.equal(pageResponse.contentType, 'html');
    assert.match(pageResponse.body, /Something went wrong/);
    assert.doesNotMatch(pageResponse.body, /private internal detail/);
  } finally {
    console.error = originalConsoleError;
  }
});

test('theme bootstrap is loaded from a same-origin script on every public page', () => {
  const publicDir = path.join(__dirname, '..', 'public');
  const htmlFiles = fs.readdirSync(publicDir).filter((file) => file.endsWith('.html'));

  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
    assert.match(html, /src="\/js\/theme-init\.js"/, file + ' should load the theme bootstrap');
    assert.doesNotMatch(html, /<script>\s*\(\(\) =>/, file + ' should not contain an inline script');
    assert.doesNotMatch(html, /\sstyle=["']/, file + ' should not contain inline style attributes');
  }
});
