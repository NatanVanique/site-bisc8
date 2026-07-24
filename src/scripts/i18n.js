(function () {
  'use strict';

  const LANG_KEY = 'bisc8-lang';
  const SUPPORTED = ['pt', 'en', 'es'];
  const FLAG_URLS = { pt: 'br', en: 'us', es: 'es' };
  const LANG_NAMES = { pt: 'Portugues', en: 'English', es: 'Espanol' };

  let currentLang = localStorage.getItem(LANG_KEY) || 'pt';
  if (!SUPPORTED.includes(currentLang)) currentLang = 'pt';

  let translations = {};

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
      setText('.portfolio-project-description', 'members.natan.project.description');
      const projectSubtitle = document.querySelector('.portfolio-project-header p');
      if (projectSubtitle && translations['members.natan.project.subtitle']) {
        projectSubtitle.textContent = translations['members.natan.project.subtitle'];
      }
    }
  }

  function applyGameTranslations() {
    const slug = getPageSlug('games');
    if (!slug) return;

    setTextKeepingIcon('.detail-download', 'games.unavailable');
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
