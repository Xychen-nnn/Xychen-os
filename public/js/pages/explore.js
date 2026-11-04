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

  const translate = (key, fallback) =>
    window.XychenI18n ? window.XychenI18n.t(key) : fallback;
  const language = () =>
    window.XychenI18n ? window.XychenI18n.getLanguage() : 'en';

  function showMessage(container, message, actionHref, actionLabel) {
    const panel = document.createElement('div');
    panel.className = 'empty-state card-full';
    const title = document.createElement('h3');
    title.textContent = translate('explore.emptyTitle', 'Nothing published here yet');
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

      const lang = language();
      const categoryName = (category) =>
        lang === 'fil' ? category.nameFil || category.name : category.name;
      const categoryDescription = (category) =>
        lang === 'fil' ? category.descriptionFil || category.description : category.description;

      categoryCount.textContent = categories.length + (lang === 'fil' ? ' kategorya' : (categories.length === 1 ? ' category' : ' categories'));
      categoryList.replaceChildren(...categories.map((category) =>
        createCard(
          categoryName(category),
          categoryDescription(category),
          '/explore.html?category=' + encodeURIComponent(category.id),
          translate('explore.browseCategory', 'Browse category ↗'),
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
        ? categoryName(selected) + (lang === 'fil' ? ' — Mga Artikulo' : ' articles')
        : selectedCategoryId
          ? translate('explore.invalidCategory', 'Category not found')
          : translate('explore.articlesTitle', 'Published articles');

      articleCount.textContent = visibleArticles.length + (lang === 'fil' ? ' artikulo' : (visibleArticles.length === 1 ? ' article' : ' articles'));

      if (!visibleArticles.length) {
        const message = selected
          ? translate('explore.categoryEmpty', 'There are no reviewed articles in this category yet.')
          : selectedCategoryId
            ? translate('explore.invalidCategory', 'That category does not exist.')
            : translate('explore.libraryEmpty', 'The article library is being prepared.');
        const actionHref = selectedCategoryId ? '/explore.html' : '/about.html';
        const actionLabel = selectedCategoryId
          ? translate('explore.viewAll', 'View all categories')
          : translate('explore.aboutPlatform', 'About this platform');
        showMessage(articleList, message, actionHref, actionLabel);
        return;
      }

      articleList.replaceChildren(...visibleArticles.map((article) =>
        createCard(
          lang === 'fil' ? article.titleFil || article.title : article.title,
          lang === 'fil'
            ? article.summaryFil || article.summary || translate('explore.articleFallback', 'Open this article to read the full explanation and its sources.')
            : article.summary || translate('explore.articleFallback', 'Open this article to read the full explanation and its sources.'),
          '/articles/' + encodeURIComponent(article.slug),
          translate('explore.readArticle', 'Read article ↗')
        )
      ));
    } catch {
      showMessage(categoryList, translate('explore.loadCategoriesError', 'The category list could not be loaded.'), '/explore.html', translate('explore.retry', 'Retry'));
      showMessage(articleList, translate('explore.loadArticlesError', 'The article library could not be loaded.'), '/explore.html', translate('explore.retry', 'Retry'));
      categoryCount.textContent = 'Unavailable';
      articleCount.textContent = '';
    }
  }

  loadExplore();
})();
