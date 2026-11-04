(() => {
  const categoryList = document.getElementById('category-list');
  const articleList = document.getElementById('article-list');
  const categoryCount = document.getElementById('category-count');
  const articleCount = document.getElementById('article-count');

  const categoryIcons = {
    technology: '⌘',
    science: '✳',
    astronomy: '☼',
    nature: '❋',
    gaming: '◇',
    guides: '↗',
    'general-knowledge': '◎'
  };

  function showMessage(container, message, actionHref, actionLabel) {
    const panel = document.createElement('div');
    panel.className = 'empty-state card-full';
    const title = document.createElement('h3');
    title.textContent = 'Nothing published here yet';
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    panel.append(title, paragraph);

    if (actionHref && actionLabel) {
      const action = document.createElement('a');
      action.className = 'button-secondary';
      action.href = actionHref;
      action.textContent = actionLabel;
      panel.append(action);
    }

    container.replaceChildren(panel);
  }

  function createCard(title, description, href, label, icon) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = href;

    if (icon) {
      const iconElement = document.createElement('span');
      iconElement.className = 'card-icon';
      iconElement.setAttribute('aria-hidden', 'true');
      iconElement.textContent = icon;
      card.append(iconElement);
    }

    const heading = document.createElement('h3');
    heading.textContent = title;
    const summary = document.createElement('p');
    summary.textContent = description;
    const action = document.createElement('span');
    action.className = 'muted';
    action.textContent = label;
    card.append(heading, summary, action);
    return card;
  }

  async function loadExplore() {
    try {
      const [categoriesResponse, articlesResponse] = await Promise.all([
        fetch('/api/content/categories', { headers: { Accept: 'application/json' } }),
        fetch('/api/content/articles', { headers: { Accept: 'application/json' } })
      ]);

      if (!categoriesResponse.ok || !articlesResponse.ok) {
        throw new Error('The content service returned an unavailable response.');
      }

      const [{ categories }, { articles }] = await Promise.all([
        categoriesResponse.json(),
        articlesResponse.json()
      ]);

      categoryCount.textContent = categories.length + (categories.length === 1 ? ' category' : ' categories');
      categoryList.replaceChildren(...categories.map((category) =>
        createCard(
          category.name,
          category.description,
          '/explore.html?category=' + encodeURIComponent(category.id),
          'Browse category ↗',
          categoryIcons[category.id] || '•'
        )
      ));

      const selectedCategoryId = new URLSearchParams(window.location.search).get('category');
      const selected = selectedCategoryId
        ? categories.find((category) => category.id === selectedCategoryId)
        : null;
      const visibleArticles = selected
        ? articles.filter((article) => article.category === selected.id)
        : articles;

      document.getElementById('articles-heading').textContent = selected
        ? selected.name + ' articles'
        : selectedCategoryId
          ? 'Category not found'
          : 'Published articles';

      articleCount.textContent = visibleArticles.length + (visibleArticles.length === 1 ? ' article' : ' articles');

      if (!visibleArticles.length) {
        const message = selected
          ? 'There are no reviewed articles in this category yet. The category is ready, and articles will appear here once they are researched and published.'
          : selectedCategoryId
            ? 'That category does not exist. Return to the full category list to choose another topic.'
            : 'The article library is being prepared. Published articles will appear here with summaries, dates, and source information.';
        showMessage(articleList, message, selectedCategoryId ? '/explore.html' : '/about.html',
          selectedCategoryId ? 'View all categories' : 'About this platform');
        return;
      }

      articleList.replaceChildren(...visibleArticles.map((article) =>
        createCard(
          article.title,
          article.summary || 'Open this article to read the full explanation and its sources.',
          '/articles/' + encodeURIComponent(article.slug),
          'Read article ↗'
        )
      ));
    } catch {
      showMessage(categoryList, 'The category list could not be loaded. Please try again later.');
      showMessage(articleList, 'The article library could not be loaded. Please try again later.');
      categoryCount.textContent = 'Unavailable';
      articleCount.textContent = '';
    }
  }

  loadExplore();
})();
