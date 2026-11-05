(() => {
  const root = document.documentElement;
  const key = 'xychen-os-theme';

  function updateButton() {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    const dark = root.dataset.theme === 'dark';
    const label = dark ? 'theme.lightMode' : 'theme.darkMode';
    button.textContent = window.XychenI18n
      ? window.XychenI18n.t(label)
      : (dark ? 'Light mode' : 'Dark mode');
    button.setAttribute('aria-label', window.XychenI18n
      ? window.XychenI18n.t(dark ? 'theme.switchToLight' : 'theme.switchToDark')
      : (dark ? 'Switch to light theme' : 'Switch to dark theme'));
    button.setAttribute('aria-pressed', String(dark));
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateButton();

    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(key, root.dataset.theme);
        } catch (_) {
          // Theme switching still works when storage is unavailable.
        }
        updateButton();
      });
    }

    const year = document.querySelector('[data-current-year]');
    if (year) year.textContent = new Date().getFullYear();
  });

  document.addEventListener('xychen-language-change', updateButton);
})();
