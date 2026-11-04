(() => {
  const page = document.body.dataset.page || '';
  const navigation = [
    ['home', 'Home', '/'],
    ['about', 'About', '/about.html'],
    ['projects', 'Projects', '/projects.html'],
    ['tools', 'Tools', '/tools.html'],
    ['links', 'Links', '/links.html']
  ];

  function createLink(label, href, className) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (className) link.className = className;
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
    navigation.forEach(([key, label, href]) => {
      const link = createLink(label, href);
      if (page === key) link.setAttribute('aria-current', 'page');
      nav.append(link);
    });

    const actions = document.createElement('div');
    actions.className = 'header-actions';
    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'theme-toggle';
    themeButton.dataset.themeToggle = '';
    themeButton.textContent = 'Toggle theme';
    actions.append(themeButton);

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
      createLink('About', '/about.html'),
      createLink('Projects', '/projects.html'),
      createLink('Tools', '/tools.html'),
      createLink('GitHub ↗', 'https://github.com/Xychen-nnn/Xychen-os')
    );
    links.lastElementChild.target = '_blank';
    links.lastElementChild.rel = 'noopener noreferrer';
    footer.append(copyright, links);
    footerMount.replaceWith(footer);
  }
})();