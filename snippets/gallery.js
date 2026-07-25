/**
 * Standalone code snippets for the Gallery Effects page (gallery.html).
 * Each entry is keyed by the section's data-fx attribute and holds
 * self-contained, copy-paste-ready html / css / js strings.
 * Rendered by code-panel.js.
 */
window.EFFECT_SNIPPETS = {

  // ── 1. Zoom Hover (pure CSS) ──────────────────────────
  zoomHover: {
    html: `<div class="zoom-hover">
  <img src="https://picsum.photos/id/10/800/600" alt="Nature">
</div>`,
    css: `.zoom-hover {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.zoom-hover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.zoom-hover:hover img {
  transform: scale(1.1);
}`
  },

  // ── 2. Grayscale to Color (pure CSS) ──────────────────
  grayColor: {
    html: `<div class="gray-color">
  <img src="https://picsum.photos/id/12/800/600" alt="Beach">
</div>`,
    css: `.gray-color {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.gray-color img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(100%);
  transition: filter 0.5s ease;
}

.gray-color:hover img {
  filter: grayscale(0%);
}`
  },

  // ── 3. Curtain Reveal (pure CSS) ──────────────────────
  curtainReveal: {
    html: `<div class="curtain-reveal">
  <img src="https://picsum.photos/id/15/800/600" alt="Waterfall">
  <div class="curtain"></div>
</div>`,
    css: `.curtain-reveal {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.curtain-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.curtain-reveal .curtain {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #0a0a0f;
  opacity: 0.8;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.curtain-reveal:hover .curtain {
  transform: scaleY(1);
}`
  },

  // ── 4. Caption Slide Up (pure CSS) ────────────────────
  captionSlide: {
    html: `<div class="caption-slide">
  <img src="https://picsum.photos/id/16/800/600" alt="Ocean">
  <div class="caption-overlay">
    <h3>Ocean View</h3>
    <p>A serene view of the water</p>
  </div>
</div>`,
    css: `.caption-slide {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  color: #f0f0f5;
  font-family: system-ui, sans-serif;
}

.caption-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.caption-overlay {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.caption-slide:hover .caption-overlay {
  transform: translateY(0);
}

.caption-overlay h3 { margin: 0; font-size: 1.1rem; }
.caption-overlay p { margin: 0.25rem 0 0; font-size: 0.85rem; color: #ccc; }`
  },

  // ── 5. 3D Tilt ────────────────────────────────────────
  tilt3d: {
    html: `<div class="tilt-card" id="tiltCard">
  <div class="tilt-inner" id="tiltInner">
    <img src="https://picsum.photos/id/28/800/600" alt="Forest">
  </div>
</div>`,
    css: `.tilt-card {
  width: 400px;
  aspect-ratio: 4 / 3;
  perspective: 1000px;
}

.tilt-inner {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.tilt-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}`,
    js: `var card = document.getElementById('tiltCard');
var inner = document.getElementById('tiltInner');
var MAX_TILT = 15; // degrees

card.addEventListener('mousemove', function (e) {
  var rect = card.getBoundingClientRect();
  var xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1..1
  var yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  var rotX = -yPct * MAX_TILT;
  var rotY = xPct * MAX_TILT;
  inner.style.transform =
    'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.05)';
});

card.addEventListener('mouseleave', function () {
  inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});`
  },

  // ── 6. Blur Reveal (pure CSS) ─────────────────────────
  blurReveal: {
    html: `<div class="blur-reveal">
  <img src="https://picsum.photos/id/29/800/600" alt="Mountain">
</div>`,
    css: `.blur-reveal {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.blur-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: blur(8px);
  transform: scale(1.05); /* hides the blurred edge fringe */
  transition: filter 0.5s ease;
}

.blur-reveal:hover img {
  filter: blur(0);
}`
  },

  // ── 7. Clip Path Morph (pure CSS) ─────────────────────
  clipMorph: {
    html: `<div class="clip-shape">
  <img src="https://picsum.photos/id/40/800/600" alt="Cat">
</div>`,
    css: `.clip-shape {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
}

.clip-shape img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  clip-path: circle(40% at 50% 50%);
  transition: clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.clip-shape:hover img {
  clip-path: circle(75% at 50% 50%);
  transform: scale(1.05);
}`
  },

  // ── 8. Glitch Image ───────────────────────────────────
  glitchImage: {
    html: `<div class="glitch-img" id="glitchImg">
  <div class="glitch-layer layer-1"></div>
  <div class="glitch-layer layer-2"></div>
  <img src="https://picsum.photos/id/48/800/600" alt="Architecture">
</div>`,
    css: `.glitch-img {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.glitch-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.glitch-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: url('https://picsum.photos/id/48/800/600') no-repeat center/cover;
  opacity: 0;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 1;
}

.glitch-img:hover .layer-1 {
  opacity: 0.5;
  animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
  filter: hue-rotate(90deg);
}

.glitch-img:hover .layer-2 {
  opacity: 0.5;
  animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
  filter: hue-rotate(-90deg);
}

@keyframes glitch-anim-1 {
  0% { transform: translate(-2px, 2px); }
  100% { transform: translate(2px, -2px); }
}

@keyframes glitch-anim-2 {
  0% { transform: translate(2px, -2px); }
  100% { transform: translate(-2px, 2px); }
}`,
    js: `// Optional: the layers also drift with the mouse position
var glitch = document.getElementById('glitchImg');
var layers = glitch.querySelectorAll('.glitch-layer');

glitch.addEventListener('mousemove', function (e) {
  var rect = glitch.getBoundingClientRect();
  var x = (e.clientX - rect.left) / rect.width;
  var y = (e.clientY - rect.top) / rect.height;
  layers.forEach(function (layer, i) {
    var factor = (i + 1) * 5;
    var moveX = (x - 0.5) * factor;
    var moveY = (y - 0.5) * factor;
    layer.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
  });
});

glitch.addEventListener('mouseleave', function () {
  layers.forEach(function (layer) {
    layer.style.transform = 'translate(0, 0)';
  });
});`
  },

  // ── 9. Parallax Scroll ────────────────────────────────
  parallaxScroll: {
    html: `<!-- Put this partway down a scrollable page so it can move -->
<div class="parallax-container" id="parallaxContainer">
  <img src="https://picsum.photos/id/54/800/900" alt="Tall Building" id="parallaxImg">
</div>`,
    css: `.parallax-container {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

/* Image is taller than its frame so it has room to slide */
.parallax-container img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  display: block;
  will-change: transform;
}`,
    js: `var container = document.getElementById('parallaxContainer');
var img = document.getElementById('parallaxImg');
var RANGE = 80; // total px of travel across the viewport

var ticking = false;

function update() {
  ticking = false;
  var rect = container.getBoundingClientRect();
  var viewHeight = window.innerHeight;
  if (rect.top < viewHeight && rect.bottom > 0) {
    // 0 when entering at the bottom, 1 when leaving at the top
    var progress = (viewHeight - rect.top) / (viewHeight + rect.height);
    var y = (progress - 0.5) * RANGE;
    img.style.transform = 'translateY(' + y + 'px)';
  }
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
update();`
  },

  // ── 10. Magnetic Cursor ───────────────────────────────
  magneticCursor: {
    html: `<div class="magnetic-wrap" id="magneticWrap">
  <img src="https://picsum.photos/id/57/800/600" alt="Castle">
  <div class="magnetic-cursor" id="magneticCursor">View</div>
</div>`,
    css: `.magnetic-wrap {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  cursor: none;
}

.magnetic-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.magnetic-cursor {
  position: absolute;
  top: 0; left: 0;
  width: 60px; height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 10;
}`,
    js: `var wrap = document.getElementById('magneticWrap');
var cursor = document.getElementById('magneticCursor');

wrap.addEventListener('mousemove', function (e) {
  var rect = wrap.getBoundingClientRect();
  cursor.style.left = (e.clientX - rect.left) + 'px';
  cursor.style.top = (e.clientY - rect.top) + 'px';
  cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

wrap.addEventListener('mouseleave', function () {
  cursor.style.transform = 'translate(-50%, -50%) scale(0)';
});`
  },

  // ── 11. Slice Reveal (pure CSS) ───────────────────────
  sliceReveal: {
    html: `<div class="slice-reveal">
  <img src="https://picsum.photos/id/60/800/600" alt="Computer">
  <div class="slice s1"></div>
  <div class="slice s2"></div>
  <div class="slice s3"></div>
</div>`,
    css: `.slice-reveal {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.slice-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slice {
  position: absolute;
  top: 0;
  height: 100%;
  width: 33.34%;
  background: #0a0a0f;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2;
}

/* Alternate origins so the strips wipe in opposite directions */
.s1 { left: 0; transform-origin: top; }
.s2 { left: 33.33%; transform-origin: bottom; transition-delay: 0.1s; }
.s3 { left: 66.66%; transform-origin: top; transition-delay: 0.2s; }

.slice-reveal:hover .slice {
  transform: scaleY(0);
}`
  },

  // ── 12. Ink Spread (pure CSS + SVG mask) ──────────────
  inkSpread: {
    html: `<div class="ink-spread">
  <img src="https://picsum.photos/id/65/800/600" alt="Girl">
  <svg class="ink-mask" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M0 0 H100 V100 H0 Z" />
  </svg>
</div>`,
    css: `.ink-spread {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.ink-spread img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ink-mask {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 100%;
  fill: #0a0a0f;
  transform: scaleY(1);
  transform-origin: bottom;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.ink-spread:hover .ink-mask {
  transform: scaleY(0);
}`
  },

  // ── 13. Perspective Rotate ────────────────────────────
  perspectiveRotate: {
    html: `<div class="perspective-rotate" id="perspectiveRotate">
  <img src="https://picsum.photos/id/75/800/600" alt="Plant" id="perspectiveImg">
</div>`,
    css: `.perspective-rotate {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  perspective: 800px;
}

.perspective-rotate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform-origin: center center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}`,
    js: `var wrap = document.getElementById('perspectiveRotate');
var img = document.getElementById('perspectiveImg');
var MAX_TILT = 15; // degrees

wrap.addEventListener('mousemove', function (e) {
  var rect = wrap.getBoundingClientRect();
  var xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1..1
  var yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  var rotX = -yPct * MAX_TILT;
  var rotY = xPct * MAX_TILT;
  img.style.transform =
    'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(0.95)';
});

wrap.addEventListener('mouseleave', function () {
  img.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});`
  },

  // ── 14. Border Draw (pure CSS) ────────────────────────
  borderDraw: {
    html: `<div class="border-draw">
  <img src="https://picsum.photos/id/88/800/600" alt="Road">
  <div class="border-box"></div>
</div>`,
    css: `.border-draw {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.border-draw img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.border-box {
  position: absolute;
  top: 1rem; left: 1rem; right: 1rem; bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.border-draw:hover .border-box {
  transform: scale(1);
  opacity: 1;
}

.border-draw:hover img {
  transform: scale(1.05);
}`
  },

  // ── 15. Duotone (pure CSS) ────────────────────────────
  duotone: {
    html: `<div class="duotone-hover">
  <img src="https://picsum.photos/id/96/800/600" alt="Tools">
</div>`,
    css: `.duotone-hover {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  /* The tint color that shows through luminosity blending */
  background: #f00;
}

.duotone-hover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  mix-blend-mode: luminosity;
  filter: contrast(1.2);
  transition: mix-blend-mode 0.4s, filter 0.4s;
}

.duotone-hover:hover img {
  mix-blend-mode: normal;
  filter: none;
}`
  },

  // ── 16. Center Reveal (pure CSS) ──────────────────────
  centerReveal: {
    html: `<div class="center-reveal">
  <img src="https://picsum.photos/id/102/800/600" alt="Raspberries">
  <div class="center-mask"></div>
</div>`,
    css: `.center-reveal {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.center-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* A donut mask: transparent circle in the middle, dark everywhere else.
   Scaling the whole mask up grows the visible hole. */
.center-mask {
  position: absolute;
  top: 50%; left: 50%;
  width: 150%; height: 150%;
  background: radial-gradient(circle, transparent 30%, #0a0a0f 31%);
  transform: translate(-50%, -50%) scale(1);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.center-reveal:hover .center-mask {
  transform: translate(-50%, -50%) scale(3);
}`
  },

  // ── 17. Pixelate (pure CSS) ───────────────────────────
  pixelate: {
    html: `<div class="pixelate">
  <img src="https://picsum.photos/id/106/800/600" alt="Flower">
</div>`,
    css: `.pixelate {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.pixelate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  image-rendering: pixelated;
  filter: contrast(1.2) blur(4px);
  transition: filter 0.4s ease;
}

.pixelate:hover img {
  filter: contrast(1) blur(0);
}`
  },

  // ── 18. Slide Behind (pure CSS) ───────────────────────
  slideBehind: {
    html: `<div class="slide-behind">
  <div class="img-front">
    <img src="https://picsum.photos/id/111/800/600" alt="Car">
  </div>
  <div class="img-back">
    <h3>Vintage</h3>
  </div>
</div>`,
    css: `.slide-behind {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  background: #7c5cff;
}

.img-front {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2;
}

.img-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-back {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.img-back h3 {
  font-family: system-ui, sans-serif;
  font-size: 2rem;
  color: #fff;
  margin: 0;
}

.slide-behind:hover .img-front {
  transform: translateX(60px) translateY(-40px) scale(0.8);
}`
  },

  // ── 19. Flash Overlay (pure CSS) ──────────────────────
  flashOverlay: {
    html: `<div class="flash-overlay">
  <img src="https://picsum.photos/id/120/800/600" alt="Shoes">
  <div class="flash"></div>
</div>`,
    css: `.flash-overlay {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.flash-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.flash {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #fff;
  opacity: 0;
  pointer-events: none;
}

/* Bright flash that immediately fades out */
.flash-overlay:hover .flash {
  animation: flash-anim 0.4s forwards;
}

@keyframes flash-anim {
  0% { opacity: 0.6; }
  100% { opacity: 0; }
}`
  },

  // ── 20. Pan on Hover ──────────────────────────────────
  panHover: {
    html: `<div class="pan-hover" id="panHover">
  <img src="https://picsum.photos/id/128/1000/800" alt="City" id="panImg">
</div>`,
    css: `.pan-hover {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.pan-hover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 4s ease-in-out;
}`,
    js: `var wrap = document.getElementById('panHover');
var img = document.getElementById('panImg');
var ZOOM = 1.2;

wrap.addEventListener('mousemove', function (e) {
  var rect = wrap.getBoundingClientRect();
  var xPct = ((e.clientX - rect.left) / rect.width) * 100;
  var yPct = ((e.clientY - rect.top) / rect.height) * 100;
  // Zoom toward the cursor; the slow transition makes the pan drift
  img.style.transformOrigin = xPct + '% ' + yPct + '%';
  img.style.transform = 'scale(' + ZOOM + ')';
});

wrap.addEventListener('mouseleave', function () {
  img.style.transform = 'scale(1)';
});`
  },

  // ── 21. Turbulence Distort (pure CSS) ─────────────────
  turbulence: {
    html: `<div class="distort-filter">
  <img src="https://picsum.photos/id/133/800/600" alt="Distort">
</div>`,
    css: `.distort-filter {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.distort-filter img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* An SVG turbulence + displacement filter inlined as a data URI */
.distort-filter:hover img {
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="distort"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>#distort');
}`
  },

  // ── 22. Fold Reveal (pure CSS) ────────────────────────
  foldReveal: {
    html: `<div class="fold-reveal">
  <img src="https://picsum.photos/id/145/800/600" alt="Fold">
  <div class="fold-cover"></div>
</div>`,
    css: `.fold-reveal {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  perspective: 1000px;
}

.fold-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fold-cover {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #0a0a0f;
  opacity: 0.9;
  transform-origin: top;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Swings up and away like a sheet of paper */
.fold-reveal:hover .fold-cover {
  transform: rotateX(-100deg);
  opacity: 0;
}`
  },

  // ── 23. Circular Swap (pure CSS) ──────────────────────
  circleSwap: {
    html: `<div class="circle-swap">
  <img src="https://picsum.photos/id/152/800/600" alt="Swap 1" class="c-img-1">
  <img src="https://picsum.photos/id/158/800/600" alt="Swap 2" class="c-img-2">
</div>`,
    css: `.circle-swap {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.circle-swap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* The second image starts as a zero-size circle in the center */
.circle-swap .c-img-2 {
  position: absolute;
  top: 0; left: 0;
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2;
}

.circle-swap:hover .c-img-2 {
  clip-path: circle(100% at 50% 50%);
}`
  },

  // ── 24. Directional Overlay ───────────────────────────
  dirOverlay: {
    html: `<div class="dir-overlay" id="dirOverlay">
  <img src="https://picsum.photos/id/160/800/600" alt="Direction">
  <div class="dir-content" id="dirContent"><span>Hello</span></div>
</div>`,
    css: `.dir-overlay {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.dir-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dir-content {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(124, 92, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  transform: translate(0, 100%); /* off-screen by default; JS overrides */
  transition: transform 0.4s ease;
}`,
    js: `var overlay = document.getElementById('dirOverlay');
var content = document.getElementById('dirContent');

// 0 = top, 1 = right, 2 = bottom, 3 = left
function getDirection(e) {
  var rect = overlay.getBoundingClientRect();
  var x = e.clientX - rect.left - rect.width / 2;
  var y = e.clientY - rect.top - rect.height / 2;
  return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
}

var OFFSCREEN = [
  'translateY(-100%)', // top
  'translateX(100%)',  // right
  'translateY(100%)',  // bottom
  'translateX(-100%)'  // left
];

overlay.addEventListener('mouseenter', function (e) {
  // Jump (no transition) to the entry edge, then animate in
  content.style.transition = 'none';
  content.style.transform = OFFSCREEN[getDirection(e)];
  requestAnimationFrame(function () {
    content.style.transition = 'transform 0.4s ease';
    content.style.transform = 'translate(0, 0)';
  });
});

overlay.addEventListener('mouseleave', function (e) {
  content.style.transform = OFFSCREEN[getDirection(e)];
});`
  },

  // ── 25. Block Glitch (pure CSS) ───────────────────────
  blockGlitch: {
    html: `<div class="block-glitch">
  <img src="https://picsum.photos/id/164/800/600" alt="Block">
  <div class="glitch-blocks">
    <div class="g-block"></div>
    <div class="g-block"></div>
    <div class="g-block"></div>
    <div class="g-block"></div>
  </div>
</div>`,
    css: `.block-glitch {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.block-glitch img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.glitch-blocks {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  pointer-events: none;
}

.g-block {
  background: #fff;
  opacity: 0;
  transition: opacity 0.1s;
}

.block-glitch:hover .g-block {
  animation: block-flicker 0.2s infinite steps(2);
}

/* Stagger each quadrant so the flicker looks chaotic */
.g-block:nth-child(1) { animation-delay: 0s; }
.g-block:nth-child(2) { animation-delay: 0.05s; }
.g-block:nth-child(3) { animation-delay: 0.1s; }
.g-block:nth-child(4) { animation-delay: 0.15s; }

@keyframes block-flicker {
  0% { opacity: 0; }
  50% { opacity: 0.3; }
  100% { opacity: 0; }
}`
  },

  // ── 26. Halftone (pure CSS) ───────────────────────────
  halftone: {
    html: `<div class="halftone">
  <img src="https://picsum.photos/id/177/800/600" alt="Halftone">
</div>`,
    css: `.halftone {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.halftone img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* A repeating radial gradient produces the dot grid */
.halftone::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: radial-gradient(circle, #000 2px, transparent 2.5px);
  background-size: 8px 8px;
  opacity: 0;
  transition: opacity 0.4s;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.halftone:hover::after {
  opacity: 0.4;
}`
  },

  // ── 27. Expanding Card (pure CSS) ─────────────────────
  expandCard: {
    html: `<div class="expanding-card">
  <img src="https://picsum.photos/id/180/800/600" alt="Expand">
  <div class="card-info">
    <h3>Title</h3>
    <p>Description goes here</p>
  </div>
</div>`,
    css: `.expanding-card {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  background: #12121a;
}

.expanding-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-info {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background: #12121a;
  font-family: system-ui, sans-serif;
  color: #f0f0f5;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-info h3 { margin: 0; font-size: 1rem; }
.card-info p { margin: 0.25rem 0 0; font-size: 0.8rem; color: #6b6b80; }

.expanding-card:hover img {
  transform: translateY(-20px) scale(0.9);
}

.expanding-card:hover .card-info {
  transform: translateY(0);
}`
  },

  // ── 28. Mirror Split (pure CSS) ───────────────────────
  mirrorSplit: {
    html: `<div class="mirror-split">
  <div class="mirror-half m-left">
    <img src="https://picsum.photos/id/193/800/600" alt="Mirror">
  </div>
  <div class="mirror-half m-right">
    <img src="https://picsum.photos/id/193/800/600" alt="Mirror">
  </div>
</div>`,
    css: `.mirror-split {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  background: #0a0a0f;
}

.mirror-half {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Each half holds a full-width copy of the image, offset so the
   two halves line up as one picture */
.mirror-half img {
  position: absolute;
  width: 200%;
  height: 100%;
  object-fit: cover;
}

.m-left { left: 0; }
.m-left img { left: 0; }
.m-right { right: 0; }
.m-right img { left: -100%; }

.mirror-split:hover .m-left { transform: translateX(-10px); }
.mirror-split:hover .m-right { transform: translateX(10px); }`
  },

  // ── 29. Video Hover ───────────────────────────────────
  videoHover: {
    html: `<div class="video-hover" id="videoHover"
  data-video="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4">
  <img src="https://picsum.photos/id/200/800/600" alt="Video Placeholder">
  <div class="video-container" id="videoContainer"></div>
</div>`,
    css: `.video-hover {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
}

.video-hover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
  transition: opacity 0.3s;
}

.video-hover:hover img {
  opacity: 0;
}

.video-container video {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}`,
    js: `var wrap = document.getElementById('videoHover');
var container = document.getElementById('videoContainer');
var src = wrap.dataset.video;
var video = null;

wrap.addEventListener('mouseenter', function () {
  // Lazily create the video on first hover
  if (!video) {
    video = document.createElement('video');
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    container.appendChild(video);
  }
  video.play().catch(function () {});
});

wrap.addEventListener('mouseleave', function () {
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
});`
  },

  // ── 30. Ripple ────────────────────────────────────────
  ripple: {
    html: `<div class="ripple-effect" id="rippleEffect">
  <img src="https://picsum.photos/id/211/800/600" alt="Ripple">
  <svg width="0" height="0">
    <filter id="ripple-filter">
      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="turbulence"/>
      <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </svg>
</div>`,
    css: `.ripple-effect {
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

/* Filter applied at all times; JS animates the feDisplacementMap
   scale (scale=0 is a no-op, so the resting state looks normal) */
.ripple-effect img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: url('#ripple-filter');
}`,
    js: `var wrap = document.getElementById('rippleEffect');
var displacement = document.querySelector('#ripple-filter feDisplacementMap');
var MAX_SCALE = 30;  // displacement strength on hover
var SMOOTH = 0.1;    // lerp factor

var scale = 0;
var target = 0;

wrap.addEventListener('mouseenter', function () { target = MAX_SCALE; });
wrap.addEventListener('mouseleave', function () { target = 0; });

function tick() {
  scale += (target - scale) * SMOOTH;
  displacement.setAttribute('scale', scale);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 31. CRT Scanlines (pure CSS) ──────────────────────
  crtScanlines: {
    html: `<div class="crt-effect">
  <img src="https://picsum.photos/id/219/800/600" alt="CRT">
  <div class="crt-scanlines"></div>
  <div class="crt-sweep"></div>
</div>`,
    css: `.crt-effect {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.crt-effect img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s;
}

.crt-scanlines {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: repeating-linear-gradient(to bottom,
    transparent 0 2px, rgba(0, 0, 0, 0.35) 2px 4px);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.crt-sweep {
  position: absolute;
  top: -20%; left: 0;
  width: 100%; height: 15%;
  background: linear-gradient(to bottom,
    transparent, rgba(255, 255, 255, 0.15), transparent);
  opacity: 0;
  pointer-events: none;
}

.crt-effect:hover .crt-scanlines { opacity: 1; }

.crt-effect:hover .crt-sweep {
  opacity: 1;
  animation: crt-roll 2.5s linear infinite;
}

.crt-effect:hover img {
  filter: contrast(1.15) saturate(1.3) brightness(1.05);
}

@keyframes crt-roll {
  0% { top: -20%; }
  100% { top: 120%; }
}`
  },

  // ── 32. Chromatic Aberration (pure CSS) ───────────────
  chromaSplit: {
    html: `<div class="chroma-split">
  <img src="https://picsum.photos/id/225/800/600" alt="Chroma" class="chroma-base">
  <img src="https://picsum.photos/id/225/800/600" alt="" aria-hidden="true" class="chroma-r">
  <img src="https://picsum.photos/id/225/800/600" alt="" aria-hidden="true" class="chroma-b">
</div>`,
    css: `.chroma-split {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.chroma-split img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s;
}

/* Two tinted ghost copies that slide apart on hover */
.chroma-r,
.chroma-b {
  position: absolute;
  top: 0; left: 0;
  opacity: 0;
  mix-blend-mode: screen;
  pointer-events: none;
}

.chroma-r { filter: sepia(1) saturate(6) hue-rotate(-50deg); }
.chroma-b { filter: sepia(1) saturate(6) hue-rotate(180deg); }

.chroma-split:hover .chroma-r {
  opacity: 0.55;
  transform: translate(-8px, 3px);
}

.chroma-split:hover .chroma-b {
  opacity: 0.55;
  transform: translate(8px, -3px);
}`
  },

  // ── 33. Before / After Slider ─────────────────────────
  compareSlider: {
    html: `<div class="compare-slider" id="compareSlider">
  <img src="https://picsum.photos/id/230/800/600" alt="After">
  <div class="compare-before">
    <img src="https://picsum.photos/id/230/800/600" alt="Before">
  </div>
  <div class="compare-handle"></div>
</div>`,
    css: `.compare-slider {
  position: relative;
  width: 400px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  cursor: ew-resize;
  touch-action: none;
  user-select: none;
}

.compare-slider img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  -webkit-user-drag: none;
  user-select: none;
  pointer-events: none;
}

.compare-before {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: var(--split, 50%);
  overflow: hidden;
}

.compare-before img {
  width: auto;
  height: 100%;
  filter: grayscale(100%);
  /* Fixed width so the image doesn't squish as the pane resizes */
  max-width: none;
}

.compare-handle {
  position: absolute;
  top: 0;
  left: var(--split, 50%);
  width: 2px;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.compare-handle::after {
  content: '\\21d4'; /* ⇔ */
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 32px; height: 32px;
  background: #fff;
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}`,
    js: `var slider = document.getElementById('compareSlider');
var dragging = false;

function setSplit(clientX) {
  var rect = slider.getBoundingClientRect();
  var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  slider.style.setProperty('--split', pct + '%');
}

// Stop the browser's native image drag from hijacking the gesture
slider.querySelectorAll('img').forEach(function (img) {
  img.draggable = false;
});
slider.addEventListener('dragstart', function (e) { e.preventDefault(); });

slider.addEventListener('pointerdown', function (e) {
  e.preventDefault();
  dragging = true;
  slider.setPointerCapture(e.pointerId);
  setSplit(e.clientX);
});
slider.addEventListener('pointermove', function (e) {
  if (dragging) setSplit(e.clientX);
});
slider.addEventListener('pointerup', function () { dragging = false; });
slider.addEventListener('pointercancel', function () { dragging = false; });`
  }
};
