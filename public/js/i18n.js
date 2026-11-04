(() => {
  const messages = {
    en: {
      'nav.home': 'Home', 'nav.about': 'About', 'nav.projects': 'Projects', 'nav.explore': 'Explore', 'nav.links': 'Links', 'nav.main': 'Main navigation',
      'language.label': 'Language', 'theme.darkMode': 'Dark mode', 'theme.lightMode': 'Light mode', 'theme.switchToLight': 'Switch to light theme', 'theme.switchToDark': 'Switch to dark theme',
      'home.eyebrow': 'An independent digital space',
      'home.title': 'Projects, ideas, and things worth exploring.',
      'home.lead': 'Xychen OS is a personal website that brings selected projects, public links, and an expanding library of topics together in one place.',
      'home.ctaExplore': 'Explore topics ↗', 'home.ctaProjects': 'View the project',
      'home.tagPersonal': 'Personal website', 'home.tagProjects': 'Project space', 'home.tagLibrary': 'Knowledge library',
      'home.sectionEyebrow': 'Find your way around', 'home.sectionTitle': 'Explore the platform', 'home.sectionMeta': 'Three places to start',
      'home.projectsTitle': 'Projects', 'home.projectsText': 'See the work currently being built, with real descriptions and links to its source.', 'home.projectsLink': 'View projects ↗',
      'home.exploreTitle': 'Explore', 'home.exploreText': 'Browse categories covering technology, science, astronomy, nature, gaming, and more.', 'home.exploreLink': 'Browse topics ↗',
      'home.aboutTitle': 'About', 'home.aboutText': 'Understand what this website is for, what it includes, and how it is being developed.', 'home.aboutLink': 'About Xychen OS ↗',
      'home.ideaEyebrow': 'Built with intention', 'home.ideaTitle': 'A useful website, not a collection of empty features.',
      'home.ideaText': 'Each section should have a clear purpose. Projects should be real, articles should be reviewed, and links should lead somewhere useful. The platform will grow as its content and features are ready.',
      'home.ideaLink': 'Read about the platform',
      'about.eyebrow': 'About the platform', 'about.title': 'A personal website with a clear purpose.',
      'about.intro': 'Xychen OS brings projects, public destinations, and carefully prepared information into one organized digital space.',
      'about.ideaEyebrow': 'The idea', 'about.ideaTitle': 'One place for the things being built and explored.',
      'about.ideaText1': 'This website is the public-facing home of the Xychen platform. It gives visitors a way to understand current projects, find official links, and explore topics through a growing article library.',
      'about.ideaText2': 'It is being developed in stages. A section belongs here when it has a real purpose, accurate information, and a reliable experience behind it.',
      'about.structureTitle': 'Clear structure', 'about.structureText': 'Pages are organized around projects, information, and useful destinations—not a long list of unrelated features.',
      'about.publishingTitle': 'Careful publishing', 'about.publishingText': 'Articles should be understandable, checked against reliable sources, and reviewed before they appear publicly.',
      'about.sectionsEyebrow': 'What you can find', 'about.sectionsTitle': 'Inside the website',
      'about.projectsTitle': 'Projects', 'about.projectsText': 'Current work with honest status information and links to the relevant source or live destination.',
      'about.exploreTitle': 'Explore', 'about.exploreText': 'A category-based library for articles and guides across selected areas of interest.',
      'about.linksTitle': 'Public links', 'about.linksText': 'Official websites and profiles that are intentionally shared with visitors.',
      'about.scopeEyebrow': 'Current scope', 'about.scopeTitle': 'Website first. More only when it makes sense.',
      'about.scopeText': 'The current release is a website. It does not claim to provide user accounts, a community system, a mobile app, or external service integrations. Those would need separate planning and a working implementation before being presented as available features.',
      'about.scopeLink': 'See the current project',
      'projects.eyebrow': 'What is being built', 'projects.title': 'Projects',
      'projects.intro': 'A focused list of projects with real descriptions and working destinations. Only projects ready to be shared belong here.',
      'projects.tagWebsite': 'Website', 'projects.tagStatus': 'In development', 'projects.projectTitle': 'Xychen OS',
      'projects.projectText1': 'A personal digital platform that brings project information, selected links, and an editorial library of topics into one website.',
      'projects.projectText2': 'The current release focuses on the public website, shared interface, project information, and a content system for reviewed articles.',
      'projects.source': 'View source ↗', 'projects.open': 'Open website',
      'projects.note': 'More projects will appear here when there is something real and ready to share.',
      'links.eyebrow': 'Official destinations', 'links.title': 'Links',
      'links.intro': 'A short list of verified places to visit the project or view its source.',
      'links.githubTitle': 'GitHub repository', 'links.githubText': 'Browse the source code, project files, and development history.',
      'links.githubAction': 'github.com/Xychen-nnn/Xychen-os ↗',
      'links.liveTitle': 'Live website', 'links.liveText': 'Open the currently published version of Xychen OS.',
      'links.liveAction': 'xychen-os.vercel.app ↗',
      'links.moreEyebrow': 'More places', 'links.moreTitle': 'Public profiles will be listed when they are ready.',
      'links.profilesEyebrow': 'Around the web', 'links.profilesTitle': 'Social profiles', 'links.profilesNote': 'Official accounts', 'links.facebookLabel': 'Facebook link',
      'links.communityEyebrow': 'Community and source', 'links.communityTitle': 'Stay connected', 'links.discordTitle': 'Discord community', 'links.discordText': 'Join the community space.',
      'links.profilesEyebrow': 'Around the web', 'links.profilesTitle': 'Social profiles', 'links.profilesNote': 'Official accounts', 'links.facebookLabel': 'Facebook link',
      'links.communityEyebrow': 'Community and source', 'links.communityTitle': 'Stay connected', 'links.discordTitle': 'Discord community', 'links.discordText': 'Join the community space.',
      'explore.eyebrow': 'Topics and knowledge', 'explore.title': 'Explore',
      'explore.intro': 'Choose a subject to browse. This library is designed for clear explainers, practical guides, and articles with sources—not filler or unreviewed posts.',
      'explore.categoriesEyebrow': 'Browse by subject', 'explore.categoriesTitle': 'Categories',
      'explore.articlesEyebrow': 'The reading library', 'explore.articlesTitle': 'Published articles',
      'explore.notice': 'Articles are published after review. A category can be available before its first article is ready.',
      'explore.emptyTitle': 'Nothing published here yet', 'explore.categoryEmpty': 'There are no reviewed articles in this category yet. The category is ready, and articles will appear here once they are researched and published.', 'explore.libraryEmpty': 'The article library is being prepared. Published articles will appear here with summaries, dates, and source information.', 'explore.invalidCategory': 'That category does not exist. Return to the full category list to choose another topic.', 'explore.loadCategoriesError': 'The category list could not be loaded. Please try again later.', 'explore.loadArticlesError': 'The article library could not be loaded. Please try again later.', 'explore.browseCategory': 'Browse category ↗', 'explore.readArticle': 'Read article ↗', 'explore.articleFallback': 'Open this article to read the full explanation and its sources.', 'explore.viewAll': 'View all categories', 'explore.aboutPlatform': 'About this platform', 'explore.retry': 'Retry',
      'notfound.eyebrow': '404 · Not found', 'notfound.title': 'This page is not here.',
      'notfound.lead': 'The address may be outdated, or the page may have moved. You can return to the homepage or browse the current sections.',
      'notfound.home': 'Back to home', 'notfound.explore': 'Explore topics', 'article.openTitle': 'Open an article from Explore.', 'article.openText': 'Individual published articles use their own page address. Browse the library to choose an article.', 'article.browse': 'Browse Explore'
    },
    fil: {
      'nav.home': 'Home', 'nav.about': 'Tungkol', 'nav.projects': 'Mga Proyekto', 'nav.explore': 'Tuklasin', 'nav.links': 'Mga Link', 'nav.main': 'Pangunahing navigation',
      'language.label': 'Wika', 'theme.darkMode': 'Dark mode', 'theme.lightMode': 'Light mode', 'theme.switchToLight': 'Lumipat sa light theme', 'theme.switchToDark': 'Lumipat sa dark theme',
      'home.eyebrow': 'Isang personal na digital space',
      'home.title': 'Mga proyekto, ideya, at paksang sulit tuklasin.',
      'home.lead': 'Ang Xychen OS ay isang personal na website na pinagsasama ang mga proyekto, pampublikong link, at lumalawak na koleksiyon ng mga paksa sa iisang lugar.',
      'home.ctaExplore': 'Tuklasin ang mga paksa ↗', 'home.ctaProjects': 'Tingnan ang proyekto',
      'home.tagPersonal': 'Personal na website', 'home.tagProjects': 'Espasyo para sa proyekto', 'home.tagLibrary': 'Koleksiyon ng kaalaman',
      'home.sectionEyebrow': 'Piliin kung saan magsisimula', 'home.sectionTitle': 'Tuklasin ang platform', 'home.sectionMeta': 'Tatlong puwedeng puntahan',
      'home.projectsTitle': 'Mga Proyekto', 'home.projectsText': 'Tingnan ang mga kasalukuyang ginagawa, kasama ang malinaw na paglalarawan at link sa source.', 'home.projectsLink': 'Tingnan ang mga proyekto ↗',
      'home.exploreTitle': 'Tuklasin', 'home.exploreText': 'Mag-browse ng mga paksa tungkol sa teknolohiya, agham, astronomiya, kalikasan, gaming, at iba pa.', 'home.exploreLink': 'Mag-browse ng mga paksa ↗',
      'home.aboutTitle': 'Tungkol', 'home.aboutText': 'Alamin ang layunin ng website, ang mga nilalaman nito, at kung paano ito binubuo.', 'home.aboutLink': 'Tungkol sa Xychen OS ↗',
      'home.ideaEyebrow': 'May malinaw na layunin', 'home.ideaTitle': 'Kapaki-pakinabang na website, hindi koleksiyon ng bakanteng features.',
      'home.ideaText': 'Dapat may malinaw na silbi ang bawat bahagi. Dapat tunay ang mga proyekto, nasusuri ang mga artikulo, at may patutunguhan ang mga link. Lalawak ang platform kapag handa na ang nilalaman at mga feature nito.',
      'home.ideaLink': 'Alamin ang tungkol sa platform',
      'about.eyebrow': 'Tungkol sa platform', 'about.title': 'Personal na website na may malinaw na layunin.',
      'about.intro': 'Pinagsasama ng Xychen OS ang mga proyekto, pampublikong destinasyon, at maingat na inihandang impormasyon sa isang organisadong digital space.',
      'about.ideaEyebrow': 'Ang ideya', 'about.ideaTitle': 'Isang lugar para sa mga ginagawa at tinutuklas.',
      'about.ideaText1': 'Ito ang pampublikong tahanan ng Xychen platform. Dito maaaring alamin ng mga bisita ang kasalukuyang mga proyekto, hanapin ang mga opisyal na link, at tumuklas ng mga paksa sa lumalawak na koleksiyon ng mga artikulo.',
      'about.ideaText2': 'Binubuo ito nang paunti-unti. Isinasama lamang ang isang bahagi kapag may tunay itong layunin, tamang impormasyon, at maaasahang karanasan.',
      'about.structureTitle': 'Maayos na estruktura', 'about.structureText': 'Nakatuon ang mga pahina sa mga proyekto, impormasyon, at kapaki-pakinabang na destinasyon—hindi sa mahabang listahan ng magkakahiwalay na feature.',
      'about.publishingTitle': 'Maingat na paglalathala', 'about.publishingText': 'Dapat madaling maintindihan ang mga artikulo, nasusuri gamit ang mapagkakatiwalaang sources, at nare-review bago ilathala.',
      'about.sectionsEyebrow': 'Mga makikita rito', 'about.sectionsTitle': 'Mga bahagi ng website',
      'about.projectsTitle': 'Mga Proyekto', 'about.projectsText': 'Mga kasalukuyang ginagawa na may tapat na status at link sa kaugnay na source o live na website.',
      'about.exploreTitle': 'Tuklasin', 'about.exploreText': 'Koleksiyon ng mga artikulo at gabay na nakaayos ayon sa mga piling paksa.',
      'about.linksTitle': 'Mga pampublikong link', 'about.linksText': 'Mga opisyal na website at profile na piniling ibahagi sa mga bisita.',
      'about.scopeEyebrow': 'Kasalukuyang saklaw', 'about.scopeTitle': 'Website muna. Magdagdag lamang kapag may saysay.',
      'about.scopeText': 'Website ang kasalukuyang release. Wala pa itong user accounts, community system, mobile app, o external service integrations. Kailangan muna ng hiwalay na pagpaplano at gumaganang implementation bago ito maipakita bilang available na feature.',
      'about.scopeLink': 'Tingnan ang kasalukuyang proyekto',
      'projects.eyebrow': 'Mga kasalukuyang binubuo', 'projects.title': 'Mga Proyekto',
      'projects.intro': 'Piling listahan ng mga proyektong may totoong paglalarawan at gumaganang destinasyon. Ilalagay lamang dito ang mga handa nang ibahagi.',
      'projects.tagWebsite': 'Website', 'projects.tagStatus': 'Ginagawa pa', 'projects.projectTitle': 'Xychen OS',
      'projects.projectText1': 'Isang personal na digital platform na pinagsasama ang impormasyon ng proyekto, mga piling link, at koleksiyon ng mga paksa sa iisang website.',
      'projects.projectText2': 'Nakatuon ang kasalukuyang release sa pampublikong website, iisang interface, impormasyon ng proyekto, at content system para sa mga na-review na artikulo.',
      'projects.source': 'Tingnan ang source ↗', 'projects.open': 'Buksan ang website',
      'projects.note': 'Lalabas dito ang iba pang proyekto kapag may tunay nang handang ibahagi.',
      'links.eyebrow': 'Mga opisyal na destinasyon', 'links.title': 'Mga Link',
      'links.intro': 'Maikling listahan ng mga beripikadong lugar kung saan maaaring bisitahin ang proyekto o tingnan ang source nito.',
      'links.githubTitle': 'GitHub repository', 'links.githubText': 'Tingnan ang source code, project files, at kasaysayan ng development.',
      'links.githubAction': 'github.com/Xychen-nnn/Xychen-os ↗',
      'links.liveTitle': 'Live website', 'links.liveText': 'Buksan ang kasalukuyang inilathalang bersyon ng Xychen OS.',
      'links.liveAction': 'xychen-os.vercel.app ↗',
      'links.moreEyebrow': 'Iba pang profile', 'links.moreTitle': 'Ililista ang mga pampublikong profile kapag handa na.',
      'links.profilesEyebrow': 'Sa iba pang platform', 'links.profilesTitle': 'Mga social profile', 'links.profilesNote': 'Mga opisyal na account', 'links.facebookLabel': 'Facebook link',
      'links.communityEyebrow': 'Community at source', 'links.communityTitle': 'Manatiling konektado', 'links.discordTitle': 'Discord community', 'links.discordText': 'Sumali sa community space.',
      'explore.eyebrow': 'Mga paksa at kaalaman', 'explore.title': 'Tuklasin',
      'explore.intro': 'Pumili ng paksang gusto mong basahin. Para ito sa malinaw na paliwanag, praktikal na gabay, at mga artikulong may sources—hindi filler o hindi pa nasusuring posts.',
      'explore.categoriesEyebrow': 'Mag-browse ayon sa paksa', 'explore.categoriesTitle': 'Mga Kategorya',
      'explore.articlesEyebrow': 'Koleksiyon ng babasahin', 'explore.articlesTitle': 'Mga Nailathalang Artikulo',
      'explore.notice': 'Inilalathala ang mga artikulo matapos ang review. Maaaring available na ang kategorya bago maging handa ang unang artikulo nito.',
      'explore.emptyTitle': 'Wala pang nailalathalang artikulo rito', 'explore.categoryEmpty': 'Wala pang na-review na artikulo sa kategoryang ito. Handa na ang kategorya at lalabas dito ang mga artikulo kapag nasaliksik at nailathala na.', 'explore.libraryEmpty': 'Inihahanda pa ang koleksiyon ng mga artikulo. Lalabas dito ang mga nailathalang artikulo kasama ang buod, petsa, at sources.', 'explore.invalidCategory': 'Walang ganitong kategorya. Bumalik sa buong listahan ng mga kategorya para pumili ng iba.', 'explore.loadCategoriesError': 'Hindi ma-load ang listahan ng mga kategorya. Subukan ulit mamaya.', 'explore.loadArticlesError': 'Hindi ma-load ang koleksiyon ng mga artikulo. Subukan ulit mamaya.', 'explore.browseCategory': 'Tingnan ang kategorya ↗', 'explore.readArticle': 'Basahin ang artikulo ↗', 'explore.articleFallback': 'Buksan ang artikulo para mabasa ang buong paliwanag at sources nito.', 'explore.viewAll': 'Tingnan ang lahat ng kategorya', 'explore.aboutPlatform': 'Tungkol sa platform', 'explore.retry': 'Subukan ulit',
      'notfound.eyebrow': '404 · Hindi nahanap', 'notfound.title': 'Wala ang pahinang ito.',
      'notfound.lead': 'Maaaring luma na ang address o nailipat ang pahina. Bumalik sa homepage o tingnan ang mga kasalukuyang seksiyon.',
      'notfound.home': 'Bumalik sa home', 'notfound.explore': 'Tuklasin ang mga paksa', 'article.openTitle': 'Magbukas ng artikulo mula sa Explore.', 'article.openText': 'May sariling address ang bawat nailathalang artikulo. Mag-browse sa library para pumili ng babasahin.', 'article.browse': 'Buksan ang Explore'
    }
  };

  const storageKey = 'xychen-os-language';
  let currentLanguage = 'en';

  function detectLanguage() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'en' || saved === 'fil') return saved;
    } catch (_) {
      // Browser storage may be unavailable; use language detection instead.
    }

    const cookieMatch = document.cookie.match(/(?:^|;\s*)xychen-os-language=(en|fil)(?:;|$)/);
    if (cookieMatch) return cookieMatch[1];

    const browserLanguages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    return browserLanguages.some((language) => /^(fil|tl)(-|$)/i.test(language)) ? 'fil' : 'en';
  }

  function translate(key) {
    return (messages[currentLanguage] && messages[currentLanguage][key]) ||
      messages.en[key] || key;
  }

  function saveLanguageCookie(language) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = storageKey + '=' + language + '; Path=/; Max-Age=31536000; SameSite=Lax' + secure;
  }

  function applyLanguage(language, savePreference = false) {
    currentLanguage = language === 'fil' ? 'fil' : 'en';
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
    });

    const selector = document.querySelector('[data-language-select]');
    if (selector) {
      selector.value = currentLanguage;
      selector.setAttribute('aria-label', translate('language.label'));
    }

    saveLanguageCookie(currentLanguage);
    if (savePreference) {
      try {
        localStorage.setItem(storageKey, currentLanguage);
      } catch (_) {
        // The language still changes for the current page if storage is unavailable.
      }
    }

    document.dispatchEvent(new CustomEvent('xychen-language-change', {
      detail: { language: currentLanguage }
    }));
  }

  window.XychenI18n = {
    t: translate,
    getLanguage: () => currentLanguage,
    applyLanguage
  };

  const selector = document.querySelector('[data-language-select]');
  if (selector) {
    selector.addEventListener('change', () => {
      applyLanguage(selector.value, true);
      if (window.location.pathname.startsWith('/articles/')) window.location.reload();
    });
  }
  applyLanguage(detectLanguage());
})();
