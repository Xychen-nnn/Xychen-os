(() => {
  const categoryList = document.getElementById('category-list');
  const articleList = document.getElementById('article-list');
  const categoryCount = document.getElementById('category-count');
  const articleCount = document.getElementById('article-count');
  const articlesHeading = document.getElementById('articles-heading');
  const searchInput = document.getElementById('explore-search');
  const searchForm = document.getElementById('explore-search-form');
  const clearSearch = document.getElementById('clear-search');
  const filterStatus = document.getElementById('explore-filter-status');

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
  let categoriesLoadFailed = false;
  let articlesLoadFailed = false;

  function getFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      categoryId: params.get('category') || '',
      query: (params.get('q') || '').trim()
    };
  }

  function updateUrl({ categoryId, query }, method = 'pushState') {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (query) params.set('q', query);
    const search = params.toString();
    const nextUrl = window.location.pathname + (search ? '?' + search : '') + window.location.hash;
    window.history[method]({}, '', nextUrl);
  }

  function setLoading(container, message) {
    const paragraph = document.createElement('p');
    paragraph.className = 'muted';
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
  }

  function showMessage(container, message, actionHref, actionLabel, titleText, onAction) {
    const panel = document.createElement('div');
    panel.className = 'empty-state card-full';
    const title = document.createElement('h3');
    title.textContent = titleText || translate('explore.emptyTitle', 'Nothing published here yet');
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    panel.append(title, paragraph);

    if (actionLabel && onAction) {
      const action = document.createElement('button');
      action.className = 'button-secondary';
      action.type = 'button';
      action.textContent = actionLabel;
      action.addEventListener('click', onAction);
      panel.append(action);
    } else if (actionHref && actionLabel) {
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
    const lang = language();
    const filters = getFilters();
    searchInput.placeholder = translate('explore.searchPlaceholder', 'Search by title, summary, or tag');

    const categoryName = (category) =>
      lang === 'fil' ? category.nameFil || category.name : category.name;
    const categoryDescription = (category) =>
      lang === 'fil' ? category.descriptionFil || category.description : category.description;

    if (loadedCategories !== null) {
      const selected = filters.categoryId
        ? loadedCategories.find((category) => category.id === filters.categoryId)
        : null;

      categoryCount.textContent = loadedCategories.length +
        (lang === 'fil' ? ' kategorya' : (loadedCategories.length === 1 ? ' category' : ' categories'));

      categoryList.replaceChildren(...loadedCategories.map((category) => {
        const card = createCard(
          categoryName(category),
          categoryDescription(category),
          '/explore.html?category=' + encodeURIComponent(category.id),
          translate('explore.browseCategory', 'Browse category ↗'),
          categoryIcons[category.id] || '•'
        );
        if (selected && selected.id === category.id) {
          card.classList.add('is-selected');
          card.setAttribute('aria-current', 'true');
        }
        return card;
      }));
    } else if (categoriesLoadFailed) {
      categoryCount.textContent = translate('explore.unavailable', 'Unavailable');
      showMessage(
        categoryList,
        translate('explore.loadCategoriesError', 'The category list could not be loaded.'),
        null,
        translate('explore.retry', 'Retry'),
        undefined,
        loadCategories
      );
    }

    if (loadedArticles === null) {
      if (articlesLoadFailed) {
        articleCount.textContent = '';
        showMessage(
          articleList,
          translate('explore.loadArticlesError', 'The article library could not be loaded.'),
          null,
          translate('explore.retry', 'Retry'),
          undefined,
          loadArticles
        );
      }
      return;
    }

    const selected = filters.categoryId && loadedCategories !== null
      ? loadedCategories.find((category) => category.id === filters.categoryId)
      : null;
    const invalidCategory = Boolean(filters.categoryId && loadedCategories !== null && !selected);
    const categoryUnavailable = Boolean(filters.categoryId && loadedCategories === null);

    const normalizedQuery = filters.query.toLocaleLowerCase();
    const visibleArticles = loadedArticles.filter((article) => {
      if (filters.categoryId && article.category !== filters.categoryId) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        article.title,
        article.titleFil,
        article.summary,
        article.summaryFil,
        ...(Array.isArray(article.tags) ? article.tags : [])
      ].filter(Boolean).join(' ').toLocaleLowerCase();

      return searchable.includes(normalizedQuery);
    });

    articlesHeading.textContent = selected
      ? categoryName(selected) + (lang === 'fil' ? ' — Mga Artikulo' : ' articles')
      : invalidCategory
        ? translate('explore.invalidCategoryTitle', 'Category not found')
        : categoryUnavailable
          ? filters.categoryId
          : translate('explore.articlesTitle', 'Published articles');

    articleCount.textContent = visibleArticles.length +
      (lang === 'fil' ? ' artikulo' : (visibleArticles.length === 1 ? ' article' : ' articles'));

    if (filterStatus) {
      const parts = [];
      if (selected) parts.push(categoryName(selected));
      else if (filters.categoryId) parts.push(filters.categoryId);
      if (filters.query) parts.push('“' + filters.query + '”');
      filterStatus.textContent = parts.length
        ? translate('explore.filteringBy', 'Filtering by') + ': ' + parts.join(' · ')
        : translate('explore.allContent', 'Showing all published articles');
    }

    if (!visibleArticles.length) {
      const message = invalidCategory
        ? translate('explore.invalidCategory', 'That category does not exist.')
        : categoryUnavailable
          ? translate('explore.loadCategoriesError', 'The category list could not be loaded.')
          : filters.query
            ? translate('explore.noSearchResults', 'No published articles match your search. Try another term or clear the filters.')
            : selected
              ? translate('explore.categoryEmpty', 'There are no reviewed articles in this category yet.')
              : translate('explore.libraryEmpty', 'The article library is being prepared.');

      const hasActiveFilters = Boolean(filters.categoryId || filters.query);
      showMessage(
        articleList,
        message,
        hasActiveFilters ? '/explore.html' : '/about.html',
        hasActiveFilters
          ? translate('explore.clearFilters', 'Clear filters')
          : translate('explore.aboutPlatform', 'About this platform'),
        invalidCategory ? translate('explore.invalidCategoryTitle', 'Category not found') : undefined
      );
      return;
    }

    articleList.replaceChildren(...visibleArticles.map((article) => {
      const title = lang === 'fil' ? article.titleFil || article.title : article.title;
      const summary = lang === 'fil'
        ? article.summaryFil || article.summary || translate('explore.articleFallback', 'Open this article to read the full explanation and its sources.')
        : article.summary || translate('explore.articleFallback', 'Open this article to read the full explanation and its sources.');
      const card = createCard(
        title,
        summary,
        '/articles/' + encodeURIComponent(article.slug),
        translate('explore.readArticle', 'Read article ↗')
      );
      if (Array.isArray(article.tags) && article.tags.length) {
        const tags = document.createElement('div');
        tags.className = 'tag-row';
        article.tags.slice(0, 4).forEach((tag) => {
          const chip = document.createElement('span');
          chip.className = 'tag';
          chip.textContent = tag;
          tags.append(chip);
        });
        card.insertBefore(tags, card.lastElementChild);
      }
      return card;
    }));
  }

  async function loadCategories() {
    categoriesLoadFailed = false;
    setLoading(categoryList, 'Loading categories…');
    categoryCount.textContent = 'Loading categories…';

    try {
      const response = await fetch('/api/content/categories', {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('The category service returned an unavailable response.');

      const body = await response.json();
      if (!Array.isArray(body.categories)) {
        throw new Error('The category service returned an invalid response.');
      }

      loadedCategories = body.categories;
    } catch {
      loadedCategories = null;
      categoriesLoadFailed = true;
    }

    renderExplore();
  }

  async function loadArticles() {
    articlesLoadFailed = false;
    setLoading(articleList, 'Loading articles…');
    articleCount.textContent = '';

    try {
      const response = await fetch('/api/content/articles', {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('The article service returned an unavailable response.');

      const body = await response.json();
      if (!Array.isArray(body.articles)) {
        throw new Error('The article service returned an invalid response.');
      }

      loadedArticles = body.articles;
    } catch {
      loadedArticles = null;
      articlesLoadFailed = true;
    }

    renderExplore();
  }

  function resetFilters() {
    searchInput.value = '';
    updateUrl({ categoryId: '', query: '' });
    renderExplore();
  }

  function loadExplore() {
    searchInput.value = getFilters().query;
    loadCategories();
    loadArticles();
  }

  categoryList.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || target.pathname !== '/explore.html') return;

    const requestedCategory = target.searchParams.get('category') || '';
    if (!requestedCategory) return;

    event.preventDefault();
    const current = getFilters();
    const nextCategory = requestedCategory === current.categoryId ? '' : requestedCategory;
    updateUrl({ categoryId: nextCategory, query: current.query });
    renderExplore();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const current = getFilters();
    updateUrl({ categoryId: current.categoryId, query: searchInput.value.trim() });
    renderExplore();
  });

  searchInput.addEventListener('input', () => {
    const current = getFilters();
    updateUrl({ categoryId: current.categoryId, query: searchInput.value.trim() }, 'replaceState');
    renderExplore();
  });

  clearSearch.addEventListener('click', () => {
    const current = getFilters();
    searchInput.value = '';
    updateUrl({ categoryId: current.categoryId, query: '' });
    renderExplore();
  });

  articleList.addEventListener('click', (event) => {
    const clearLink = event.target.closest('a[href="/explore.html"]');
    if (!clearLink) return;
    event.preventDefault();
    resetFilters();
  });

  window.addEventListener('popstate', () => {
    searchInput.value = getFilters().query;
    renderExplore();
  });

  // Re-render cached content when the visitor changes language.
  document.addEventListener('xychen-language-change', renderExplore);

  loadExplore();
})();