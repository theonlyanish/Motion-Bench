/**
 * Standalone code snippets for the Cursor & Pointer page (cursor.html).
 * Each entry is keyed by the section's data-fx attribute and holds
 * self-contained, copy-paste-ready html / css / js strings.
 * The page shares one global custom cursor; every snippet below instead
 * ships its own minimal cursor element scoped to the demo area.
 * Rendered by code-panel.js.
 */
window.EFFECT_SNIPPETS = {

  // ── 1. Magnetic Button ────────────────────────────────
  magnetic: {
    html: `<div class="magnetic-area" id="magneticArea">
  <button class="magnetic-btn" id="magneticBtn">Magnetic</button>
  <div class="cursor-ring" id="cursorRing"></div>
</div>`,
    css: `.magnetic-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  overflow: hidden;
  cursor: none;
}

.magnetic-btn {
  padding: 0.8rem 1.5rem;
  background: #7c5cff;
  color: #fff;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: none;
  transition: transform 0.1s;
}

.cursor-ring {
  position: absolute;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s, border-color 0.3s;
  opacity: 0;
}`,
    js: `var area = document.getElementById('magneticArea');
var btn = document.getElementById('magneticBtn');
var ring = document.getElementById('cursorRing');
var RADIUS = 80;    // px — snap distance to button center
var PULL = 0.4;     // fraction of the offset the button moves
var SMOOTH = 0.15;  // ring lerp factor

var mouseX = 0, mouseY = 0;   // relative to area
var ringX = 0, ringY = 0;

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  ring.style.opacity = '1';

  var b = btn.getBoundingClientRect();
  var dx = e.clientX - (b.left + b.width / 2);
  var dy = e.clientY - (b.top + b.height / 2);
  var dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < RADIUS) {
    btn.style.transform = 'translate(' + (dx * PULL) + 'px, ' + (dy * PULL) + 'px)';
    ring.style.width = '60px';
    ring.style.height = '60px';
    ring.style.borderColor = '#7c5cff';
  } else {
    btn.style.transform = 'translate(0, 0)';
    ring.style.width = '40px';
    ring.style.height = '40px';
    ring.style.borderColor = 'rgba(255,255,255,0.5)';
  }
});

area.addEventListener('mouseleave', function () {
  btn.style.transform = 'translate(0, 0)';
  ring.style.opacity = '0';
});

function tick() {
  ringX += (mouseX - ringX) * SMOOTH;
  ringY += (mouseY - ringY) * SMOOTH;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 2. Blend Mode ─────────────────────────────────────
  blend: {
    html: `<div class="blend-area" id="blendArea">
  <h2>Difference</h2>
  <div class="blend-cursor" id="blendCursor"></div>
</div>`,
    css: `.blend-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #000;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

/* White dot + difference blending inverts whatever is underneath */
.blend-cursor {
  position: absolute;
  top: 0; left: 0;
  width: 30px; height: 30px;
  background: #fff;
  border-radius: 50%;
  pointer-events: none;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  opacity: 0;
}`,
    js: `var area = document.getElementById('blendArea');
var dot = document.getElementById('blendCursor');

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  dot.style.left = (e.clientX - rect.left) + 'px';
  dot.style.top = (e.clientY - rect.top) + 'px';
});
area.addEventListener('mouseenter', function () { dot.style.opacity = '1'; });
area.addEventListener('mouseleave', function () { dot.style.opacity = '0'; });`
  },

  // ── 3. Mask Reveal ────────────────────────────────────
  mask: {
    html: `<div class="mask-area" id="maskArea">
  <div class="mask-bg">HOVER TO REVEAL</div>
  <div class="mask-front" id="maskFront">HOVER TO REVEAL</div>
</div>`,
    css: `.mask-area {
  position: relative;
  height: 240px;
  background: #000;
  overflow: hidden;
  font-family: sans-serif;
}

.mask-bg,
.mask-front {
  position: absolute;
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.mask-bg { color: #333; }

.mask-front {
  color: #7c5cff;
  background: #111;
  clip-path: circle(0% at 50% 50%); /* opened up by JS */
}`,
    js: `var area = document.getElementById('maskArea');
var front = document.getElementById('maskFront');
var HOLE = '25%'; // circle radius while hovering

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  front.style.clipPath = 'circle(' + HOLE + ' at ' + x + 'px ' + y + 'px)';
});

area.addEventListener('mouseleave', function () {
  front.style.clipPath = 'circle(0% at 50% 50%)';
});`
  },

  // ── 4. Cursor Trail ───────────────────────────────────
  trail: {
    html: `<div class="trail-area" id="trailArea">
  <span>Move Fast</span>
</div>`,
    css: `.trail-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #6b6b80;
  overflow: hidden;
  font-family: sans-serif;
}

.trail-dot {
  position: absolute;
  width: 6px; height: 6px;
  background: #7c5cff;
  border-radius: 50%;
  pointer-events: none;
}`,
    js: `var area = document.getElementById('trailArea');
var DENSITY = 0.5;  // chance to spawn a dot per mousemove event
var LIFE = 800;     // ms

area.addEventListener('mousemove', function (e) {
  if (Math.random() > DENSITY) return; // limit density
  var rect = area.getBoundingClientRect();
  var dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = (e.clientX - rect.left) + 'px';
  dot.style.top = (e.clientY - rect.top) + 'px';
  area.appendChild(dot);

  // Animate out. The translate(-50%,-50%) must live in the keyframes — a base
  // transform would be replaced by the animation, leaving each dot offset by
  // half its size (down-right of the pointer) for its whole life.
  dot.animate([
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
    { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
  ], { duration: LIFE, easing: 'ease-out' }).onfinish = function () {
    dot.remove();
  };
});`
  },

  // ── 5. Scale Interaction ──────────────────────────────
  scale: {
    html: `<div class="scale-area" id="scaleArea">
  <div class="scale-target" id="scaleTarget">Target</div>
  <div class="scale-dot" id="scaleDot"></div>
  <div class="scale-ring" id="scaleRing"></div>
</div>`,
    css: `.scale-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.scale-target {
  padding: 1rem 2rem;
  border: 1px solid #7c5cff;
  color: #7c5cff;
  border-radius: 8px;
  cursor: none;
}

.scale-dot {
  position: absolute;
  top: 0; left: 0;
  width: 10px; height: 10px;
  background: #fff;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.2s;
  opacity: 0;
}

.scale-ring {
  position: absolute;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s, background 0.3s, border-color 0.3s;
  opacity: 0;
}`,
    js: `var area = document.getElementById('scaleArea');
var target = document.getElementById('scaleTarget');
var dot = document.getElementById('scaleDot');
var ring = document.getElementById('scaleRing');
var SMOOTH = 0.15; // ring lerp factor

var mouseX = 0, mouseY = 0;
var ringX = 0, ringY = 0;

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});
area.addEventListener('mouseenter', function () {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
});
area.addEventListener('mouseleave', function () {
  dot.style.opacity = '0';
  ring.style.opacity = '0';
});

// Grow the ring and hide the dot while hovering the target
target.addEventListener('mouseenter', function () {
  dot.style.transform = 'translate(-50%, -50%) scale(0)';
  ring.style.background = 'rgba(124, 92, 255, 0.2)';
  ring.style.width = '80px';
  ring.style.height = '80px';
  ring.style.borderColor = '#7c5cff';
});
target.addEventListener('mouseleave', function () {
  dot.style.transform = 'translate(-50%, -50%) scale(1)';
  ring.style.background = 'transparent';
  ring.style.width = '40px';
  ring.style.height = '40px';
  ring.style.borderColor = 'rgba(255, 255, 255, 0.5)';
});

function tick() {
  ringX += (mouseX - ringX) * SMOOTH;
  ringY += (mouseY - ringY) * SMOOTH;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 6. Text Cursor ────────────────────────────────────
  text: {
    html: `<div class="text-cursor-area" id="textCursorArea" data-cursor-text="VIEW">
  <img src="https://picsum.photos/id/20/300/200" alt="Example">
  <div class="cursor-text-label" id="cursorTextLabel"></div>
</div>`,
    css: `.text-cursor-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  overflow: hidden;
  cursor: none;
}

/* Accent disc that carries the label */
.cursor-text-label {
  position: absolute;
  top: 0; left: 0;
  width: 60px; height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7c5cff;
  border-radius: 50%;
  color: #fff;
  font-family: sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}`,
    js: `var area = document.getElementById('textCursorArea');
var label = document.getElementById('cursorTextLabel');

area.addEventListener('mouseenter', function () {
  label.textContent = area.dataset.cursorText;
  label.style.opacity = '1';
});
area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  label.style.left = (e.clientX - rect.left) + 'px';
  label.style.top = (e.clientY - rect.top) + 'px';
});
area.addEventListener('mouseleave', function () {
  label.style.opacity = '0';
});`
  },

  // ── 7. Spotlight ──────────────────────────────────────
  spotlight: {
    html: `<div class="spotlight-area" id="spotlightArea">
  <div class="spotlight-layer" id="spotlightLayer"></div>
  <div class="spotlight-content">Spotlight</div>
</div>`,
    css: `.spotlight-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.spotlight-content {
  z-index: 1;
  color: #222;
  font-weight: 700;
  font-size: 1.5rem;
}

/* Dark layer with a transparent hole that follows the cursor */
.spotlight-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: radial-gradient(circle 60px at var(--x, 50%) var(--y, 50%),
    transparent 0%, #000 100%);
  pointer-events: none;
  z-index: 2;
}`,
    js: `var area = document.getElementById('spotlightArea');
var layer = document.getElementById('spotlightLayer');

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  layer.style.setProperty('--x', (e.clientX - rect.left) + 'px');
  layer.style.setProperty('--y', (e.clientY - rect.top) + 'px');
});`
  },

  // ── 8. Sticky Cursor ──────────────────────────────────
  sticky: {
    html: `<div class="sticky-area" id="stickyArea">
  <div class="sticky-item" id="stickyItem">Stick</div>
  <div class="sticky-ring" id="stickyRing"></div>
</div>`,
    css: `.sticky-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.sticky-item {
  width: 100px; height: 100px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: none;
}

.sticky-ring {
  position: absolute;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s, border-radius 0.3s, border-color 0.3s;
  opacity: 0;
}`,
    js: `var area = document.getElementById('stickyArea');
var item = document.getElementById('stickyItem');
var ring = document.getElementById('stickyRing');
var SMOOTH = 0.1; // ring lerp factor

var mouseX = 0, mouseY = 0;   // ring target, relative to area
var ringX = 0, ringY = 0;
var stuck = false;

area.addEventListener('mousemove', function (e) {
  if (stuck) return; // while stuck the target is the item's center
  var rect = area.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});
area.addEventListener('mouseenter', function () { ring.style.opacity = '1'; });
area.addEventListener('mouseleave', function () { ring.style.opacity = '0'; });

item.addEventListener('mouseenter', function () {
  stuck = true;
  var aRect = area.getBoundingClientRect();
  var r = item.getBoundingClientRect();
  mouseX = r.left - aRect.left + r.width / 2;
  mouseY = r.top - aRect.top + r.height / 2;
  ring.style.borderRadius = '12px';
  ring.style.width = '100px';
  ring.style.height = '100px';
  ring.style.borderColor = '#7c5cff';
});
item.addEventListener('mouseleave', function () {
  stuck = false;
  ring.style.borderRadius = '50%';
  ring.style.width = '40px';
  ring.style.height = '40px';
  ring.style.borderColor = 'rgba(255,255,255,0.5)';
});

function tick() {
  ringX += (mouseX - ringX) * SMOOTH;
  ringY += (mouseY - ringY) * SMOOTH;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 9. Glitch Cursor ──────────────────────────────────
  glitch: {
    html: `<div class="glitch-area" id="glitchArea">
  <h2>Glitch Zone</h2>
  <div class="glitch-dot" id="glitchDot"></div>
  <div class="glitch-ring" id="glitchRing"></div>
</div>`,
    css: `.glitch-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.glitch-dot {
  position: absolute;
  top: 0; left: 0;
  width: 10px; height: 10px;
  background: #fff;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.glitch-ring {
  position: absolute;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
}`,
    js: `var area = document.getElementById('glitchArea');
var dot = document.getElementById('glitchDot');
var ring = document.getElementById('glitchRing');
var JITTER = 20;     // max px offset
var INTERVAL = 50;   // ms between glitch jumps
var SMOOTH = 0.1;    // ring lerp factor

var mouseX = 0, mouseY = 0;
var ringX = 0, ringY = 0;
var offX = 0, offY = 0;
var glitchTimer = null;

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

area.addEventListener('mouseenter', function () {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
  glitchTimer = setInterval(function () {
    offX = (Math.random() - 0.5) * JITTER;
    offY = (Math.random() - 0.5) * JITTER;
  }, INTERVAL);
});

area.addEventListener('mouseleave', function () {
  clearInterval(glitchTimer);
  offX = 0; offY = 0;
  dot.style.opacity = '0';
  ring.style.opacity = '0';
});

function tick() {
  ringX += (mouseX - ringX) * SMOOTH;
  ringY += (mouseY - ringY) * SMOOTH;
  // Dot and ring are shoved in opposite directions, plus a skew on the ring
  dot.style.left = (mouseX - offX) + 'px';
  dot.style.top = (mouseY - offY) + 'px';
  ring.style.left = (ringX + offX) + 'px';
  ring.style.top = (ringY + offY) + 'px';
  ring.style.transform = 'translate(-50%, -50%) skew(' + offX + 'deg)';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 10. Arrow Rotate ──────────────────────────────────
  arrow: {
    html: `<div class="arrow-area" id="arrowArea">
  <h2>Direction</h2>
  <div class="cursor-arrow" id="cursorArrow"></div>
</div>`,
    css: `.arrow-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

/* CSS triangle pointing up; JS rotates it toward the movement direction */
.cursor-arrow {
  position: absolute;
  top: 0; left: 0;
  width: 0; height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid #7c5cff;
  pointer-events: none;
  transform-origin: center;
  opacity: 0;
}`,
    js: `var area = document.getElementById('arrowArea');
var arrow = document.getElementById('cursorArrow');
var MIN_MOVE = 3;   // px — ignore sub-pixel jitter
var TURN = 0.25;    // rotation smoothing factor

var lastX = 0, lastY = 0;
var angle = 0;        // smoothed angle actually rendered
var targetAngle = 0;  // latest raw movement angle

area.addEventListener('mouseenter', function (e) {
  lastX = e.clientX;
  lastY = e.clientY;
  angle = targetAngle;
  arrow.style.opacity = '1';
});
area.addEventListener('mouseleave', function () {
  arrow.style.opacity = '0';
});

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  var dx = e.clientX - lastX;
  var dy = e.clientY - lastY;
  if (Math.sqrt(dx * dx + dy * dy) > MIN_MOVE) {
    targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    lastX = e.clientX;
    lastY = e.clientY;
  }
  arrow.style.left = (e.clientX - rect.left) + 'px';
  arrow.style.top = (e.clientY - rect.top) + 'px';
});

function tick() {
  // Rotate along the shortest path so diagonals don't spin the long way round
  var diff = targetAngle - angle;
  diff = ((diff + 180) % 360 + 360) % 360 - 180;
  angle += diff * TURN;
  arrow.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg)';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 11. Image Trail ───────────────────────────────────
  imgTrail: {
    html: `<div class="img-trail-area" id="imgTrailArea">
  <h2>Image Trail</h2>
</div>`,
    css: `.img-trail-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  font-family: sans-serif;
}

.trail-img {
  position: absolute;
  width: 80px; height: 60px;
  object-fit: cover;
  pointer-events: none;
  opacity: 0;
  border-radius: 4px;
  transition: opacity 0.3s, transform 0.3s;
}`,
    js: `var area = document.getElementById('imgTrailArea');
var IMG_SRC = 'https://picsum.photos/id/10/80/60';
var SPAWN_MS = 100; // min ms between spawned images
var SHOW_MS = 500;  // how long each image stays visible

var lastTime = 0;

area.addEventListener('mousemove', function (e) {
  var now = Date.now();
  if (now - lastTime < SPAWN_MS) return; // limit spawn rate
  lastTime = now;

  var rect = area.getBoundingClientRect();
  var img = document.createElement('img');
  img.src = IMG_SRC;
  img.className = 'trail-img';
  img.style.left = (e.clientX - rect.left) + 'px';
  img.style.top = (e.clientY - rect.top) + 'px';
  img.style.transform = 'translate(-50%, -50%) scale(0.5)';
  area.appendChild(img);

  requestAnimationFrame(function () {
    img.style.opacity = '0.8';
    img.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  setTimeout(function () {
    img.style.opacity = '0';
    img.style.transform = 'translate(-50%, -50%) scale(0.5)';
    setTimeout(function () { img.remove(); }, 300);
  }, SHOW_MS);
});`
  },

  // ── 12. Zoom Lens ─────────────────────────────────────
  zoom: {
    html: `<div class="zoom-area" id="zoomArea">
  <img src="https://picsum.photos/id/50/300/200" alt="Zoom">
  <div class="zoom-lens" id="zoomLens"></div>
</div>`,
    css: `.zoom-area {
  position: relative;
  height: 240px;
  overflow: hidden;
  cursor: none;
}

.zoom-area img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.zoom-lens {
  position: absolute;
  width: 100px; height: 100px;
  border-radius: 50%;
  border: 2px solid #fff;
  /* Same image as the area, blown up to act as the magnified view */
  background-image: url('https://picsum.photos/id/50/300/200');
  background-size: 300% 200%;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}`,
    js: `var area = document.getElementById('zoomArea');
var lens = document.getElementById('zoomLens');

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  lens.style.left = x + 'px';
  lens.style.top = y + 'px';

  // Pan the magnified background to the point under the lens
  var bgX = (x / rect.width) * 100;
  var bgY = (y / rect.height) * 100;
  lens.style.backgroundPosition = bgX + '% ' + bgY + '%';
});

area.addEventListener('mouseenter', function () {
  lens.style.opacity = '1';
  lens.style.transform = 'translate(-50%, -50%) scale(1)';
});

area.addEventListener('mouseleave', function () {
  lens.style.opacity = '0';
  lens.style.transform = 'translate(-50%, -50%) scale(0)';
});`
  },

  // ── 13. Emoji Cursor ──────────────────────────────────
  emoji: {
    html: `<div class="emoji-area" id="emojiArea" data-emoji="✨">
  <h2>Sparkle</h2>
</div>`,
    css: `.emoji-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.emoji-cursor {
  position: absolute;
  font-size: 40px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}`,
    js: `var area = document.getElementById('emojiArea');

var emojiEl = document.createElement('div');
emojiEl.className = 'emoji-cursor';
emojiEl.textContent = area.dataset.emoji;
area.appendChild(emojiEl);

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  emojiEl.style.left = (e.clientX - rect.left) + 'px';
  emojiEl.style.top = (e.clientY - rect.top) + 'px';
});
area.addEventListener('mouseenter', function () { emojiEl.style.opacity = '1'; });
area.addEventListener('mouseleave', function () { emojiEl.style.opacity = '0'; });`
  },

  // ── 14. Ripple Click ──────────────────────────────────
  ripple: {
    html: `<div class="ripple-area" id="rippleArea">
  <h2>Click Me</h2>
</div>`,
    css: `.ripple-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  font-family: sans-serif;
}

.ripple-ring {
  position: absolute;
  border: 2px solid #7c5cff;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
}`,
    js: `var area = document.getElementById('rippleArea');
var MAX_SIZE = 200; // px — ripple diameter at the end
var DURATION = 600; // ms

area.addEventListener('click', function (e) {
  var rect = area.getBoundingClientRect();
  var rip = document.createElement('div');
  rip.className = 'ripple-ring';
  rip.style.left = (e.clientX - rect.left) + 'px';
  rip.style.top = (e.clientY - rect.top) + 'px';
  area.appendChild(rip);

  rip.animate([
    { width: '10px', height: '10px', opacity: 1 },
    { width: MAX_SIZE + 'px', height: MAX_SIZE + 'px', opacity: 0 }
  ], { duration: DURATION, easing: 'ease-out' }).onfinish = function () {
    rip.remove();
  };
});`
  },

  // ── 15. Elastic Line ──────────────────────────────────
  elasticLine: {
    html: `<div class="elastic-line-area" id="elasticArea">
  <svg class="elastic-svg" width="100%" height="100%">
    <path id="elasticPath" d="M0 100 Q 150 100 300 100" stroke="#fff" fill="none" stroke-width="2"/>
  </svg>
</div>`,
    css: `.elastic-line-area {
  position: relative;
  height: 200px;
  background: #12121a;
  overflow: hidden;
}

.elastic-svg { pointer-events: none; }`,
    js: `var area = document.getElementById('elasticArea');
var path = document.getElementById('elasticPath');
var LINE_Y = 100; // px — the line's resting height

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  // The cursor is the quadratic control point, bending the line toward it
  path.setAttribute('d', 'M0 ' + LINE_Y + ' Q ' + x + ' ' + y + ' ' + rect.width + ' ' + LINE_Y);
});

area.addEventListener('mouseleave', function () {
  var w = area.offsetWidth;
  path.setAttribute('d', 'M0 ' + LINE_Y + ' Q ' + (w / 2) + ' ' + LINE_Y + ' ' + w + ' ' + LINE_Y);
});`
  },

  // ── 16. Noise Aura ────────────────────────────────────
  noise: {
    html: `<div class="noise-area" id="noiseArea">
  <h2>Noise</h2>
</div>`,
    css: `.noise-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.noise-canvas {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}`,
    js: `var area = document.getElementById('noiseArea');
var SIZE = 120; // px — aura canvas size
var R = SIZE / 2;

var canvas = document.createElement('canvas');
canvas.width = SIZE;
canvas.height = SIZE;
canvas.className = 'noise-canvas';
area.appendChild(canvas);
var ctx = canvas.getContext('2d');
var noiseOn = false;

function drawNoise() {
  var imgData = ctx.createImageData(SIZE, SIZE);
  var d = imgData.data;
  for (var i = 0; i < d.length; i += 4) {
    var px = (i / 4) % SIZE - R;
    var py = Math.floor(i / 4 / SIZE) - R;
    var dist = Math.sqrt(px * px + py * py);
    if (dist > R) continue; // circular mask
    var v = Math.random() * 255;
    var alpha = Math.max(0, 1 - dist / R) * 180; // fade toward the edge
    d[i] = v; d[i + 1] = v; d[i + 2] = v;
    d[i + 3] = Math.random() > 0.6 ? alpha : 0;
  }
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.putImageData(imgData, 0, 0);
  if (noiseOn) requestAnimationFrame(drawNoise);
}

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  canvas.style.left = (e.clientX - rect.left) + 'px';
  canvas.style.top = (e.clientY - rect.top) + 'px';
});
area.addEventListener('mouseenter', function () {
  noiseOn = true;
  canvas.style.opacity = '1';
  drawNoise();
});
area.addEventListener('mouseleave', function () {
  noiseOn = false;
  canvas.style.opacity = '0';
});`
  },

  // ── 17. Video Cursor ──────────────────────────────────
  video: {
    html: `<div class="video-cursor-area" id="videoArea">
  <h2>Video Hover</h2>
</div>`,
    css: `.video-cursor-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
}

.video-float {
  position: absolute;
  width: 120px; height: 120px;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.3s;
  border: 2px solid #7c5cff;
}

.video-float video {
  width: 100%; height: 100%;
  object-fit: cover;
}`,
    js: `var area = document.getElementById('videoArea');
var VIDEO_SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

var videoFloat = document.createElement('div');
videoFloat.className = 'video-float';
var v = document.createElement('video');
v.src = VIDEO_SRC;
v.loop = true;
v.muted = true;
v.playsInline = true;
videoFloat.appendChild(v);
area.appendChild(videoFloat);

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  videoFloat.style.left = (e.clientX - rect.left) + 'px';
  videoFloat.style.top = (e.clientY - rect.top) + 'px';
});
area.addEventListener('mouseenter', function () {
  videoFloat.style.transform = 'translate(-50%, -50%) scale(1)';
  v.play();
});
area.addEventListener('mouseleave', function () {
  videoFloat.style.transform = 'translate(-50%, -50%) scale(0)';
  v.pause();
});`
  },

  // ── 18. Perspective Tilt ──────────────────────────────
  perspective: {
    html: `<div class="perspective-area" id="perspectiveArea">
  <div class="tilt-plane" id="tiltPlane"></div>
</div>`,
    css: `.perspective-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  overflow: hidden;
  perspective: 600px;
}

.tilt-plane {
  width: 100px; height: 100px;
  background: linear-gradient(135deg, #7c5cff, #f0f);
  border-radius: 12px;
  will-change: transform;
}`,
    js: `var area = document.getElementById('perspectiveArea');
var plane = document.getElementById('tiltPlane');
var MAX_TILT = 20; // deg at the area's edges

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var rotY = (x / rect.width - 0.5) * MAX_TILT;
  var rotX = (y / rect.height - 0.5) * MAX_TILT;
  plane.style.transform = 'rotateX(' + (-rotX) + 'deg) rotateY(' + rotY + 'deg)';
});

area.addEventListener('mouseleave', function () {
  plane.style.transform = 'rotateX(0deg) rotateY(0deg)';
});`
  },

  // ── 19. Dot Grid Repel ────────────────────────────────
  dotGrid: {
    html: `<div class="dot-grid-area" id="dotGridArea"></div>`,
    css: `.dot-grid-area {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(8, 1fr);
  height: 240px;
  background: #12121a;
  overflow: hidden;
}

.grid-dot {
  width: 4px; height: 4px;
  background: #555;
  border-radius: 50%;
  margin: auto;
  transition: transform 0.2s ease-out;
}`,
    js: `var area = document.getElementById('dotGridArea');
var COLS = 10, ROWS = 8;
var RANGE = 60;     // px — repel radius
var STRENGTH = 0.5; // push per px inside the radius

for (var i = 0; i < COLS * ROWS; i++) {
  var d = document.createElement('div');
  d.className = 'grid-dot';
  area.appendChild(d);
}
var dots = area.querySelectorAll('.grid-dot');

area.addEventListener('mousemove', function (e) {
  var mx = e.clientX;
  var my = e.clientY;

  dots.forEach(function (dot) {
    var r = dot.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var dist = Math.sqrt(Math.pow(mx - cx, 2) + Math.pow(my - cy, 2));

    if (dist < RANGE) {
      var angle = Math.atan2(my - cy, mx - cx);
      var force = (RANGE - dist) * STRENGTH;
      // Push away from the cursor (negative direction)
      var moveX = Math.cos(angle) * -force;
      var moveY = Math.sin(angle) * -force;
      dot.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
    } else {
      dot.style.transform = 'translate(0, 0)';
    }
  });
});

area.addEventListener('mouseleave', function () {
  dots.forEach(function (d) { d.style.transform = 'translate(0, 0)'; });
});`
  },

  // ── 20. Click Progress ────────────────────────────────
  progress: {
    html: `<div class="progress-area" id="progressArea">
  <h2>Hold Click</h2>
</div>`,
    css: `.progress-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  color: #f0f0f5;
  overflow: hidden;
  cursor: none;
  font-family: sans-serif;
  user-select: none;
}

.progress-canvas {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}`,
    js: `var area = document.getElementById('progressArea');
var SIZE = 60;          // px — canvas size
var FILL_SPEED = 0.02;  // progress per frame while holding
var DRAIN_SPEED = 0.05; // progress per frame when released

var canvas = document.createElement('canvas');
canvas.width = SIZE;
canvas.height = SIZE;
canvas.className = 'progress-canvas';
area.appendChild(canvas);
var ctx = canvas.getContext('2d');
var progress = 0;
var isHolding = false;

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);

  // Track ring
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, 25, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Progress arc, starting at 12 o'clock
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, 25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.strokeStyle = '#7c5cff';
  ctx.lineWidth = 4;
  ctx.stroke();

  if (isHolding && progress < 1) {
    progress += FILL_SPEED;
    requestAnimationFrame(draw);
  } else if (!isHolding && progress > 0) {
    progress -= DRAIN_SPEED;
    if (progress < 0) progress = 0;
    requestAnimationFrame(draw);
  }
}

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  canvas.style.left = (e.clientX - rect.left) + 'px';
  canvas.style.top = (e.clientY - rect.top) + 'px';
});
area.addEventListener('mousedown', function () { isHolding = true; draw(); });
area.addEventListener('mouseup', function () { isHolding = false; });
area.addEventListener('mouseenter', function () {
  canvas.style.opacity = '1';
  isHolding = false;
  progress = 0;
  draw();
});
area.addEventListener('mouseleave', function () {
  canvas.style.opacity = '0';
  isHolding = false;
});`
  },

  // ── 21. Particle Sparks ───────────────────────────────
  sparks: {
    html: `<div class="sparks-area" id="sparksArea">
  <h2>Sparks</h2>
  <canvas class="sparks-canvas" id="sparksCanvas"></canvas>
</div>`,
    css: `.sparks-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  overflow: hidden;
  font-family: sans-serif;
}

.sparks-area h2 { color: #333; }

.sparks-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}`,
    js: `var area = document.getElementById('sparksArea');
var canvas = document.getElementById('sparksCanvas');
var ctx = canvas.getContext('2d');
var SPAWN = 3;        // particles per mousemove event
var GRAVITY = 0.05;
var DECAY = 0.02;     // life lost per frame

var particles = [];

function resize() {
  canvas.width = area.clientWidth;
  canvas.height = area.clientHeight;
}
resize();
window.addEventListener('resize', resize);

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  for (var i = 0; i < SPAWN; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 1,
      life: 1,
      size: 1 + Math.random() * 2.5,
      hue: 255 + Math.random() * 40 // purple range
    });
  }
});

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(function (p) { return p.life > 0; });
  particles.forEach(function (p) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += GRAVITY;
    p.life -= DECAY;
    if (p.life <= 0) return; // negative radius would throw
    ctx.globalAlpha = p.life;
    ctx.fillStyle = 'hsl(' + p.hue + ', 90%, 70%)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0, p.size * p.life), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 22. Rope Trail ────────────────────────────────────
  rope: {
    html: `<div class="rope-area" id="ropeArea">
  <h2>Rope</h2>
  <svg class="rope-svg" id="ropeSvg"><polyline fill="none" stroke="#7c5cff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points=""/></svg>
</div>`,
    css: `.rope-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12121a;
  overflow: hidden;
  font-family: sans-serif;
}

.rope-area h2 { color: #333; }

.rope-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}`,
    js: `var area = document.getElementById('ropeArea');
var line = document.querySelector('#ropeSvg polyline');
var SEGMENTS = 18;
// Per-segment lag in ms. Frame-rate independent, so the rope has the same length
// and slack at 60Hz and 144Hz instead of snapping tight on fast displays.
var SEG_TAU = 38;

var pts = [];
for (var i = 0; i < SEGMENTS; i++) pts.push({ x: 0, y: 0 });
var ropeX = 0, ropeY = 0, inside = false;

area.addEventListener('mousemove', function (e) {
  var rect = area.getBoundingClientRect();
  ropeX = e.clientX - rect.left;
  ropeY = e.clientY - rect.top;
  if (!inside) {
    // Snap the whole rope to the entry point to avoid a whip from (0,0)
    pts.forEach(function (p) { p.x = ropeX; p.y = ropeY; });
    inside = true;
  }
});
area.addEventListener('mouseleave', function () { inside = false; });

var ropeLast = 0;

function tick(now) {
  var dt = ropeLast ? Math.min(now - ropeLast, 64) : 16.7;
  ropeLast = now;
  var a = 1 - Math.exp(-dt / SEG_TAU);

  // Head is pinned to the cursor; each segment chases the one before it,
  // so the rope always trails behind instead of drifting ahead
  pts[0].x = ropeX;
  pts[0].y = ropeY;
  for (var i = 1; i < SEGMENTS; i++) {
    pts[i].x += (pts[i - 1].x - pts[i].x) * a;
    pts[i].y += (pts[i - 1].y - pts[i].y) * a;
  }
  line.setAttribute('points', pts.map(function (p) {
    return p.x.toFixed(1) + ',' + p.y.toFixed(1);
  }).join(' '));
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  }
};
