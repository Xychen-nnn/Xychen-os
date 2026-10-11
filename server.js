const path = require('path');
const express = require('express');
const { notFound, errorHandler } = require('./src/middleware/errors');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use('/api', require('./src/routes/health'));
app.use('/api/site', require('./src/routes/site'));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => console.log(`Xychen OS listening on http://localhost:${PORT}`));
}

module.exports = app;
