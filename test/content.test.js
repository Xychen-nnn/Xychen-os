'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const {
  ContentValidationError,
  validateCategories,
  validateArticleMetadata
} = require('../src/content/schema');
const {
  loadCategories,
  loadArticle,
  listArticles,
  renderMarkdown
} = require('../src/content/loader');

const contentDir = path.join(__dirname, '..', 'content');
const { renderArticlePage } = require('../src/views/article');

test('category registry is valid, described, and sorted by configured order', () => {
  const categories = loadCategories(contentDir);
  assert.deepEqual(categories.map((category) => category.id), [
    'technology',
    'science',
    'astronomy',
    'nature',
    'gaming',
    'guides',
    'general-knowledge'
  ]);
  for (const category of categories) {
    assert.ok(category.nameFil.trim().length > 0);
    assert.ok(category.description.trim().length > 0);
    assert.ok(category.descriptionFil.trim().length > 0);
    assert.ok(category.description.length <= 180);
    assert.ok(category.descriptionFil.length <= 180);
  }
});

test('category validation rejects duplicate IDs, duplicate ordering, and missing descriptions', () => {
  assert.throws(
    () => validateCategories({
      categories: [
        { id: 'technology', name: 'Technology', description: 'A valid description.', order: 1 },
        { id: 'technology', name: 'Duplicate', order: 1 }
      ]
    }),
    ContentValidationError
  );
});

test('article metadata validation accepts a valid record and rejects unknown categories', () => {
  const validMetadata = {
    id: 'sample-guide',
    title: 'Sample guide',
    slug: 'sample-guide',
    category: 'technology',
    tags: ['web-development'],
    type: 'guide',
    languages: ['en'],
    verificationStatus: 'verified',
    status: 'published',
    publishedAt: '2026-11-04',
    updatedAt: '2026-11-04',
    sources: [{ title: 'Example source', url: 'https://example.com/reference' }]
  };

  assert.equal(validateArticleMetadata(validMetadata, {
    categoryIds: new Set(['technology']),
    expectedSlug: 'sample-guide'
  }), validMetadata);

  assert.throws(
    () => validateArticleMetadata({ ...validMetadata, category: 'unknown' }, {
      categoryIds: new Set(['technology']),
      expectedSlug: 'sample-guide'
    }),
    ContentValidationError
  );
});

test('article metadata rejects unsafe source protocols and invalid calendar dates', () => {
  const metadata = {
    id: 'sample-guide',
    title: 'Sample guide',
    slug: 'sample-guide',
    category: 'technology',
    tags: [],
    type: 'guide',
    languages: ['en'],
    verificationStatus: 'verified',
    status: 'published',
    publishedAt: '2026-02-30',
    updatedAt: '2026-11-04',
    sources: [{ title: 'Unsafe source', url: 'javascript:alert(1)' }]
  };

  assert.throws(
    () => validateArticleMetadata(metadata, {
      categoryIds: new Set(['technology']),
      expectedSlug: 'sample-guide'
    }),
    ContentValidationError
  );
});

test('article loader rejects traversal-like slugs', () => {
  assert.throws(() => loadArticle('../package', contentDir), ContentValidationError);
});

test('server-rendered article pages escape metadata and expose canonical URLs', () => {
  const page = renderArticlePage({
    metadata: {
      slug: 'safe-article',
      title: '<script>alert(1)</script>',
      summary: 'A reviewed summary.',
      category: 'technology',
      tags: ['web-security'],
      publishedAt: '2026-11-05',
      updatedAt: '2026-11-05',
      sources: [{ title: 'Reference source', url: 'https://example.com/reference?a=1&b=2' }]
    },
    html: '<p>Safe rendered content.</p>'
  }, { id: 'technology', name: 'Technology' });

  assert.match(page, /<title>&lt;script&gt;alert\(1\)&lt;\/script&gt; — Xychen OS<\/title>/);
  assert.match(page, /rel="canonical" href="https:\/\/xychen-os\.vercel\.app\/articles\/safe-article"/);
  assert.match(page, /Safe rendered content/);
  assert.match(page, /Reference source/);
  assert.doesNotMatch(page, /<script>alert\(1\)<\/script>/);

  const filipinoPage = renderArticlePage({
    metadata: {
      slug: 'safe-article',
      title: 'Sample title',
      titleFil: 'Pamagat sa Filipino',
      summary: 'English summary.',
      summaryFil: 'Buod sa Filipino.',
      category: 'technology',
      tags: [],
      publishedAt: '2026-11-05',
      updatedAt: '2026-11-05'
    },
    html: '<p>Nilalaman sa Filipino.</p>'
  }, { id: 'technology', name: 'Technology', nameFil: 'Teknolohiya' }, 'fil');

  assert.match(filipinoPage, /<html lang="fil"/);
  assert.match(filipinoPage, /<title>Pamagat sa Filipino — Xychen OS<\/title>/);
  assert.match(filipinoPage, /<p class="eyebrow">Teknolohiya<\/p>/);
  assert.match(filipinoPage, /Nilalaman sa Filipino/);
});

test('article listing does not invent or publish placeholder content', () => {
  assert.deepEqual(listArticles(contentDir), []);
});

test('Markdown rendering escapes raw HTML and blocks javascript links', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))');
  assert.doesNotMatch(html, /<script>/i);
  assert.match(html, /&lt;script&gt;/i);
  assert.doesNotMatch(html, /href="javascript:/i);
});
