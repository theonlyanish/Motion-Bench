/**
 * Generates one standalone landing page per effect at <cat>/<slug>.html
 * (served by Vercel as /<cat>/<slug> via cleanUrls).
 *
 *   node scripts/build-effect-pages.js
 *
 * These pages are additive: the category pages and the home index are the
 * browsing experience and are untouched. Each effect page carries the live demo
 * (the snippet running in an isolated iframe), the description, the code
 * visible by default, related effects, and a link back to the category page.
 *
 * Sources: effects-index.js (names, descriptions), snippets/*.js (code).
 * Re-run after either changes. Also rewrites sitemap.xml.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const SITE = 'https://motion-bench.vercel.app/';
const AUTHOR_ID = 'https://anishkapse.com/#person';
const REPO = 'https://github.com/theonlyanish/Motion-Bench';

// ── Last-modified dates ───────────────────────────────────────────────────────
// All 145 effect pages regenerate together, so git dates would all be the same.
// Instead each URL's date is driven by its content: hash the page, keep the hash
// and date in scripts/page-dates.json, and bump the date only when the hash
// changes. A URL seen for the first time is seeded from the file's last git
// commit so the initial sitemap isn't 150 copies of today.
const DATES_FILE = path.join(__dirname, 'page-dates.json');
const dates = fs.existsSync(DATES_FILE) ? JSON.parse(fs.readFileSync(DATES_FILE, 'utf8')) : {};
const TODAY = new Date().toISOString().slice(0, 10);

function gitDate(file) {
  try {
    const out = execSync('git log -1 --format=%cs -- "' + file + '"', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch (e) { return null; }
}

// --rehash: refresh stored hashes without moving any date. Use it when the page
// template changes in a way readers wouldn't call a content change (head tags,
// schema, markup tidy-ups) so the sitemap doesn't claim 150 pages changed today.
const REHASH = process.argv.includes('--rehash');

function lastmod(url, content, file) {
  // Hash the body only: head changes (og tags, schema) aren't content changes.
  const bodyAt = content.indexOf('<body');
  const hash = crypto.createHash('sha1').update(bodyAt === -1 ? content : content.slice(bodyAt)).digest('hex');
  const prev = dates[url];
  let date;
  if (prev && (prev.hash === hash || REHASH)) date = prev.date; // unchanged (or rehash)
  else if (prev) date = TODAY;                                  // changed
  else date = gitDate(file) || TODAY;                           // first sighting
  dates[url] = { hash: hash, date: date };
  return date;
}

const CATS = {
  typography: { label: 'Typography', plural: 'Typography Effects', page: 'typography', snippets: 'snippets/typography.js', color: 'var(--cat-typography)' },
  scroll: { label: 'Scroll', plural: 'Scroll Animations', page: 'scroll', snippets: 'snippets/scroll.js', color: 'var(--cat-scroll)' },
  gallery: { label: 'Gallery', plural: 'Gallery Effects', page: 'gallery', snippets: 'snippets/gallery.js', color: 'var(--cat-gallery)' },
  cursor: { label: 'Cursor', plural: 'Cursor & Pointer Effects', page: 'cursor', snippets: 'snippets/cursor.js', color: 'var(--cat-cursor)' },
  layout: { label: 'Layout', plural: 'Reveal & Layout Patterns', page: 'layout', snippets: 'snippets/layout.js', color: 'var(--cat-layout)' }
};

// Snippets whose demo only makes sense while scrolling a long page.
const SCRUB = new Set(['parallax', 'colorMorph', 'velocitySkew', 'textFillScrub', 'zoomThrough', 'stickyStack', 'letterScrub']);

function runInWindow(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return sandbox.window;
}

function slugify(id) {
  return id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Attribute-safe: srcdoc goes inside a double-quoted attribute.
function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

const NAV = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/<nav class="nav-bar"[\s\S]*?<\/nav>/)[0]
  .replace(' is-active', '').replace(' aria-current="page"', '');

function demoDoc(snippet) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Roboto+Flex:opsz,slnt,wdth,wght@8..144,-10..0,25..151,100..1000&display=swap" rel="stylesheet">' +
    '<style>' +
    ':root{--bg-dark:#0d0d0f;--bg-panel:#16161a;--border-subtle:rgba(255,255,255,.08);--border-strong:rgba(255,255,255,.15);' +
    '--text-primary:#f3f3f5;--text-secondary:#b5b5bd;--text-muted:#7c7c86;--accent:#7c5cff;--cat:#a897e6;--radius:12px;--dur:.7s;--ease-out:cubic-bezier(.16,1,.3,1)}' +
    '*{box-sizing:border-box}html,body{margin:0;min-height:100%}' +
    'body{background:#0d0d0f;color:#f3f3f5;font-family:Geist,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:2rem;gap:1rem;overflow-x:hidden}' +
    'img{max-width:100%}' +
    '</style><style>' + (snippet.css || '') + '</style></head><body>' +
    (snippet.html || '') +
    '<script>' + (snippet.js || '').replace(/<\/script/gi, '<\\/script') + '</script>' +
    '</body></html>';
}

function codeBlock(lang, label, code) {
  return '      <section class="fx-code" aria-labelledby="code-' + lang + '">\n' +
    '        <div class="fx-code-bar"><h3 id="code-' + lang + '">' + label + '</h3>' +
    '<button type="button" class="fx-copy" data-copy="' + lang + '">Copy</button></div>\n' +
    '        <pre><code class="language-' + lang + '">' + esc(code.trim()) + '</code></pre>\n' +
    '      </section>';
}

function schema(e, cat, url, snippet) {
  const author = { '@type': 'Person', '@id': AUTHOR_ID, name: 'Anish Kapse', url: 'https://anishkapse.com/' };
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        // The page as an article: gives crawlers a dateModified that matches the
        // sitemap lastmod. (HowTo was considered and skipped: Google retired
        // HowTo rich results in 2023.)
        '@type': 'TechArticle',
        '@id': url + '#article',
        headline: e.name + ' — ' + cat.label + ' effect in HTML, CSS and JavaScript',
        description: e.desc,
        url: url,
        mainEntityOfPage: url,
        about: { '@id': url },
        dateModified: '__LASTMOD__',
        inLanguage: 'en',
        proficiencyLevel: 'Beginner',
        dependencies: 'None — plain HTML, CSS and JavaScript',
        isPartOf: { '@id': SITE + '#website' },
        author: author
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': url,
        url: url,
        name: e.name + ' — ' + cat.label + ' effect',
        description: e.desc,
        dateModified: '__LASTMOD__',
        programmingLanguage: ['html', 'css', 'js'].filter(function (l) { return snippet[l]; }).map(function (l) { return ({ html: 'HTML', css: 'CSS', js: 'JavaScript' })[l]; }),
        codeSampleType: 'full',
        runtimePlatform: 'Web browser',
        license: 'https://opensource.org/licenses/MIT',
        codeRepository: REPO,
        isPartOf: { '@id': SITE + cat.page },
        author: author,
        keywords: e.tags.join(', ')
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Motion Bench', item: SITE },
          { '@type': 'ListItem', position: 2, name: cat.plural, item: SITE + cat.page },
          { '@type': 'ListItem', position: 3, name: e.name, item: url }
        ]
      }
    ]
  }).replace(/</g, '\\u003c');
}

function page(e, cat, snippet, siblings) {
  const slug = slugify(e.id);
  const relPath = cat.page + '/' + slug;
  const url = SITE + relPath;
  // Per-effect social card rendered by tools/og-images.ps1; fall back to the site image.
  const ogFile = 'og/' + cat.page + '-' + slug + '.png';
  const ogImg = fs.existsSync(path.join(root, ogFile)) ? SITE + ogFile : SITE + 'og-image.png';
  const title = e.name + ' — ' + cat.label + ' Effect in CSS & JS | Motion Bench';
  const desc = e.desc + ' Copy-paste HTML, CSS and JavaScript, no dependencies.';
  const langs = ['html', 'css', 'js'].filter(function (l) { return snippet[l]; });
  const idx = siblings.findIndex(function (s) { return s.id === e.id; });
  const related = [];
  for (let k = 1; related.length < 4 && k < siblings.length; k++) {
    related.push(siblings[(idx + k) % siblings.length]);
  }
  const scrub = SCRUB.has(e.id);

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <title>' + esc(title) + '</title>\n' +
    '  <meta name="description" content="' + esc(desc) + '">\n' +
    '  <link rel="canonical" href="' + url + '">\n' +
    '  <meta name="theme-color" content="#0d0d0f">\n' +
    '  <meta property="og:type" content="article">\n' +
    '  <meta property="og:site_name" content="Motion Bench">\n' +
    '  <meta property="og:title" content="' + esc(e.name + ' — ' + cat.label + ' Effect') + '">\n' +
    '  <meta property="og:description" content="' + esc(e.desc) + '">\n' +
    '  <meta property="og:url" content="' + url + '">\n' +
    '  <meta property="og:image" content="' + ogImg + '">\n' +
    '  <meta property="og:image:type" content="image/png">\n' +
    '  <meta property="og:image:width" content="1200">\n' +
    '  <meta property="og:image:height" content="630">\n' +
    '  <meta name="twitter:card" content="summary_large_image">\n' +
    '  <meta name="twitter:title" content="' + esc(e.name + ' — ' + cat.label + ' Effect') + '">\n' +
    '  <meta name="twitter:description" content="' + esc(e.desc) + '">\n' +
    '  <meta name="twitter:image" content="' + ogImg + '">\n' +
    '  <script type="application/ld+json" id="ld-schema">' + schema(e, cat, url, snippet) + '</script>\n' +
    '  <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">\n' +
    '  <link rel="icon" href="/favicon-32x32.png?v=2" type="image/png" sizes="32x32">\n' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&display=swap" rel="stylesheet">\n' +
    '  <link rel="stylesheet" href="/home.css">\n' +
    '  <link rel="stylesheet" href="/nav-tooltips.css">\n' +
    '  <link rel="stylesheet" href="/transitions.css">\n' +
    '  <link rel="stylesheet" href="/effect.css">\n' +
    '</head>\n<body class="is-loaded fx-page" data-cat="' + e.cat + '">\n' +
    '  <div class="transition-overlay"></div>\n\n' +
    NAV.replace(/\n/g, '\n').replace(/^/gm, '  ').trimStart().replace(/^/, '  ') + '\n\n' +
    '  <main class="fx-single wrap">\n' +
    '    <nav class="fx-crumbs" aria-label="Breadcrumb">\n' +
    '      <a href="/">Motion Bench</a><span aria-hidden="true">/</span>' +
    '<a href="/' + cat.page + '">' + esc(cat.plural) + '</a><span aria-hidden="true">/</span>' +
    '<span aria-current="page">' + esc(e.name) + '</span>\n' +
    '    </nav>\n\n' +
    '    <header class="fx-head">\n' +
    '      <p class="fx-eyebrow">' + esc(cat.label) + ' · ' + String(idx + 1).padStart(2, '0') + ' of ' + siblings.length + '</p>\n' +
    '      <h1>' + esc(e.name) + '</h1>\n' +
    '      <p class="fx-lede">' + esc(e.desc) + '</p>\n' +
    '      <p class="fx-meta">' + langs.map(function (l) { return ({ html: 'HTML', css: 'CSS', js: 'JavaScript' })[l]; }).join(' · ') + ' · No dependencies · MIT</p>\n' +
    '    </header>\n\n' +
    '    <section class="fx-demo" aria-label="Live demo">\n' +
    '      <iframe class="fx-frame" title="' + esc(e.name) + ' live demo" loading="lazy" sandbox="allow-scripts" srcdoc="' + escAttr(demoDoc(snippet)) + '"></iframe>\n' +
    (scrub ? '      <p class="fx-demo-note">This one is driven by scroll position, so it reads best in context. <a href="/' + cat.page + '#' + e.id + '">See it on the ' + esc(cat.label.toLowerCase()) + ' page</a>.</p>\n' : '') +
    '    </section>\n\n' +
    '    <div class="fx-codes">\n' +
    langs.map(function (l) { return codeBlock(l, ({ html: 'HTML', css: 'CSS', js: 'JavaScript' })[l], snippet[l]); }).join('\n') + '\n' +
    '    </div>\n\n' +
    '    <section class="fx-related" aria-labelledby="related-h">\n' +
    '      <h2 id="related-h">More ' + esc(cat.label.toLowerCase()) + ' effects</h2>\n' +
    '      <ul>\n' +
    related.map(function (r) {
      return '        <li><a href="/' + cat.page + '/' + slugify(r.id) + '"><span class="fx-rel-name">' + esc(r.name) + '</span><span class="fx-rel-desc">' + esc(r.desc) + '</span></a></li>';
    }).join('\n') + '\n' +
    '      </ul>\n' +
    '      <a class="fx-all" href="/' + cat.page + '#' + e.id + '">Browse all ' + siblings.length + ' ' + esc(cat.plural.toLowerCase()) + ' <span aria-hidden="true">&rarr;</span></a>\n' +
    '    </section>\n' +
    '  </main>\n\n' +
    '  <footer class="home-footer">\n' +
    '    <div class="wrap">\n' +
    '      <p>Pure HTML · CSS · JavaScript — every effect includes copyable standalone code</p>\n' +
    '      <p class="home-credit">Motion Bench by <a href="https://anishkapse.com/" target="_blank" rel="noopener noreferrer">Anish Kapse</a></p>\n' +
    '    </div>\n' +
    '  </footer>\n\n' +
    '  <script src="/a11y.js"></script>\n' +
    '  <script src="/transitions.js"></script>\n' +
    '  <script src="/effect.js"></script>\n' +
    '  <script defer src="/_vercel/insights/script.js"></script>\n' +
    '</body>\n</html>\n';
}

const index = runInWindow('effects-index.js').EFFECTS_INDEX;
const urls = [];
let count = 0;

Object.keys(CATS).forEach(function (catKey) {
  const cat = CATS[catKey];
  const snippets = runInWindow(cat.snippets).EFFECT_SNIPPETS;
  const siblings = index.filter(function (e) { return e.cat === catKey; });
  const dir = path.join(root, cat.page);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  siblings.forEach(function (e) {
    const snippet = snippets[e.id];
    if (!snippet) { console.warn('no snippet for', e.id); return; }
    const rel = cat.page + '/' + slugify(e.id);
    const url = SITE + rel;
    const html = page(e, cat, snippet, siblings); // carries the __LASTMOD__ token
    const date = lastmod(url, html, rel + '.html');
    fs.writeFileSync(path.join(dir, slugify(e.id) + '.html'), html.split('__LASTMOD__').join(date));
    urls.push({ url: url, date: date });
    count++;
  });
});

// Sitemap: home, categories, then every effect page — each with a lastmod.
// Home and category pages are hashed from the files on disk (run after
// build-code-blocks / build-schema so their generated parts are current).
function entry(loc, date, priority) {
  return '  <url><loc>' + loc + '</loc><lastmod>' + date + '</lastmod><priority>' + priority + '</priority></url>';
}
const homeDate = lastmod(SITE, fs.readFileSync(path.join(root, 'index.html'), 'utf8'), 'index.html');
const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', entry(SITE, homeDate, '1.0')]
  .concat(Object.keys(CATS).map(function (k) {
    const c = CATS[k];
    const d = lastmod(SITE + c.page, fs.readFileSync(path.join(root, c.page + '.html'), 'utf8'), c.page + '.html');
    return entry(SITE + c.page, d, '0.8');
  }))
  .concat(urls.map(function (u) { return entry(u.url, u.date, '0.6'); }))
  .concat(['</urlset>', '']).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);

const sorted = {};
Object.keys(dates).sort().forEach(function (k) { sorted[k] = dates[k]; });
fs.writeFileSync(DATES_FILE, JSON.stringify(sorted, null, 2) + '\n');

console.log('Wrote ' + count + ' effect pages and sitemap.xml with ' + (urls.length + 6) + ' URLs');
