'use strict';

const path = require('node:path');
const router = require('express').Router();
const { loadArticle, loadCategories, renderMarkdown } = require('../content/loader');
const { renderArticlePage } = require('../views/article');

const notFoundPage = path.resolve(__dirname, '..', '..', 'public', '404.html');

function sendNotFound(res) {
  res.status(404);
  res.setHeader('Cache-Control', 'no-store');
  return res.sendFile(notFoundPage);
}

function requestedLanguage(req) {
  const cookie = String(req.headers.cookie || '');
  const match = cookie.match(/(?:^|;\s*)xychen-os-language=(en|fil)(?:;|$)/);
  return match ? match[1] : 'en';
}

router.get('/:slug', (req, res, next) => {
  try {
    const article = loadArticle(req.params.slug);
    if (article.metadata.status !== 'published') {
      return sendNotFound(res);
    }

    const preferredLanguage = requestedLanguage(req);
    const language = preferredLanguage === 'fil' && article.translations.fil ? 'fil' : 'en';
    if (language === 'fil') {
      article.html = renderMarkdown(article.translations.fil);
    }

    const category = loadCategories().find((item) => item.id === article.metadata.category);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.type('html').send(renderArticlePage(article, category, language));
  } catch (error) {
    if (error.name === 'ContentValidationError' || error.code === 'ENOENT') {
      return sendNotFound(res);
    }
    next(error);
  }
});

module.exports = router;
