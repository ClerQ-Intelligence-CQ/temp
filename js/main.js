/* ============================================================
   ClerQ Intelligence: Global JS
   Navigation, language toggle, wave draw-on, scroll handling
   ============================================================ */

(function () {
  'use strict';

  // ---- Language Toggle ----
  const LANG_KEY = 'clerq-lang';

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'en';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'sw' ? 'sw' : 'en');

    document.querySelectorAll('[data-en][data-sw]').forEach(function (el) {
      var text = lang === 'sw' ? el.getAttribute('data-sw') : el.getAttribute('data-en');
      if (text) el.textContent = text;
    });
  }

  // Initialize language
  var initialLang = getLang();
  setLang(initialLang);

  // Bind toggle buttons (each page has its own)
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('#lang-toggle');
    if (!toggle) return;
    var current = getLang();
    setLang(current === 'en' ? 'sw' : 'en');
  });


  // ---- Mobile Nav Toggle ----
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('nav__links--open');
      navToggle.classList.toggle('nav__toggle--open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('nav__links--open');
        navToggle.classList.remove('nav__toggle--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ---- Nav Scroll Effect ----
  var nav = document.getElementById('main-nav');
  if (nav) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY > 40) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }


  // ---- Wave Divider Draw-on Animation ----
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    var waveDividers = document.querySelectorAll('.wave-divider');

    if (waveDividers.length > 0 && 'IntersectionObserver' in window) {
      var waveObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            waveObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      });

      waveDividers.forEach(function (svg) {
        waveObserver.observe(svg);
      });
    } else {
      // Fallback: show all immediately
      waveDividers.forEach(function (svg) {
        svg.classList.add('is-visible');
      });
    }
  } else {
    // Reduced motion: show all immediately, no animation
    document.querySelectorAll('.wave-divider').forEach(function (svg) {
      svg.classList.add('is-visible');
    });
  }

})();
