const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    name: 'Xychen OS',
    tagline: 'A personal digital space, built by Xychen.',
    version: '1.1.0',
    release: 'personal-platform',
    features: {
      projects: true,
      browserTools: true,
      playground: true,
      themeSwitching: true,
      accounts: false,
      communitySubmissions: false,
      admin: false,
      externalIntegrations: false
    },
    links: {
      home: '/',
      about: '/about.html',
      projects: '/projects.html',
      tools: '/tools.html',
      playground: '/playground.html',
      links: '/links.html'
    }
  });
});

module.exports = router;
