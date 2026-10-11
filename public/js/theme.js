(() => {
  const root = document.documentElement;
  const key = 'xychen-os-theme';
  const saved = localStorage.getItem(key);
  const preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = saved === 'dark' || saved === 'light' ? saved : preferred;

  function updateButton() {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    const dark = root.dataset.theme === 'dark';
    button.textContent = dark ? '☀️ Light' : '🌙 Dark';
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    button.setAttribute('aria-pressed', String(dark));
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateButton();
    const button = document.querySelector('[data-theme-toggle]');
    if (button) button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, root.dataset.theme); } catch (_) {}
      updateButton();
    });
    const year = document.querySelector('[data-current-year]');
    if (year) year.textContent = new Date().getFullYear();
  });
})();