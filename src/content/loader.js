'use strict';

const fs = require('node:fs');
const path = require('node:path');
const MarkdownIt = require('markdown-it');
const {
  ContentValidationError,
  validateCategories,
  validateArticleMetadata
} = require('./schema');

const DEFAULT_CONTENT_DIR = path.resolve(__dirname, '..', '..', 'content');

// Raw HTML is deliberately disabled. markdown-it also rejects unsafe URL
// protocols by default; do not enable HTML or custom link validation here.
const markdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
  breaks: false
});

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ContentValidationError('Invalid JSON in ' + path.basename(filePath) + '.');
    }
    throw error;
  }
}

function loadCategories(contentDir = DEFAULT_CONTENT_DIR) {
  const filePath = path.join(contentDir, 'categories.json');
  return validateCategories(readJson(filePath));
}

function getArticleDirectory(slug, contentDir) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new ContentValidationError('Article slug is invalid.');
  }

  const articlesDir = path.resolve(contentDir, 'articles');
  const articleDir = path.resolve(articlesDir, slug);
  if (!articleDir.startsWith(articlesDir + path.sep)) {
    throw new ContentValidationError('Article path is invalid.');
  }

  return articleDir;
}

function readArticleMetadata(slug, contentDir, categoryIds) {
  const articleDir = getArticleDirectory(slug, contentDir);
  const metadata = readJson(path.join(articleDir, 'metadata.json'));
  validateArticleMetadata(metadata, { categoryIds, expectedSlug: slug });

  if (!fs.existsSync(path.join(articleDir, 'content.md'))) {
    throw new ContentValidationError('Article is missing its required English content.md file.');
  }

  if (metadata.languages.includes('fil') &&
      !fs.existsSync(path.join(articleDir, 'content.fil.md'))) {
    throw new ContentValidationError('Article lists Filipino as available but content.fil.md is missing.');
  }

  return { articleDir, metadata };
}

function loadArticle(slug, contentDir = DEFAULT_CONTENT_DIR) {
  const categories = loadCategories(contentDir);
  const categoryIds = new Set(categories.map((category) => category.id));
  const { articleDir, metadata } = readArticleMetadata(slug, contentDir, categoryIds);
  const content = fs.readFileSync(path.join(articleDir, 'content.md'), 'utf8');
  const translations = {};

  if (metadata.languages.includes('fil')) {
    translations.fil = fs.readFileSync(path.join(articleDir, 'content.fil.md'), 'utf8');
  }

  return {
    metadata,
    content,
    html: markdown.render(content),
    translations
  };
}

function listArticles(contentDir = DEFAULT_CONTENT_DIR, options = {}) {
  const articlesDir = path.join(contentDir, 'articles');
  if (!fs.existsSync(articlesDir)) return [];

  const categories = loadCategories(contentDir);
  const categoryIds = new Set(categories.map((category) => category.id));
  const includeUnpublished = options.includeUnpublished === true;
  const seenIds = new Set();

  return fs.readdirSync(articlesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const { metadata } = readArticleMetadata(entry.name, contentDir, categoryIds);
      if (seenIds.has(metadata.id)) {
        throw new ContentValidationError('Article IDs must be unique across the content library.');
      }
      seenIds.add(metadata.id);
      return metadata;
    })
    .filter((metadata) => includeUnpublished || metadata.status === 'published')
    .sort((a, b) => {
      const dateOrder = (b.publishedAt || '').localeCompare(a.publishedAt || '');
      return dateOrder || a.title.localeCompare(b.title);
    });
}

function renderMarkdown(source) {
  if (typeof source !== 'string') {
    throw new TypeError('Markdown source must be a string.');
  }
  return markdown.render(source);
}

module.exports = {
  loadCategories,
  loadArticle,
  listArticles,
  renderMarkdown
};
