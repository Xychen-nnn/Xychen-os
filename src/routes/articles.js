'use strict';

const path = require('node:path');
const router = require('express').Router();
const { loadArticle, loadCategories } = require('../content/loader');
const { renderArticlePage } = require('../views/article');

const notFoundPage = path.resolve(__dirname, '..', '..', 'public', '404.html');

function sendNotFound(res) {
  res.status(404);
  res.setHeader('Cache-Control', 'no-store');
  return res.sendFile(notFoundPage);
}

router.get('/:slug', (req, res, next) => {
  try {
    const article = loadArticle(req.params.slug);
    if (article.metadata.status !== 'published') {
      return sendNotFound(res);
    }

    const category = loadCategories().find((item) => item.id === article.metadata.category);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.type('html').send(renderArticlePage(article, category));
  } catch (error) {
    if (error.name === 'ContentValidationError' || error.code === 'ENOENT') {
      return sendNotFound(res);
    }
    next(error);
  }
});

module.exports = router;
