/**
 * Home — searchable, filterable effects index.
 * Renders window.EFFECTS_INDEX as a numbered type-led list.
 */
(function () {
  'use strict';

  var CAT_LABELS = {
    typography: 'Typography',
    scroll: 'Scroll',
    gallery: 'Gallery',
    cursor: 'Cursor',
    layout: 'Layout'
  };

  var state = { query: '', cat: 'all' };

  var list = document.getElementById('fxGrid');
  var searchInput = document.getElementById('searchInput');
  var resultsMeta = document.getElementById('resultsMeta');
  var filterBar = document.getElementById('filterBar');

  if (!list || !window.EFFECTS_INDEX) return;

  var effects = window.EFFECTS_INDEX;

  function normalize(str) {
    return (str || '').toLowerCase();
  }

  function matchesQuery(effect, q) {
    if (!q) return true;
    var hay = [
      effect.name,
      effect.id,
      effect.cat,
      effect.desc,
      (effect.tags || []).join(' ')
    ].join(' ').toLowerCase();
    return q.split(/\s+/).every(function (term) {
      return term && hay.indexOf(term) !== -1;
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Wrap query matches in <mark> for the row name
  function emphasize(name, q) {
    var safe = escapeHtml(name);
    if (!q) return safe;
    var terms = q.split(/\s+/).filter(Boolean);
    terms.forEach(function (term) {
      var re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      safe = safe.replace(re, '<mark>$1</mark>');
    });
    return safe;
  }

  function renderFilters() {
    var counts = { all: effects.length };
    effects.forEach(function (e) {
      counts[e.cat] = (counts[e.cat] || 0) + 1;
    });

    var cats = ['all', 'typography', 'scroll', 'gallery', 'cursor', 'layout'];
    filterBar.innerHTML = cats.map(function (cat) {
      var label = cat === 'all' ? 'All' : CAT_LABELS[cat];
      var active = state.cat === cat ? ' active' : '';
      return '<button type="button" class="filter-btn' + active + '" data-cat="' + cat + '">' +
        label + '<span class="count">' + counts[cat] + '</span></button>';
    }).join('');

    filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.cat = btn.dataset.cat;
        renderFilters();
        renderList();
      });
    });
  }

  function renderList() {
    var q = normalize(state.query.trim());
    var filtered = effects.filter(function (e) {
      return (state.cat === 'all' || e.cat === state.cat) && matchesQuery(e, q);
    });

    resultsMeta.textContent = filtered.length === effects.length
      ? effects.length + ' effects'
      : filtered.length + ' of ' + effects.length;

    if (!filtered.length) {
      list.innerHTML =
        '<div class="fx-empty">' +
        '<h2>Nothing matches &ldquo;' + escapeHtml(state.query.trim()) + '&rdquo;</h2>' +
        '<p>Try another term, or clear the category filter.</p>' +
        '</div>';
      return;
    }

    list.innerHTML = filtered.map(function (e, i) {
      var href = e.page + '#' + e.id;
      var num = String(i + 1).padStart(3, '0');
      var desc = e.desc || '';
      return '<a class="fx-row" href="' + href + '" data-cat="' + e.cat + '">' +
        '<span class="fx-num">' + num + '</span>' +
        '<span class="fx-row-name">' + emphasize(e.name, q) + '</span>' +
        '<span class="fx-row-desc">' + escapeHtml(desc) + '</span>' +
        '<span class="fx-row-cat">' + CAT_LABELS[e.cat] + '</span>' +
        '<svg class="fx-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
        '</a>';
    }).join('');
  }

  var debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      state.query = searchInput.value;
      renderList();
    }, 120);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  // Restore state from URL, e.g. ?cat=scroll&q=fade
  var params = new URLSearchParams(location.search);
  if (params.get('cat') && CAT_LABELS[params.get('cat')]) {
    state.cat = params.get('cat');
  }
  if (params.get('q')) {
    state.query = params.get('q');
    searchInput.value = state.query;
  }

  renderFilters();
  renderList();
})();
