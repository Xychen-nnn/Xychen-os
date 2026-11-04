(() => {
  const textInput = document.getElementById('text-input');
  const words = document.getElementById('word-count');
  const chars = document.getElementById('char-count');
  const lines = document.getElementById('line-count');
  function countText() {
    const value = textInput.value;
    words.textContent = (value.trim().match(/\S+/g) || []).length;
    chars.textContent = value.length;
    lines.textContent = value.length ? value.split(/\r\n|\r|\n/).length : 0;
  }
  textInput.addEventListener('input', countText);
  document.getElementById('uppercase').addEventListener('click', () => { textInput.value = textInput.value.toUpperCase(); countText(); });
  document.getElementById('lowercase').addEventListener('click', () => { textInput.value = textInput.value.toLowerCase(); countText(); });
  document.getElementById('clear-text').addEventListener('click', () => { textInput.value = ''; countText(); textInput.focus(); });

  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const jsonStatus = document.getElementById('json-status');
  function transformJson(spaces) {
    try {
      const parsed = JSON.parse(jsonInput.value);
      const result = JSON.stringify(parsed, null, spaces);
      jsonOutput.textContent = result;
      jsonStatus.textContent = 'Valid JSON. Result ready.';
      jsonStatus.style.color = 'var(--success)';
    } catch (error) {
      jsonOutput.textContent = '';
      jsonStatus.textContent = 'Invalid JSON: ' + error.message;
      jsonStatus.style.color = 'var(--muted)';
    }
  }
  document.getElementById('format-json').addEventListener('click', () => transformJson(2));
  document.getElementById('minify-json').addEventListener('click', () => transformJson(0));
  document.getElementById('copy-json').addEventListener('click', async () => {
    const result = jsonOutput.textContent;
    if (!result.trim()) { jsonStatus.textContent = 'There is no result to copy yet.'; return; }
    try {
      await navigator.clipboard.writeText(result);
      jsonStatus.textContent = 'Copied to clipboard.';
    } catch (_) {
      jsonStatus.textContent = 'Clipboard access is unavailable in this browser. Select the result and copy it manually.';
    }
  });
})();
