/**
 * F1rstSports — Main JavaScript
 * Mobile menu, utilities, and shared functionality.
 */
(function () {
  'use strict';

  /* ========== MOBILE MENU ========== */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('open', !isOpen);
      if (overlay) overlay.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeMenu() {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }

  /* ========== HEADER SCROLL EFFECT ========== */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ========== SMOOTH SCROLL ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ========== LAZY LOAD IMAGES ========== */
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) return;
    var images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src || img.src;
            observer.unobserve(img);
          }
        });
      });
      images.forEach(function (img) { observer.observe(img); });
    }
  }

  /* ========== INIT ========== */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initLazyImages();
  });
})();
