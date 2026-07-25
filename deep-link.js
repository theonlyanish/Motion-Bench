/**
 * Scroll to a specific effect when the URL contains a hash (#effectId).
 * Works with data-panel, data-anim, and data-fx keys on section elements.
 */
(function () {
  'use strict';

  function highlight(el) {
    el.classList.add('fx-highlight');
    setTimeout(function () { el.classList.remove('fx-highlight'); }, 2200);
  }

  function scrollToHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.querySelector(
      '[data-panel="' + id + '"], [data-anim="' + id + '"], [data-fx="' + id + '"]'
    );
    if (!el) return;
    requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlight(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scrollToHash);
  } else {
    scrollToHash();
  }
  window.addEventListener('hashchange', scrollToHash);
})();
