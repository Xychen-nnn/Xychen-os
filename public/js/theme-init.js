(() => {
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem('xychen-os-theme');
    const prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.dataset.theme = saved === 'dark' || saved === 'light'
      ? saved
      : (prefersDark ? 'dark' : 'light');
  } catch (_) {
    root.dataset.theme = 'light';
  }
})();
