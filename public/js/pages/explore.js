(() => {
  const categoryList = document.getElementById('category-list');
  const articleList = document.getElementById('article-list');
  const categoryCount = document.getElementById('category-count');
  const articleCount = document.getElementById('article-count');

  function showMessage(container, message) {
    const paragraph = document.createElement('p');
    paragraph.className = 'muted';
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
  }

  function createCard(title, description, href, label) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = href;
    const heading = document.createElement('h3');
    heading.textContent = title;
    const summary = document.createElement('p');
    summary.textContent = description || 'Explore published content in this category.';
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
        createCard(category.name, category.description, '/explore.html?category=' + encodeURIComponent(category.id), 'Browse category ↗')
      ));

      const selectedCategory = new URLSearchParams(window.location.search).get('category');
      const selected = selectedCategory
        ? categories.find((category) => category.id === selectedCategory)
        : null;
      const visibleArticles = selected ? articles.filter((article) => article.category === selected.id) : articles;
      document.getElementById('articles-heading').textContent = selected ? selected.name + ' articles' : 'Published articles';
      articleCount.textContent = visibleArticles.length + (visibleArticles.length === 1 ? ' article' : ' articles');

      if (!visibleArticles.length) {
        showMessage(articleList, selected
          ? 'There are no published articles in this category yet.'
          : 'No articles have been published yet. Check back as the library grows.');
        return;
      }

      articleList.replaceChildren(...visibleArticles.map((article) =>
        createCard(article.title, article.summary, '/article.html?slug=' + encodeURIComponent(article.slug), 'Read article ↗')
      ));
    } catch (error) {
      showMessage(categoryList, 'Categories are temporarily unavailable. Please try again later.');
      showMessage(articleList, 'Published articles are temporarily unavailable. Please try again later.');
      categoryCount.textContent = 'Unavailable';
      articleCount.textContent = '';
    }
  }

  loadExplore();
})();