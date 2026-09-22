/**
 * Pre-renders every effect's copy-paste snippet into its page as real HTML so
 * the code is crawlable text rather than a string inside snippets/*.js.
 *
 *   node scripts/build-code-blocks.js
 *
 * For each <section data-panel|data-anim|data-fx="key"> it appends:
 *
 *   <!-- code-source:key -->
 *   <div class="code-source" hidden>
 *     <pre data-lang="html"><code>…</code></pre>
 *     <pre data-lang="css"><code>…</code></pre>
 *     <pre data-lang="js"><code>…</code></pre>
 *   </div>
 *   <!-- /code-source -->
 *
 * code-panel.js reads these at runtime to build the View code panel, so the
 * UI is unchanged. Re-run after editing anything in snippets/ — existing
 * blocks are replaced in place.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

const pages = [
  { file: 'typography.html', snippets: 'snippets/typography.js', attr: 'data-panel' },
  { file: 'scroll.html', snippets: 'snippets/scroll.js', attr: 'data-anim' },
  { file: 'gallery.html', snippets: 'snippets/gallery.js', attr: 'data-fx' },
  { file: 'cursor.html', snippets: 'snippets/cursor.js', attr: 'data-fx' },
  { file: 'layout.html', snippets: 'snippets/layout.js', attr: 'data-fx' }
];

const LANGS = ['html', 'css', 'js'];

function loadSnippets(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return sandbox.window.EFFECT_SNIPPETS || {};
}

// Escape for text content. Quotes are escaped too so a snippet containing
// e.g. data-fx="x" can never be mistaken for real markup by the index parser.
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBlock(key, snippet) {
  const pres = LANGS.filter(function (l) { return snippet[l]; }).map(function (l) {
    return '        <pre data-lang="' + l + '"><code>' + esc(snippet[l].trim()) + '</code></pre>';
  });
  if (!pres.length) return '';
  return [
    '      <!-- code-source:' + key + ' -->',
    '      <div class="code-source" hidden>',
    pres.join('\n'),
    '      </div>',
    '      <!-- /code-source -->'
  ].join('\n');
}

function stripExisting(html) {
  return html.replace(/\n[ \t]*<!-- code-source:[^ ]+ -->[\s\S]*?<!-- \/code-source -->/g, '');
}

let total = 0;
pages.forEach(function (p) {
  const file = path.join(root, p.file);
  const snippets = loadSnippets(p.snippets);
  let html = stripExisting(fs.readFileSync(file, 'utf8'));
  let count = 0;
  const missing = [];

  // Match each section by its key attribute, then find its own closing tag.
  const open = new RegExp('<section[^>]*\\s' + p.attr + '="([^"]+)"[^>]*>', 'g');
  let out = '';
  let last = 0;
  let m;
  while ((m = open.exec(html))) {
    const key = m[1];
    const closeIdx = html.indexOf('</section>', m.index);
    if (closeIdx === -1) break;
    // Walk back over trailing whitespace so the block lands before </section>
    // with the same indentation as the section's other children.
    let insertAt = closeIdx;
    while (insertAt > 0 && /[ \t\r\n]/.test(html[insertAt - 1])) insertAt--;
    const block = snippets[key] ? renderBlock(key, snippets[key]) : '';
    if (!block) missing.push(key);
    out += html.slice(last, insertAt) + (block ? '\n' + block : '');
    last = insertAt;
    if (block) count++;
    open.lastIndex = closeIdx;
  }
  out += html.slice(last);
  fs.writeFileSync(file, out);
  total += count;
  console.log(p.file + ': ' + count + ' code blocks' + (missing.length ? ' (no snippet for: ' + missing.join(', ') + ')' : ''));
});
console.log('Total: ' + total);
