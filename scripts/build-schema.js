/**
 * Generates JSON-LD structured data for every page from effects-index.js
 * and writes it into the <head> of each HTML file.
 *
 *   node scripts/build-schema.js
 *
 * Re-run after adding effects (run build-effects-index.js first).
 * Each page gets one <script type="application/ld+json" id="ld-schema">
 * block; an existing block with that id is replaced in place.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const SITE = 'https://motion-bench.vercel.app/';
const SITE_ID = SITE + '#website';
const AUTHOR_ID = 'https://anishkapse.com/#person';

const author = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: 'Anish Kapse',
  url: 'https://anishkapse.com/'
};

const website = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  name: 'Motion Bench',
  url: SITE,
  description:
    'A searchable library of copy-paste animation effects — typography, scroll, gallery, cursor, and layout. Pure HTML, CSS, and JavaScript.',
  inLanguage: 'en',
  author: { '@id': AUTHOR_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: SITE + '?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

const categories = [
  { cat: 'typography', page: 'typography.html', name: 'Typography Effects' },
  { cat: 'scroll', page: 'scroll.html', name: 'Scroll Animations' },
  { cat: 'gallery', page: 'gallery.html', name: 'Gallery Effects' },
  { cat: 'cursor', page: 'cursor.html', name: 'Cursor & Pointer Effects' },
  { cat: 'layout', page: 'layout.html', name: 'Reveal & Layout Patterns' }
];

// Load effects-index.js by evaluating it against a stub window.
function loadIndex() {
  const src = fs.readFileSync(path.join(root, 'effects-index.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.EFFECTS_INDEX;
}

function readHead(html) {
  const get = function (re) {
    const m = html.match(re);
    return m ? m[1].trim() : '';
  };
  return {
    title: get(/<title>([^<]+)<\/title>/),
    description: get(/<meta name="description" content="([^"]+)"/)
  };
}

function breadcrumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(function (it, i) {
      return { '@type': 'ListItem', position: i + 1, name: it.name, item: it.url };
    })
  };
}

function effectNode(e) {
  const url = SITE + e.page + '#' + e.id;
  const node = {
    '@type': 'SoftwareSourceCode',
    '@id': url,
    name: e.name,
    url: url,
    programmingLanguage: ['HTML', 'CSS', 'JavaScript'],
    codeSampleType: 'full',
    runtimePlatform: 'Web browser',
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: 'https://github.com/theonlyanish/frontend-reference',
    isPartOf: { '@id': SITE + e.page },
    author: { '@id': AUTHOR_ID },
    keywords: e.tags.join(', ')
  };
  if (e.desc) node.description = e.desc;
  return node;
}

function categorySchema(c, effects, head) {
  const pageUrl = SITE + c.page;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      author,
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        url: pageUrl,
        name: head.title || c.name,
        description: head.description,
        inLanguage: 'en',
        isPartOf: { '@id': SITE_ID },
        author: { '@id': AUTHOR_ID },
        mainEntity: { '@id': pageUrl + '#list' }
      },
      breadcrumbs([
        { name: 'Motion Bench', url: SITE },
        { name: c.name, url: pageUrl }
      ]),
      {
        '@type': 'ItemList',
        '@id': pageUrl + '#list',
        name: c.name,
        numberOfItems: effects.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: effects.map(function (e, i) {
          return { '@type': 'ListItem', position: i + 1, item: effectNode(e) };
        })
      }
    ]
  };
}

function homeSchema(index, head) {
  const byCat = {};
  index.forEach(function (e) {
    byCat[e.cat] = (byCat[e.cat] || 0) + 1;
  });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      Object.assign({}, website, { description: head.description || website.description }),
      author,
      {
        '@type': 'CollectionPage',
        '@id': SITE + '#home',
        url: SITE,
        name: head.title || 'Motion Bench',
        description: head.description,
        inLanguage: 'en',
        isPartOf: { '@id': SITE_ID },
        author: { '@id': AUTHOR_ID },
        mainEntity: { '@id': SITE + '#categories' }
      },
      {
        '@type': 'ItemList',
        '@id': SITE + '#categories',
        name: 'Effect categories',
        numberOfItems: categories.length,
        itemListElement: categories.map(function (c, i) {
          return {
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'CollectionPage',
              '@id': SITE + c.page,
              url: SITE + c.page,
              name: c.name,
              description: (byCat[c.cat] || 0) + ' copy-paste ' + c.name.toLowerCase() + ' in HTML, CSS, and JavaScript.'
            }
          };
        })
      }
    ]
  };
}

function inject(file, schema) {
  const p = path.join(root, file);
  let html = fs.readFileSync(p, 'utf8');
  // Compact JSON keeps the head light (~23KB for a 33-effect page).
  const json = JSON.stringify(schema).replace(/</g, '\\u003c'); // never let "</script>" out of the JSON
  const block = '<script type="application/ld+json" id="ld-schema">' + json + '</script>';

  const existingById = /<script type="application\/ld\+json" id="ld-schema">[\s\S]*?<\/script>/;
  const anyLd = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;

  if (existingById.test(html)) {
    html = html.replace(existingById, block);
  } else if (anyLd.test(html)) {
    html = html.replace(anyLd, block);
  } else {
    html = html.replace(/\n<\/head>/, '\n  ' + block + '\n</head>');
  }
  fs.writeFileSync(p, html);
}

const index = loadIndex();

categories.forEach(function (c) {
  const effects = index.filter(function (e) { return e.cat === c.cat; });
  const head = readHead(fs.readFileSync(path.join(root, c.page), 'utf8'));
  inject(c.page, categorySchema(c, effects, head));
  console.log(c.page + ': ' + effects.length + ' effects');
});

inject('index.html', homeSchema(index, readHead(fs.readFileSync(path.join(root, 'index.html'), 'utf8'))));
console.log('index.html: ' + categories.length + ' categories');
