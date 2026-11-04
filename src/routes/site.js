const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    name: 'Xychen OS',
    tagline: 'A personal digital platform for projects and topics worth exploring.',
    version: '1.3.0',
    release: 'personal-platform',
    features: {
      projects: true,
      informationHub: true,
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
      explore: '/explore.html',
      links: '/links.html'
    }
  });
});

module.exports = router;
