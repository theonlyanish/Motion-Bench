/**
 * Code Panel — shared "view code" component.
 *
 * Injects a collapsible HTML/CSS/JS code viewer with a copy button into every
 * effect section (matched by its data-fx, data-panel, or data-anim attribute).
 *
 * The code comes from the hidden <div class="code-source"> that
 * scripts/build-code-blocks.js pre-renders into each section from snippets/*.js,
 * so the snippets are real, crawlable HTML. window.EFFECT_SNIPPETS is still
 * honoured as a fallback for pages that load a snippets file directly.
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
    // Toggle and permalink share one flex row so they centre against each other.
    var actions = document.createElement('div');
    actions.className = 'code-actions';
    actions.appendChild(toggle);
    if (snippet.permalink) actions.appendChild(buildPermalink(snippet.permalink));
    panel.appendChild(actions);
    panel.appendChild(view);

    select(active);
    return panel;
  }

  // Preferred source: the <div class="code-source"> that scripts/build-code-blocks.js
  // pre-renders into each section, so the code is real HTML that crawlers can read.
  // The div is consumed (removed) once its text has been lifted into the panel.
  function snippetFromDOM(section) {
    var source = section.querySelector(':scope > .code-source');
    if (!source) return null;
    var snippet = {};
    var pres = source.querySelectorAll('pre[data-lang]');
    for (var i = 0; i < pres.length; i++) {
      snippet[pres[i].getAttribute('data-lang')] = pres[i].textContent;
    }
    if (source.dataset.permalink) snippet.permalink = source.dataset.permalink;
    source.parentNode.removeChild(source);
    return snippet;
  }

  var ICON_LINK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

  // Quiet icon-only link to the effect's standalone page. Sits beside the toggle.
  function buildPermalink(href) {
    var a = document.createElement('a');
    a.className = 'code-permalink';
    a.href = href;
    a.title = 'Open this effect on its own page';
    a.setAttribute('aria-label', 'Open this effect on its own page');
    a.innerHTML = ICON_LINK;
    return a;
  }

  function init() {
    // Fallback registry for pages that still load snippets/*.js directly.
    var registry = window.EFFECT_SNIPPETS || {};

    var sections = document.querySelectorAll('[data-fx], [data-panel], [data-anim]');
    sections.forEach(function (section) {
      var key = section.dataset.fx || section.dataset.panel || section.dataset.anim;
      var snippet = snippetFromDOM(section) || registry[key];
      if (!snippet) return;
      var panel = buildPanel(snippet);
      if (!panel) return;
      // If the page built a shared controls row (scroll.js does), mount into it so
      // the toggle sits alongside the other controls instead of on its own line.
      var mount = section.querySelector('.block-actions') || section;
      mount.appendChild(panel);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
