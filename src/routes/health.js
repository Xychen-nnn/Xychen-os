const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.1.0',
    website: 'operational',
    api: 'operational'
  });
});

module.exports = router;
