# Motion Bench

**144 copy-paste animation effects** for typography, scroll, galleries, cursors, and layout — built with nothing but plain HTML, CSS, and JavaScript. No build step, no framework, no backend. Every effect ships with its own copyable, standalone code.

Think of it as a private CodePen you can keep on your own machine: search it, steal from it, and make it your own.

👉 **Grab it, run it locally, and start playing.** Then add your own effects — it's built to grow.

## Take it for a spin

Clone or download the repo, then serve the folder with a server that supports clean URLs (the nav links to `/scroll`, not `/scroll.html`, to match how Vercel serves the site):

```bash
git clone https://github.com/theonlyanish/frontend-reference.git
cd frontend-reference

npx serve .   # clean URLs on by default
```

Open **`http://localhost:3000/`** and you're in. (Python's `http.server` also works if you append `.html` to the URL yourself; opening `index.html` straight from disk works for the home page only.)

The home page is a searchable, filterable index — hit `/` to jump to search, type a few letters, and every matching effect surfaces instantly. Click any row to land right on that effect, then pop open **View code** to copy it.

## What's inside

| Category   | Effects | Page            |
|------------|:-------:|-----------------|
| Typography |   33    | `typography.html` |
| Scroll     |   33    | `scroll.html`   |
| Gallery    |   33    | `gallery.html`  |
| Cursor     |   22    | `cursor.html`   |
| Layout     |   23    | `layout.html`   |

Everything from magnetic letters and variable-font waves to scroll-scrubbed reveals, image hover tricks, custom cursors, modals, and carousels. Drag the sliders, move your cursor, poke at things — the whole point is to play.

## Make it yours

This is meant to be forked and extended. Adding your own effect is deliberately low-ceremony:

1. Drop a new `<section>` into the relevant page (e.g. `typography.html`) following the pattern of the effects already there.
2. Add its behavior to that page's script and any styles to its CSS.
3. Add a copyable snippet in `snippets/` so **View code** has something to show.
4. Re-sync the searchable index:

   ```bash
   node scripts/build-effects-index.js
   node scripts/build-schema.js
   ```

That's it — your effect shows up in search and filters on the home page. Build a wild one? Keep it in your copy, or open a PR if you think others would enjoy it.

## How it's laid out

```
index.html / home.css / home.js  The searchable home page
effects-index.js                 Canonical list of every effect (generated)
typography.html                  Typography effects
scroll.html                      Scroll effects
gallery.html                     Gallery effects
cursor.html                      Cursor effects
layout.html                      Layout effects
snippets/                        Per-category copyable code snippets
scripts/build-effects-index.js   Regenerates effects-index.js
scripts/build-schema.js          Regenerates the JSON-LD in each page <head>
a11y.js                          Reduced-motion + touch handling (shared)
transitions.js / .css            Page-to-page transitions + smooth scroll
code-panel.js / .css             The "View code" panel
```

## Good to know

- **Reduced motion:** the whole site respects your OS `prefers-reduced-motion` setting — looping and autoplay animations quiet down, entrances jump to their end state.
- **Touch:** pointer-driven effects respond to touch where they sensibly can; the cursor page is happiest on a desktop with a mouse or trackpad, and says so.
- **Type:** [Geist](https://vercel.com/font) for UI, [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex) for the variable-font demos.
- **Smooth scroll:** [Lenis](https://github.com/darkroomengineering/lenis).

## License

[MIT](LICENSE) © 2026 Anish Kapse. Copy it, remix it, ship it — no strings. A credit link back is always appreciated but never required.

---

Made by [Anish Kapse](https://anishkapse.com/). If you build something fun with it, I'd love to see it.
