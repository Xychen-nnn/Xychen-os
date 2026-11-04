const path = require('path');

function notFound(req, res) {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(404).sendFile(path.join(__dirname, '..', '..', 'public', '404.html'));
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) return next(err);

  const isApiRequest = req.path === '/api' || req.path.startsWith('/api/');
  if (isApiRequest) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(500).type('html').send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Server error — Xychen OS</title></head><body>' +
    '<main><h1>Something went wrong</h1><p>Please try again later.</p><a href="/">Back home</a></main>' +
    '</body></html>'
  );
}

module.exports = { notFound, errorHandler };
