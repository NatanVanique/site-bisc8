(function () {
  'use strict';

  const LANG_KEY = 'bisc8-lang';
  const SUPPORTED = ['pt', 'en', 'es'];
  const FLAG_URLS = { pt: 'br', en: 'us', es: 'es' };
  const LANG_NAMES = { pt: 'Portugues', en: 'English', es: 'Espanol' };

  let currentLang = localStorage.getItem(LANG_KEY) || 'pt';
  if (!SUPPORTED.includes(currentLang)) currentLang = 'pt';

  let translations = {};

  function buildStandardNavbar() {
    const navbar = document.querySelector('.navbar-bisc');
    if (!navbar) return;

    const path = window.location.pathname.replace(/\\/g, '/');
    const isGamePage = path.includes('/pages/games/');
    const isTeamPage = path.includes('/pages/team/');
    const isNestedPage = isGamePage || isTeamPage;
    const home = isNestedPage ? '../../index.html' : '';
    const homeTop = isNestedPage ? '../../index.html' : '#';
    const imagePath = isNestedPage ? '../../assets/images/' : 'assets/images/';
    const games = isNestedPage ? '../games/' : 'pages/games/';
    const activeClass = (section) => {
      if (section === 'games' && isGamePage) return ' active';
      if (section === 'team' && isTeamPage) return ' active';
      if (section === 'home' && !isNestedPage) return ' active';
      return '';
    };

    navbar.id = 'mainNavbar';
    navbar.innerHTML = `
      <div class="container-fluid px-4">
        <a class="navbar-brand" href="${homeTop}">
          <img class="navbar-brand-image navbar-brand-image-orange" src="${imagePath}bisc8-wordmark-orange.png" alt="BISC8">
          <img class="navbar-brand-image navbar-brand-image-white" src="${imagePath}gamedevs-wordmark-white.png" alt="Game Devs">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Abrir navegação">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li class="nav-item"><a class="nav-link${activeClass('home')}" href="${homeTop}" data-i18n="nav.home">Página Inicial</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle${activeClass('games')}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-i18n="nav.games">Jogos</a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><a class="dropdown-item" href="${games}noon.html">Noon</a></li>
                <li><a class="dropdown-item" href="${games}bananabongo.html">BananaBongô</a></li>
                <li><a class="dropdown-item" href="${games}overtime.html">Overtime</a></li>
                <li><a class="dropdown-item" href="${games}pops.html">Pops: On the Go</a></li>
                <li><a class="dropdown-item" href="${games}trashexe.html">Trash.exe</a></li>
                <li><a class="dropdown-item" href="${games}lastplant.html">Last Plan't</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link${activeClass('team')}" href="${home}#quem-somos" data-i18n="nav.team">Equipe</a></li>
            <li class="nav-item"><a class="nav-link" href="${home}#contato" data-i18n="nav.contact">Contato</a></li>
            <li class="nav-item dropdown ms-lg-2">
              <a class="nav-link dropdown-toggle lang-selector" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://flagcdn.com/w40/br.png" alt="Brasil">
                <span data-i18n="nav.lang">Idiomas</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                <li><a class="dropdown-item lang-option active-lang" href="#"><img src="https://flagcdn.com/w40/br.png" alt="Brasil" class="lang-flag"> Português</a></li>
                <li><a class="dropdown-item lang-option" href="#"><img src="https://flagcdn.com/w40/us.png" alt="Estados Unidos" class="lang-flag"> English</a></li>
                <li><a class="dropdown-item lang-option" href="#"><img src="https://flagcdn.com/w40/es.png" alt="Espanha" class="lang-flag"> Español</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>`;

    if (!window.bootstrap && !document.querySelector('script[data-bisc-bootstrap]')) {
      const bootstrapScript = document.createElement('script');
      bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
      bootstrapScript.dataset.biscBootstrap = 'true';
      document.body.appendChild(bootstrapScript);
    }
  }

  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/games/') || path.includes('/pages/team/')) {
      return '../../src/translations/';
    }
    return 'src/translations/';
  }

  async function loadTranslations(lang) {
    try {
      const response = await fetch(getBasePath() + lang + '.json');
      if (!response.ok) throw new Error('Failed to load ' + lang);
      translations = await response.json();
    } catch (e) {
      console.warn('i18n: fallback to pt', e);
      if (lang !== 'pt') {
        const response = await fetch(getBasePath() + 'pt.json');
        translations = await response.json();
      }
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (translations[key] !== undefined) {
        el.textContent = translations[key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      if (translations[key] !== undefined) {
        el.innerHTML = translations[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key] !== undefined) {
        el.placeholder = translations[key];
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria');
      if (translations[key] !== undefined) {
        el.setAttribute('aria-label', translations[key]);
      }
    });

    applyPageTranslations();
  }

  function setText(selector, key) {
    const value = translations[key];
    if (value === undefined) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  function setTextKeepingIcon(selector, key) {
    const value = translations[key];
    if (value === undefined) return;
    document.querySelectorAll(selector).forEach(function (el) {
      const icon = el.querySelector('i');
      el.replaceChildren();
      if (icon) el.append(icon);
      el.append(document.createTextNode(' ' + value));
    });
  }

  function setTextThenIcon(selector, key) {
    const value = translations[key];
    if (value === undefined) return;
    document.querySelectorAll(selector).forEach(function (el) {
      const icon = el.querySelector('i');
      el.replaceChildren(document.createTextNode(value + ' '));
      if (icon) el.append(icon);
    });
  }

  function getPageSlug(section) {
    const match = window.location.pathname.match(new RegExp('/pages/' + section + '/([^/]+)\\.html$'));
    return match ? match[1] : '';
  }

  function applyMemberTranslations() {
    const slug = getPageSlug('team');
    if (!slug) return;

    setText('.member-role', 'members.' + slug + '.role');
    setText('.member-page .nav-link.ms-auto', 'nav.home');
    setTextKeepingIcon('.member-back', 'team.back');
    const bio = document.querySelector('.member-bio');
    const bioTranslation = translations['members.' + slug + '.bio'];
    if (bio && bioTranslation !== undefined) bio.innerHTML = bioTranslation;

    setText('.member-contact-title', 'team.contacts');
    setText('.member-portfolio-title', 'team.portfolio');
    setText('.member-portfolio-card:not(.portfolio-folder-card) span', 'team.noWork');
    setText('.member-profile-detail:first-child h2', 'team.skills');
    setText('.member-profile-detail:last-child h2', 'team.programs');

    document.querySelectorAll('.member-profile-detail:first-child .member-profile-items span').forEach(function (el, index) {
      const value = translations['members.' + slug + '.skill.' + (index + 1)];
      if (value !== undefined) el.textContent = value;
    });

    if (slug === 'natan') {
      setText('[data-portfolio-back]', 'team.portfolioBack');
      setText('[data-concept-project] .portfolio-project-description', 'members.natan.project.description');
      const projectSubtitle = document.querySelector('[data-concept-project] .portfolio-project-header p');
      if (projectSubtitle && translations['members.natan.project.subtitle']) {
        projectSubtitle.textContent = translations['members.natan.project.subtitle'];
      }
    }
  }

  function applyGameTranslations() {
    const slug = getPageSlug('games');
    if (!slug) return;

    setTextKeepingIcon('.detail-download[aria-disabled="true"]', 'games.unavailable');
    setTextThenIcon('.game-subscribe-toggle', 'games.subscribe.toggle');
    document.querySelectorAll('.detail-tags li').forEach(function (el, index) {
      const value = translations['games.' + slug + '.tag.' + (index + 1)];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('.detail-features li').forEach(function (el, index) {
      const value = translations['games.' + slug + '.feature.' + (index + 1)];
      if (value === undefined) return;
      const icon = el.querySelector('i');
      el.replaceChildren();
      if (icon) el.append(icon);
      el.append(document.createTextNode(' ' + value));
    });

    const tags = document.querySelector('.detail-tags');
    const features = document.querySelector('.detail-features');
    if (tags && translations['games.tags']) tags.setAttribute('aria-label', translations['games.tags']);
    if (features && translations['games.features']) features.setAttribute('aria-label', translations['games.features']);
  }

  function applyHomeTranslations() {
    document.querySelectorAll('.team-card').forEach(function (card) {
      const link = card.getAttribute('href') || '';
      const match = link.match(/pages\/team\/([^/]+)\.html/);
      if (!match) return;
      const role = card.querySelector('.team-card-role');
      const value = translations['members.' + match[1] + '.role'];
      if (role && value !== undefined) role.textContent = value;
    });
  }

  function applyPageTranslations() {
    applyMemberTranslations();
    applyGameTranslations();
    applyHomeTranslations();
  }

  function updateLangSelectorUI() {
    var countryCode = FLAG_URLS[currentLang] || 'br';

    document.querySelectorAll('.lang-option').forEach(function (item) {
      item.classList.remove('active-lang');
      var img = item.querySelector('.lang-flag');
      if (img) {
        var imgCountry = img.src.match(/w40\/(\w+)\./);
        if (imgCountry && imgCountry[1] === countryCode) {
          item.classList.add('active-lang');
        }
      }
    });

    var selector = document.querySelector('.lang-selector');
    if (selector) {
      var flagImg = selector.querySelector('img');
      if (flagImg) {
        flagImg.src = 'https://flagcdn.com/w40/' + countryCode + '.png';
        flagImg.alt = LANG_NAMES[currentLang] || currentLang;
      }
    }

    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : currentLang;
  }

  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    await loadTranslations(lang);
    applyTranslations();
    updateLangSelectorUI();

    if (typeof window.onLanguageChanged === 'function') {
      window.onLanguageChanged(lang, translations);
    }
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-option').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var img = item.querySelector('.lang-flag');
        if (!img) return;
        var match = img.src.match(/w40\/(\w+)\./);
        if (!match) return;
        var code = match[1];
        var langMap = { br: 'pt', us: 'en', es: 'es' };
        var lang = langMap[code];
        if (lang) setLanguage(lang);
      });
    });
  }

  async function init() {
    buildStandardNavbar();
    await loadTranslations(currentLang);
    applyTranslations();
    updateLangSelectorUI();
    initLangSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.i18n = {
    setLanguage: setLanguage,
    getLanguage: function () { return currentLang; },
    getTranslations: function () { return translations; }
  };
})();
