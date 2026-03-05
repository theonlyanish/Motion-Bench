/**
 * Smooth Scroll (Lenis) and Page Transitions
 * Requires lenis.js or lenis-min.js
 */

(function () {
  'use strict';

  // 1. Lenis Smooth Scroll
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.1,
      infinite: false,
      smooth: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 2. Page Transitions
  const overlay = document.querySelector('.transition-overlay');

  // Fade in content on load
  window.addEventListener('pageshow', (event) => {
    // If coming from back/forward cache, ensure overlay is hidden
    if (event.persisted) {
      overlay.classList.remove('is-active');
    }
  });

  // Intercept link clicks
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (
        link.target === '_blank' ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href === '#' ||
        href === ''
      ) return;

      e.preventDefault();

      // Trigger exit animation
      overlay.style.transformOrigin = 'bottom';
      overlay.classList.add('is-active');

      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
})();
