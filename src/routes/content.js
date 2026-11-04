'use strict';

const router = require('express').Router();
const { loadCategories, listArticles, loadArticle } = require('../content/loader');

router.get('/categories', (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json({ categories: loadCategories() });
  } catch (error) {
    next(error);
  }
});

router.get('/articles', (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : null;
    const articles = listArticles().filter((article) => !category || article.category === category);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ articles });
  } catch (error) {
    next(error);
  }
});

router.get('/articles/:slug', (req, res, next) => {
  try {
    const article = loadArticle(req.params.slug);
    if (article.metadata.status !== 'published') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ article: { metadata: article.metadata, html: article.html } });
  } catch (error) {
    if (error.name === 'ContentValidationError' || error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Article not found' });
    }
    next(error);
  }
});

module.exports = router;
