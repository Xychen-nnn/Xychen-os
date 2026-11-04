(() => {
  const root = document.getElementById('article-content');
  const slug = new URLSearchParams(window.location.search).get('slug');

  function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.setAttribute('content', value);
  }

  function showUnavailable(message) {
    const panel = document.createElement('div');
    panel.className = 'empty-state';
    const heading = document.createElement('h2');
    heading.textContent = 'Article unavailable';
    const description = document.createElement('p');
    description.textContent = message;
    const link = document.createElement('a');
    link.className = 'button-secondary';
    link.href = '/explore.html';
    link.textContent = 'Return to Explore';
    panel.append(heading, description, link);
    root.replaceChildren(panel);
  }

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    showUnavailable('The requested article could not be found. Check the link or browse the article categories.');
    return;
  }

  fetch('/api/content/articles/' + encodeURIComponent(slug), {
    headers: { Accept: 'application/json' }
  })
    .then(async (response) => {
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    })
    .then(({ article }) => {
      if (!article || !article.metadata || typeof article.html !== 'string') {
        throw new Error('Invalid article response');
      }

      const { metadata } = article;
      const description = metadata.summary || 'Read this article from the Xychen OS Explore library.';
      const canonicalUrl = window.location.origin + '/article.html?slug=' + encodeURIComponent(metadata.slug);

      document.title = metadata.title + ' — Xychen OS';
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:title"]', document.title);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[property="og:url"]', canonicalUrl);
      setMeta('meta[name="twitter:title"]', document.title);
      setMeta('meta[name="twitter:description"]', description);

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = canonicalUrl;

      const heading = document.createElement('header');
      heading.className = 'page-heading';
      const category = document.createElement('p');
      category.className = 'eyebrow';
      category.textContent = metadata.category.replace(/-/g, ' ');
      const title = document.createElement('h1');
      title.textContent = metadata.title;
      heading.append(category, title);

      if (metadata.summary) {
        const summary = document.createElement('p');
        summary.className = 'page-intro';
        summary.textContent = metadata.summary;
        heading.append(summary);
      }

      const details = document.createElement('p');
      details.className = 'muted';
      details.textContent = (metadata.publishedAt ? 'Published ' + metadata.publishedAt : 'Unpublished') +
        ' · Updated ' + metadata.updatedAt;
      heading.append(details);

      if (Array.isArray(metadata.tags) && metadata.tags.length) {
        const tags = document.createElement('div');
        tags.className = 'tag-row';
        metadata.tags.forEach((tag) => {
          const item = document.createElement('span');
          item.className = 'tag';
          item.textContent = tag.replace(/-/g, ' ');
          tags.append(item);
        });
        heading.append(tags);
      }

      const body = document.createElement('div');
      body.className = 'article-body';
      // Article HTML is rendered by the server-side Markdown renderer with raw HTML disabled.
      body.innerHTML = article.html;
      root.replaceChildren(heading, body);

      if (Array.isArray(metadata.sources) && metadata.sources.length) {
        const sourceSection = document.createElement('section');
        sourceSection.className = 'article-sources section';
        const sourceHeading = document.createElement('h2');
        sourceHeading.textContent = 'Sources';
        const sourceList = document.createElement('ul');

        metadata.sources.forEach((source) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = source.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = source.title;
          item.append(link);
          sourceList.append(item);
        });

        sourceSection.append(sourceHeading, sourceList);
        root.append(sourceSection);
      }
    })
    .catch(() => {
      showUnavailable('This article may have been moved, or it has not been published yet.');
    });
})();
