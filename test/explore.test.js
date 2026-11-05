'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'js', 'pages', 'explore.js'),
  'utf8'
);

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.listeners = new Map();
    this.attributes = {};
    this.classNames = new Set();
    this.classList = {
      add: (...names) => names.forEach((name) => this.classNames.add(name))
    };
    this.className = '';
    this.href = '';
    this.value = '';
    this.type = '';
    this.placeholder = '';
    this._textContent = '';
  }

  get lastElementChild() {
    return this.children[this.children.length - 1] || null;
  }

  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent).join('');
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  append(...nodes) {
    for (const node of nodes) {
      node.parentNode = this;
      this.children.push(node);
    }
  }

  replaceChildren(...nodes) {
    this._textContent = '';
    this.children = [];
    this.append(...nodes);
  }

  insertBefore(node, referenceNode) {
    const index = this.children.indexOf(referenceNode);
    node.parentNode = this;
    if (index < 0) this.children.push(node);
    else this.children.splice(index, 0, node);
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  addEventListener(type, callback) {
    const handlers = this.listeners.get(type) || [];
    handlers.push(callback);
    this.listeners.set(type, handlers);
  }

  dispatch(type, overrides = {}) {
    const event = {
      target: this,
      button: 0,
      defaultPrevented: false,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...overrides
    };
    let current = this;
    while (current) {
      for (const callback of current.listeners.get(type) || []) callback(event);
      current = current.parentNode || null;
    }
    return event;
  }

  closest(selector) {
    if (selector === 'a[href]' && this.tagName === 'A') return this;
    if (selector === 'a[href="/explore.html"]' &&
        this.tagName === 'A' && this.href === '/explore.html') return this;
    return null;
  }

  click() {
    return this.dispatch('click');
  }
}

function findByTag(root, tagName) {
  if (root.tagName === tagName.toUpperCase()) return root;
  for (const child of root.children) {
    const match = findByTag(child, tagName);
    if (match) return match;
  }
  return null;
}

function createFixture() {
  const elements = new Map();
  for (const id of [
    'category-list',
    'article-list',
    'category-count',
    'article-count',
    'articles-heading',
    'explore-search',
    'explore-search-form',
    'clear-search',
    'explore-filter-status'
  ]) {
    elements.set(id, new FakeElement('div'));
  }

  const document = {
    getElementById(id) {
      const element = elements.get(id);
      if (!element) throw new Error('Unexpected element ID: ' + id);
      return element;
    },
    createElement(tagName) {
      return new FakeElement(tagName);
    },
    addEventListener() {}
  };

  const location = {
    pathname: '/explore.html',
    search: '',
    hash: '',
    origin: 'https://xychen-os.vercel.app',
    href: 'https://xychen-os.vercel.app/explore.html'
  };

  function updateLocation(nextPath) {
    const parsed = new URL(nextPath, location.href);
    location.pathname = parsed.pathname;
    location.search = parsed.search;
    location.hash = parsed.hash;
    location.origin = parsed.origin;
    location.href = parsed.href;
  }

  const window = {
    location,
    history: {
      pushState(_state, _title, nextPath) {
        updateLocation(nextPath);
      },
      replaceState(_state, _title, nextPath) {
        updateLocation(nextPath);
      }
    },
    listeners: new Map(),
    addEventListener(type, callback) {
      this.listeners.set(type, callback);
    }
  };

  return { document, window, elements };
}

async function startExplore(fetchHandler, initialSearch = '') {
  const fixture = createFixture();
  if (initialSearch) {
    fixture.window.location.search = initialSearch;
    fixture.window.location.href += initialSearch;
  }

  const context = {
    document: fixture.document,
    window: fixture.window,
    fetch: fetchHandler,
    URL,
    URLSearchParams
  };

  vm.runInNewContext(source, context, { filename: 'explore.js' });
  await new Promise((resolve) => setImmediate(resolve));
  return fixture;
}

function okJson(body) {
  return { ok: true, json: async () => body };
}

const categories = [
  {
    id: 'technology',
    name: 'Technology',
    nameFil: 'Teknolohiya',
    description: 'Software and the web.',
    descriptionFil: 'Software at web.'
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    nameFil: 'Astronomiya',
    description: 'Space and planets.',
    descriptionFil: 'Kalawakan at mga planeta.'
  }
];

const articles = [
  {
    slug: 'browser-page',
    title: 'How a Browser Loads a Page',
    category: 'technology',
    summary: 'A look at requests and responses.',
    tags: ['dns', 'http']
  },
  {
    slug: 'distant-worlds',
    title: 'Astronomers Observe Distant Worlds',
    category: 'astronomy',
    summary: 'An introduction to exoplanets.',
    tags: ['exoplanets']
  },
  {
    slug: 'debugging-layout',
    title: 'Debugging Browser Layout',
    category: 'technology',
    summary: 'Find layout errors with developer tools.',
    tags: ['css']
  }
];

test('search filters published articles by title, summary, and tags and updates the URL', async () => {
  const fixture = await startExplore(async (url) => {
    if (url.endsWith('/categories')) return okJson({ categories });
    return okJson({ articles });
  });

  const { elements, window } = fixture;
  const search = elements.get('explore-search');
  const articleList = elements.get('article-list');

  assert.equal(elements.get('category-list').children.length, 2);
  assert.equal(articleList.children.length, 3);

  search.value = 'dns';
  search.dispatch('input');

  assert.equal(window.location.search, '?q=dns');
  assert.equal(articleList.children.length, 1);
  assert.match(articleList.textContent, /How a Browser Loads a Page/);

  search.value = 'browser';
  search.dispatch('input');

  assert.equal(window.location.search, '?q=browser');
  assert.equal(articleList.children.length, 2);
});

test('category selection toggles without navigation and preserves the active search', async () => {
  const fixture = await startExplore(async (url) => {
    if (url.endsWith('/categories')) return okJson({ categories });
    return okJson({ articles });
  });

  const { elements, window } = fixture;
  const search = elements.get('explore-search');
  search.value = 'browser';
  search.dispatch('input');

  const categoryList = elements.get('category-list');
  const technologyCard = categoryList.children[0];
  const clickEvent = technologyCard.click();

  assert.equal(clickEvent.defaultPrevented, true);
  assert.equal(window.location.pathname, '/explore.html');
  assert.equal(window.location.search, '?category=technology&q=browser');
  assert.equal(elements.get('article-list').children.length, 2);
  assert.equal(technologyCard.attributes['aria-current'], 'true');

  const selectedTechnologyCard = categoryList.children[0];
  selectedTechnologyCard.click();

  assert.equal(window.location.search, '?q=browser');
  assert.equal(search.value, 'browser');
  assert.equal(elements.get('article-list').children.length, 2);
});

test('category retry reloads only the failed category endpoint while articles remain available', async () => {
  let categoryCalls = 0;
  let articleCalls = 0;

  const fixture = await startExplore(async (url) => {
    if (url.endsWith('/categories')) {
      categoryCalls += 1;
      return categoryCalls === 1
        ? { ok: false, json: async () => ({}) }
        : okJson({ categories });
    }

    articleCalls += 1;
    return okJson({ articles });
  });

  const { elements } = fixture;
  const categoryList = elements.get('category-list');
  const articleList = elements.get('article-list');

  assert.equal(categoryCalls, 1);
  assert.equal(articleCalls, 1);
  assert.ok(findByTag(categoryList, 'button'), 'category error should expose a retry button');
  assert.equal(articleList.children.length, 3, 'articles should render even when categories fail');

  findByTag(categoryList, 'button').click();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(categoryCalls, 2);
  assert.equal(articleCalls, 1, 'retrying categories must not reload the article endpoint');
  assert.equal(categoryList.children.length, 2);
});

test('article retry reloads only the failed article endpoint while categories remain available', async () => {
  let categoryCalls = 0;
  let articleCalls = 0;

  const fixture = await startExplore(async (url) => {
    if (url.endsWith('/categories')) {
      categoryCalls += 1;
      return okJson({ categories });
    }

    articleCalls += 1;
    return articleCalls === 1
      ? { ok: false, json: async () => ({}) }
      : okJson({ articles });
  });

  const { elements } = fixture;
  const categoryList = elements.get('category-list');
  const articleList = elements.get('article-list');

  assert.equal(categoryCalls, 1);
  assert.equal(articleCalls, 1);
  assert.equal(categoryList.children.length, 2, 'categories should render even when articles fail');
  assert.ok(findByTag(articleList, 'button'), 'article error should expose a retry button');

  findByTag(articleList, 'button').click();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(categoryCalls, 1, 'retrying articles must not reload the category endpoint');
  assert.equal(articleCalls, 2);
  assert.equal(articleList.children.length, 3);
});
