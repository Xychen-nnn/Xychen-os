(() => {
  const page = document.body.dataset.page || '';
  const navigation = [
    ['home', 'Home', '/', 'nav.home'],
    ['about', 'About', '/about.html', 'nav.about'],
    ['projects', 'Projects', '/projects.html', 'nav.projects'],
    ['explore', 'Explore', '/explore.html', 'nav.explore'],
    ['links', 'Links', '/links.html', 'nav.links']
  ];

  function createLink(label, href, className, translationKey) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (className) link.className = className;
    if (translationKey) link.dataset.i18n = translationKey;
    return link;
  }

  const headerMount = document.querySelector('[data-site-header]');
  if (headerMount) {
    const header = document.createElement('header');
    header.className = 'site-header';
    const brand = createLink('', '/', 'brand');
    brand.setAttribute('aria-label', 'Xychen OS home');
    const mark = document.createElement('span');
    mark.className = 'brand-mark';
    mark.textContent = 'X';
    const brandName = document.createElement('span');
    brandName.textContent = 'Xychen OS';
    brand.append(mark, brandName);

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main navigation');
    nav.dataset.i18nAriaLabel = 'nav.main';
    navigation.forEach(([key, label, href, translationKey]) => {
      const link = createLink(label, href, '', translationKey);
      if (page === key || (page === 'article' && key === 'explore')) {
        link.setAttribute('aria-current', 'page');
      }
      nav.append(link);
    });

    const actions = document.createElement('div');
    actions.className = 'header-actions';

    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'theme-toggle';
    themeButton.dataset.themeToggle = '';
    themeButton.textContent = 'Dark mode';

    const languageSelect = document.createElement('select');
    languageSelect.className = 'language-select';
    languageSelect.dataset.languageSelect = '';
    languageSelect.setAttribute('aria-label', 'Language');
    languageSelect.dataset.i18nAriaLabel = 'language.label';
    languageSelect.title = 'Language';
    [['en', 'EN'], ['fil', 'FIL']].forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      languageSelect.append(option);
    });

    actions.append(themeButton, languageSelect);
    header.append(brand, nav, actions);
    headerMount.replaceWith(header);
  }

  const footerMount = document.querySelector('[data-site-footer]');
  if (footerMount) {
    const footer = document.createElement('footer');
    const copyright = document.createElement('span');
    copyright.append('© ');
    const year = document.createElement('span');
    year.dataset.currentYear = '';
    copyright.append(year, ' Xychen OS');

    const links = document.createElement('div');
    links.className = 'footer-links';
    links.append(
      createLink('About', '/about.html', '', 'nav.about'),
      createLink('Projects', '/projects.html', '', 'nav.projects'),
      createLink('Explore', '/explore.html', '', 'nav.explore'),
      createLink('Links', '/links.html', '', 'nav.links'),
      createLink('GitHub ↗', 'https://github.com/Xychen-nnn/Xychen-os')
    );
    links.lastElementChild.target = '_blank';
    links.lastElementChild.rel = 'noopener noreferrer';
    footer.append(copyright, links);
    footerMount.replaceWith(footer);
  }
})();
