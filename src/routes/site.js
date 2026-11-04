const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    name: 'Xychen OS',
    tagline: "A personal digital space for projects, tools, and resources.",
    version: '1.3.0',
    release: 'personal-platform',
    features: {
      projects: true,
      browserTools: true,
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
      links: '/links.html'
    }
  });
});

module.exports = router;
