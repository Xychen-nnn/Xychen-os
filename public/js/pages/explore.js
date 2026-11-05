(() => {
  const categoryList = document.getElementById('category-list');
  const articleList = document.getElementById('article-list');
  const categoryCount = document.getElementById('category-count');
  const articleCount = document.getElementById('article-count');
  const articlesHeading = document.getElementById('articles-heading');

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

  let loadedCategories = null;
  let loadedArticles = null;
  let loadFailed = false;

  function showMessage(container, message, actionHref, actionLabel, titleText) {
    const panel = document.createElement('div');
    panel.className = 'empty-state card-full';
    const title = document.createElement('h3');
    title.textContent = titleText || translate('explore.emptyTitle', 'Nothing published here yet');
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

  function renderExplore() {
    if (!loadedCategories || !loadedArticles || loadFailed) return;

    const lang = language();
    const categoryName = (category) =>
      lang === 'fil' ? category.nameFil || category.name : category.name;
    const categoryDescription = (category) =>
      lang === 'fil' ? category.descriptionFil || category.description : category.description;

    categoryCount.textContent = loadedCategories.length +
      (lang === 'fil' ? ' kategorya' : (loadedCategories.length === 1 ? ' category' : ' categories'));

    categoryList.replaceChildren(...loadedCategories.map((category) =>
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
      ? loadedCategories.find((category) => category.id === selectedCategoryId)
      : null;
    const visibleArticles = selected
      ? loadedArticles.filter((article) => article.category === selected.id)
      : loadedArticles;

    articlesHeading.textContent = selected
      ? categoryName(selected) + (lang === 'fil' ? ' — Mga Artikulo' : ' articles')
      : selectedCategoryId
        ? translate('explore.invalidCategoryTitle', 'Category not found')
        : translate('explore.articlesTitle', 'Published articles');

    articleCount.textContent = visibleArticles.length +
      (lang === 'fil' ? ' artikulo' : (visibleArticles.length === 1 ? ' article' : ' articles'));

    if (!visibleArticles.length) {
      const isInvalidCategory = Boolean(selectedCategoryId && !selected);
      const message = selected
        ? translate('explore.categoryEmpty', 'There are no reviewed articles in this category yet.')
        : isInvalidCategory
          ? translate('explore.invalidCategory', 'That category does not exist.')
          : translate('explore.libraryEmpty', 'The article library is being prepared.');

      const actionHref = selectedCategoryId ? '/explore.html' : '/about.html';
      const actionLabel = selectedCategoryId
        ? translate('explore.viewAll', 'View all categories')
        : translate('explore.aboutPlatform', 'About this platform');

      showMessage(
        articleList,
        message,
        actionHref,
        actionLabel,
        isInvalidCategory ? translate('explore.invalidCategoryTitle', 'Category not found') : undefined
      );
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

      loadedCategories = categories;
      loadedArticles = articles;
      renderExplore();
    } catch {
      loadFailed = true;
      showMessage(categoryList, translate('explore.loadCategoriesError', 'The category list could not be loaded.'), '/explore.html', translate('explore.retry', 'Retry'));
      showMessage(articleList, translate('explore.loadArticlesError', 'The article library could not be loaded.'), '/explore.html', translate('explore.retry', 'Retry'));
      categoryCount.textContent = translate('explore.unavailable', 'Unavailable');
      articleCount.textContent = '';
    }
  }

  // Re-render cached content when the visitor changes language; no page reload
  // or additional API requests are needed for the existing category/article data.
  document.addEventListener('xychen-language-change', renderExplore);

  loadExplore();
})();
