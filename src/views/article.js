'use strict';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function renderArticlePage(article, category, language = 'en') {
  const metadata = article.metadata;
  const isFilipino = language === 'fil';
  const titleValue = isFilipino ? metadata.titleFil || metadata.title : metadata.title;
  const summaryValue = isFilipino
    ? metadata.summaryFil || metadata.summary || 'Basahin ang artikulong ito mula sa Xychen OS Explore library.'
    : metadata.summary || 'Read this article from the Xychen OS Explore library.';
  const title = escapeHtml(titleValue);
  const description = escapeHtml(summaryValue);
  const canonical = 'https://xychen-os.vercel.app/articles/' + encodeURIComponent(metadata.slug);
  const categoryValue = category
    ? (isFilipino ? category.nameFil || category.name : category.name)
    : metadata.category.replace(/-/g, ' ');
  const categoryName = escapeHtml(categoryValue);
  const tags = Array.isArray(metadata.tags) && metadata.tags.length
    ? '<div class="tag-row">' + metadata.tags.map((tag) =>
        '<span class="tag">' + escapeHtml(tag.replace(/-/g, ' ')) + '</span>'
      ).join('') + '</div>'
    : '';
  const sources = Array.isArray(metadata.sources) && metadata.sources.length
    ? '<section class="article-sources section"><h2>' + (isFilipino ? 'Mga Sanggunian' : 'Sources') + '</h2><ul>' +
      metadata.sources.map((source) =>
        '<li><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(source.title) + '</a></li>'
      ).join('') + '</ul></section>'
    : '';
  const published = metadata.publishedAt
    ? (isFilipino ? 'Inilathala ' : 'Published ') + escapeHtml(metadata.publishedAt)
    : '';
  const updated = (isFilipino ? 'Na-update ' : 'Updated ') + escapeHtml(metadata.updatedAt);
  const dateLine = [published, updated].filter(Boolean).join(' · ');

  return `<!doctype html>
<html lang="${isFilipino ? 'fil' : 'en'}" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Xychen OS">
  <meta property="og:title" content="${title} — Xychen OS">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title} — Xychen OS">
  <meta name="twitter:description" content="${description}">
  <title>${title} — Xychen OS</title>
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/theme-init.js"></script>
  <script src="/js/theme.js" defer></script>
  <script src="/js/components.js" defer></script>
  <script src="/js/i18n.js" defer></script>
</head>
<body data-page="explore">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div data-site-header><noscript><nav aria-label="Main navigation"><a href="/">Home</a><a href="/about.html">About</a><a href="/projects.html">Projects</a><a href="/explore.html">Explore</a><a href="/links.html">Links</a></nav></noscript></div>
  <main id="main-content">
    <p><a class="button-secondary" href="/explore.html">${isFilipino ? '← Bumalik sa Explore' : '← Back to Explore'}</a></p>
    <article class="section" id="article-content">
      <header class="page-heading">
        <p class="eyebrow">${categoryName}</p>
        <h1>${title}</h1>
        ${(isFilipino ? (metadata.summaryFil || metadata.summary) : metadata.summary) ? '<p class="page-intro">' + description + '</p>' : ''}
        <p class="muted">${dateLine}</p>
        ${tags}
      </header>
      <div class="article-body" lang="${isFilipino ? 'fil' : 'en'}">${article.html}</div>
      ${sources}
    </article>
  </main>
  <div data-site-footer></div>
</body>
</html>`;
}

module.exports = { renderArticlePage };
