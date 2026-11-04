const path = require('path');
const express = require('express');
const { notFound, errorHandler } = require('./src/middleware/errors');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('trust proxy', 1);
app.disable('x-powered-by');

// Apply a restrictive policy that matches the site's same-origin assets.
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'"
    ].join('; ')
  );

  // Vercel terminates HTTPS before forwarding requests to this function.
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

app.use('/api', require('./src/routes/health'));
app.use('/api/site', require('./src/routes/site'));
app.use('/api/content', require('./src/routes/content'));

// Keep the old query-based article URL working while moving to crawlable paths.
app.get('/article.html', (req, res, next) => {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return next();
  return res.redirect(301, '/articles/' + encodeURIComponent(slug));
});

app.use('/articles', require('./src/routes/articles'));

app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (path.extname(filePath).toLowerCase() === '.html') {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return;
    }

    // Assets are not content-hashed, so use a short cache lifetime.
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }
}));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(notFound);
app.use(errorHandler);

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Xychen OS listening on http://localhost:${PORT}`));
}

module.exports = app;
