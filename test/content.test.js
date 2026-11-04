'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
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

test('category registry is valid and sorted by configured order', () => {
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
});

test('category validation rejects duplicate IDs and invalid ordering', () => {
  assert.throws(
    () => validateCategories({
      categories: [
        { id: 'technology', name: 'Technology', order: 1 },
        { id: 'technology', name: 'Duplicate', order: 0 }
      ]
    }),
    ContentValidationError
  );
});

test('article metadata validation enforces required fields and known categories', () => {
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

test('article listing does not invent or publish placeholder content', () => {
  assert.deepEqual(listArticles(contentDir), []);
});

test('Markdown rendering escapes raw HTML and blocks javascript links', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))');
  assert.doesNotMatch(html, /<script>/i);
  assert.match(html, /&lt;script&gt;/i);
  assert.doesNotMatch(html, /href="javascript:/i);
});
