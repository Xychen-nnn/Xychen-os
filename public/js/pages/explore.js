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
  let loadFailed = false;

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
    const filters = getFilters();
    searchInput.placeholder = translate('explore.searchPlaceholder', 'Search by title, summary, or tag');
    const categoryName = (category) =>
      lang === 'fil' ? category.nameFil || category.name : category.name;
    const categoryDescription = (category) =>
      lang === 'fil' ? category.descriptionFil || category.description : category.description;

    const selected = filters.categoryId
      ? loadedCategories.find((category) => category.id === filters.categoryId)
      : null;
    const invalidCategory = Boolean(filters.categoryId && !selected);

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

    const normalizedQuery = filters.query.toLocaleLowerCase();
    let visibleArticles = loadedArticles.filter((article) => {
      if (invalidCategory) return false;
      if (selected && article.category !== selected.id) return false;
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
        : translate('explore.articlesTitle', 'Published articles');

    articleCount.textContent = visibleArticles.length +
      (lang === 'fil' ? ' artikulo' : (visibleArticles.length === 1 ? ' article' : ' articles'));

    if (filterStatus) {
      const parts = [];
      if (selected) parts.push(categoryName(selected));
      if (filters.query) parts.push('“' + filters.query + '”');
      filterStatus.textContent = parts.length
        ? translate('explore.filteringBy', 'Filtering by') + ': ' + parts.join(' · ')
        : translate('explore.allContent', 'Showing all published articles');
    }

    if (!visibleArticles.length) {
      const message = invalidCategory
        ? translate('explore.invalidCategory', 'That category does not exist.')
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

  function resetFilters() {
    searchInput.value = '';
    updateUrl({ categoryId: '', query: '' });
    renderExplore();
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

      if (!Array.isArray(categories) || !Array.isArray(articles)) {
        throw new Error('The content service returned an invalid response.');
      }

      loadedCategories = categories;
      loadedArticles = articles;
      searchInput.value = getFilters().query;
      renderExplore();
    } catch {
      loadFailed = true;
      showMessage(categoryList, translate('explore.loadCategoriesError', 'The category list could not be loaded.'), '/explore.html', translate('explore.retry', 'Retry'));
      showMessage(articleList, translate('explore.loadArticlesError', 'The article library could not be loaded.'), '/explore.html', translate('explore.retry', 'Retry'));
      categoryCount.textContent = translate('explore.unavailable', 'Unavailable');
      articleCount.textContent = '';
    }
  }

  categoryList.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || target.pathname !== '/explore.html') return;
    event.preventDefault();
    const current = getFilters();
    const nextCategory = target.searchParams.get('category') || '';
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

  clearSearch.addEventListener('click', resetFilters);

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
