/**
 * Code Panel — shared "view code" component.
 *
 * Reads window.EFFECT_SNIPPETS (a registry defined by the page's snippets/*.js
 * file) and injects a collapsible HTML/CSS/JS code viewer with a copy button
 * into every effect section.
 *
 * A section is matched to a snippet by its data-fx, data-panel, or data-anim
 * attribute.
 */
(function () {
  'use strict';

  var ICON_CODE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
  var ICON_CHEVRON =
    '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  var ICON_COPY =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  var TAB_ORDER = ['html', 'css', 'js'];
  var TAB_LABELS = { html: 'HTML', css: 'CSS', js: 'JS' };

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone, function () {
        fallbackCopy(text);
        onDone();
      });
    } else {
      fallbackCopy(text);
      onDone();
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function buildPanel(snippet) {
    var langs = TAB_ORDER.filter(function (k) { return snippet[k]; });
    if (!langs.length) return null;

    var panel = document.createElement('div');
    panel.className = 'code-panel';

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'code-toggle';
    toggle.innerHTML = ICON_CODE + '<span>View code</span>' + ICON_CHEVRON;

    var view = document.createElement('div');
    view.className = 'code-view';
    view.hidden = true;

    var bar = document.createElement('div');
    bar.className = 'code-view-bar';

    var tabsWrap = document.createElement('div');
    tabsWrap.className = 'code-tabs';

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'code-copy';
    copyBtn.innerHTML = ICON_COPY + '<span>Copy</span>';

    var pre = document.createElement('pre');
    pre.className = 'code-pre';
    var codeEl = document.createElement('code');
    pre.appendChild(codeEl);

    var active = langs[0];
    var tabBtns = {};

    function select(lang) {
      active = lang;
      langs.forEach(function (k) {
        tabBtns[k].classList.toggle('active', k === lang);
      });
      codeEl.textContent = snippet[lang];
      pre.scrollTop = 0;
      pre.scrollLeft = 0;
    }

    langs.forEach(function (lang) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-tab';
      btn.textContent = TAB_LABELS[lang];
      btn.addEventListener('click', function () { select(lang); });
      tabBtns[lang] = btn;
      tabsWrap.appendChild(btn);
    });

    var copyTimer = null;
    copyBtn.addEventListener('click', function () {
      copyText(snippet[active], function () {
        copyBtn.classList.add('copied');
        copyBtn.querySelector('span').textContent = 'Copied!';
        clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('span').textContent = 'Copy';
        }, 1600);
      });
    });

    toggle.addEventListener('click', function () {
      var opening = view.hidden;
      view.hidden = !opening;
      panel.classList.toggle('open', opening);
    });

    bar.appendChild(tabsWrap);
    bar.appendChild(copyBtn);
    view.appendChild(bar);
    view.appendChild(pre);
    panel.appendChild(toggle);
    panel.appendChild(view);

    select(active);
    return panel;
  }

  function init() {
    var registry = window.EFFECT_SNIPPETS;
    if (!registry) return;

    var sections = document.querySelectorAll('[data-fx], [data-panel], [data-anim]');
    sections.forEach(function (section) {
      var key = section.dataset.fx || section.dataset.panel || section.dataset.anim;
      var snippet = registry[key];
      if (!snippet) return;
      var panel = buildPanel(snippet);
      if (panel) section.appendChild(panel);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
