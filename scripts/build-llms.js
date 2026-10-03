/**
 * Generates llms.txt and llms-full.txt (https://llmstxt.org) from effects-index.js.
 *
 *   node scripts/build-llms.js
 *
 * llms.txt      — what the site is, plus the category pages.
 * llms-full.txt — the same, plus every effect with its description and URL.
 *
 * Re-run after build-effects-index.js so the counts and descriptions match.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const SITE = 'https://motion-bench.vercel.app/';

const CATS = [
  { cat: 'typography', path: 'typography', name: 'Typography Effects', blurb: 'Text and letter animations: variable fonts, wave and scramble, magnetic letters, glitch, gooey, neon, marquee.' },
  { cat: 'scroll', path: 'scroll', name: 'Scroll Animations', blurb: 'Scroll-triggered and scroll-scrubbed motion: reveals, parallax, pinning, counters, typewriter, letter scrub.' },
  { cat: 'gallery', path: 'gallery', name: 'Gallery Effects', blurb: 'Image and gallery hover effects: tilt, masks, zoom, slice and curtain reveals, duotone, halftone, glitch.' },
  { cat: 'cursor', path: 'cursor', name: 'Cursor & Pointer Effects', blurb: 'Custom cursors and pointer-driven effects: magnetic buttons, trails, rope, sparks, spotlight, blend modes.' },
  { cat: 'layout', path: 'layout', name: 'Reveal & Layout Patterns', blurb: 'UI motion patterns: modals, accordions, tabs, carousels, toasts, toggles, skeletons, confetti.' }
];

function slugify(id) {
  return id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
}

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'effects-index.js'), 'utf8'), sandbox);
const index = sandbox.window.EFFECTS_INDEX;
const total = index.length;

const intro = [
  '# Motion Bench',
  '',
  `> A searchable library of ${total} copy-paste web animation effects across typography, scroll, gallery, cursor and layout. Every effect is plain HTML, CSS and JavaScript with no dependencies, no build step and no framework, and ships with its own standalone, copyable code. MIT licensed.`,
  '',
  'Each effect has a live demo, a short plain-language description of what it does and how it works, and the complete HTML, CSS and JavaScript needed to reproduce it. Effects are self-contained: copy the three code blocks into any page and they run.',
  '',
  `Site: ${SITE}`,
  'Source: https://github.com/theonlyanish/Motion-Bench',
  'Author: Anish Kapse (https://anishkapse.com/)',
  ''
];

const categoryList = ['## Categories', ''].concat(CATS.map(function (c) {
  const n = index.filter(function (e) { return e.cat === c.cat; }).length;
  return `- [${c.name}](${SITE}${c.path}): ${n} effects. ${c.blurb}`;
}));

const optional = [
  '',
  '## Optional',
  '',
  `- [All effects with descriptions](${SITE}llms-full.txt): every effect, one line each, with its URL.`,
  `- [Sitemap](${SITE}sitemap.xml)`,
  ''
];

fs.writeFileSync(path.join(root, 'llms.txt'), intro.concat(categoryList, optional).join('\n'));

const full = intro.concat(categoryList, ['']);
CATS.forEach(function (c) {
  const effects = index.filter(function (e) { return e.cat === c.cat; });
  full.push(`## ${c.name} (${effects.length})`, '', `Category page: ${SITE}${c.path}`, '');
  effects.forEach(function (e) {
    full.push(`- [${e.name}](${SITE}${c.path}/${slugify(e.id)}): ${e.desc}`);
  });
  full.push('');
});
fs.writeFileSync(path.join(root, 'llms-full.txt'), full.join('\n'));

console.log('Wrote llms.txt and llms-full.txt (' + total + ' effects)');
