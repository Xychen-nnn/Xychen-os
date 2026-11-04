(() => {
  const root = document.getElementById('article-content');
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    root.textContent = 'Article not found.';
    return;
  }

  fetch('/api/content/articles/' + encodeURIComponent(slug), { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    })
    .then(({ article }) => {
      const { metadata } = article;
      document.title = metadata.title + ' — Xychen OS';
      const heading = document.createElement('header');
      heading.className = 'page-heading';
      const category = document.createElement('p');
      category.className = 'eyebrow';
      category.textContent = metadata.category.replace(/-/g, ' ');
      const title = document.createElement('h1');
      title.textContent = metadata.title;
      const summary = document.createElement('p');
      summary.className = 'page-intro';
      summary.textContent = metadata.summary || '';
      const updated = document.createElement('p');
      updated.className = 'muted';
      updated.textContent = 'Updated ' + metadata.updatedAt;
      heading.append(category, title);
      if (metadata.summary) heading.append(summary);
      heading.append(updated);
      const body = document.createElement('div');
      body.className = 'article-body';
      body.innerHTML = article.html;
      root.replaceChildren(heading, body);
    })
    .catch(() => {
      root.textContent = 'This article is unavailable or has not been published.';
    });
})();