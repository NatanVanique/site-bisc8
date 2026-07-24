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
