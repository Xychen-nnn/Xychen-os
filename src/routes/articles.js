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
  const headers = req.headers || {};
  const cookie = String(headers.cookie || '');
  const cookieMatch = cookie.match(/(?:^|;\\s*)xychen-os-language=(en|fil)(?:;|$)/);
  if (cookieMatch) return cookieMatch[1];

  const preferences = String(headers['accept-language'] || '')
    .split(',')
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().split(';');
      const qualityParameter = parameters.find((parameter) => /^\\s*q=/i.test(parameter));
      const quality = qualityParameter ? Number(qualityParameter.split('=')[1]) : 1;

      return {
        language: tag.trim().toLowerCase().split('-')[0],
        quality: Number.isFinite(quality) && quality >= 0 && quality <= 1 ? quality : 0,
        index
      };
    })
    .filter((preference) => preference.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const preference of preferences) {
    if (preference.language === 'fil' || preference.language === 'tl') return 'fil';
    if (preference.language === 'en') return 'en';
  }

  return 'en';
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
    res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
    res.setHeader('Vary', 'Cookie, Accept-Language');
    res.type('html').send(renderArticlePage(article, category, language));
  } catch (error) {
    if (error.name === 'ContentValidationError' || error.code === 'ENOENT') {
      return sendNotFound(res);
    }
    next(error);
  }
});

router.requestedLanguage = requestedLanguage;
module.exports = router;
