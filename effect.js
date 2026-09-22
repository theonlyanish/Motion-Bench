/**
 * Effect page — copy buttons for the visible code blocks.
 */
(function () {
  'use strict';

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone, function () { fallback(text); onDone(); });
    } else {
      fallback(text);
      onDone();
    }
  }

  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.fx-copy').forEach(function (btn) {
    var timer = null;
    btn.addEventListener('click', function () {
      var code = btn.closest('.fx-code').querySelector('code');
      copyText(code.textContent, function () {
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.classList.remove('copied');
          btn.textContent = 'Copy';
        }, 1600);
      });
    });
  });
})();
