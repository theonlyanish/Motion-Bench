/**
 * Shared accessibility flags — reduced-motion + touch detection.
 * Loaded first on every page. Exposes window.A11Y = { reduced, touch }
 * and mirrors both onto <html> as .reduce-motion / .is-touch so CSS can hook in.
 * Effect scripts read window.A11Y.reduced to skip continuous autoplay loops.
 */
(function () {
  'use strict';

  var motionMQ = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  function detectTouch() {
    return ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }

  var A11Y = {
    reduced: !!motionMQ.matches,
    touch: !!detectTouch()
  };
  window.A11Y = A11Y;

  function apply() {
    var root = document.documentElement;
    if (!root) return;
    root.classList.toggle('reduce-motion', A11Y.reduced);
    root.classList.toggle('is-touch', A11Y.touch);
  }

  apply(); // reflect as early as possible

  function onMotionChange() {
    A11Y.reduced = !!motionMQ.matches;
    apply();
  }
  if (motionMQ.addEventListener) motionMQ.addEventListener('change', onMotionChange);
  else if (motionMQ.addListener) motionMQ.addListener(onMotionChange);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  }
})();
