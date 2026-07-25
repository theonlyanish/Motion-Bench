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

/**
 * Touch → mouse bridge.
 * On touch devices, translate finger gestures into the mouse events the
 * effects already listen for (mousemove / mouseenter / mouseleave), targeting
 * whatever element is under the finger. This lets pointer-driven effects
 * (magnetic, repel, blur, 3D tilt, colour chase, shadow chase, spotlight, and
 * most gallery/cursor hover effects) respond to touch with no per-effect code.
 * Effects that need a truly fine pointer are additionally flagged desktop-only
 * in CSS; this just makes the rest usable.
 */
(function () {
  'use strict';
  if (!(window.A11Y && window.A11Y.touch)) return;

  var overEl = null;

  function synth(type, x, y, bubbles) {
    var el = document.elementFromPoint(x, y);
    if (!el) return null;
    try {
      el.dispatchEvent(new MouseEvent(type, {
        clientX: x, clientY: y, bubbles: bubbles !== false, cancelable: true, view: window
      }));
    } catch (e) { /* older engines: ignore */ }
    return el;
  }

  function enterLeave(x, y) {
    var el = document.elementFromPoint(x, y);
    if (el === overEl) return;
    if (overEl) {
      overEl.dispatchEvent(new MouseEvent('mouseout', { clientX: x, clientY: y, bubbles: true, view: window }));
      overEl.dispatchEvent(new MouseEvent('mouseleave', { clientX: x, clientY: y, bubbles: false, view: window }));
    }
    if (el) {
      el.dispatchEvent(new MouseEvent('mouseover', { clientX: x, clientY: y, bubbles: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter', { clientX: x, clientY: y, bubbles: false, view: window }));
    }
    overEl = el;
  }

  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; if (!t) return;
    enterLeave(t.clientX, t.clientY);
    synth('mousemove', t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0]; if (!t) return;
    enterLeave(t.clientX, t.clientY);
    synth('mousemove', t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0];
    if (overEl && t) {
      overEl.dispatchEvent(new MouseEvent('mouseout', { clientX: t.clientX, clientY: t.clientY, bubbles: true, view: window }));
      overEl.dispatchEvent(new MouseEvent('mouseleave', { clientX: t.clientX, clientY: t.clientY, bubbles: false, view: window }));
    }
    overEl = null;
  }, { passive: true });
})();
