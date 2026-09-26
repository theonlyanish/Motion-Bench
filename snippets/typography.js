/**
 * Standalone code snippets for the Typography page (typography.html).
 * Each entry is keyed by the section's data-panel attribute and holds
 * self-contained, copy-paste-ready html / css / js strings.
 * Rendered by code-panel.js.
 */
window.EFFECT_SNIPPETS = {

  // ── 1. Variable Font Axes ─────────────────────────────
  variable: {
    html: `<!-- Requires a variable font, e.g. Roboto Flex from Google Fonts:
<link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,slnt,wdth,wght@8..144,-10..0,25..151,100..1000&display=swap" rel="stylesheet"> -->

<label>Weight <input type="range" id="weight" min="100" max="1000" value="400"></label>
<p class="variable-headline" id="variableHeadline">Morph Me</p>`,
    css: `.variable-headline {
  font-family: 'Roboto Flex', sans-serif;
  font-size: 3.5rem;
  font-variation-settings: 'wght' 400, 'wdth' 100, 'slnt' 0;
}`,
    js: `var slider = document.getElementById('weight');
var headline = document.getElementById('variableHeadline');

slider.addEventListener('input', function () {
  headline.style.fontVariationSettings =
    "'wght' " + slider.value + ", 'wdth' 100, 'slnt' 0";
});`
  },

  // ── 2. Wave Distort ───────────────────────────────────
  wave: {
    html: `<p class="wave-headline" id="waveHeadline"></p>`,
    css: `.wave-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.wave-char {
  display: inline-block;
  will-change: transform;
}`,
    js: `var headline = document.getElementById('waveHeadline');
var text = 'Wave Distortion';
var AMPLITUDE = 20;  // px
var FREQUENCY = 5;   // full sine cycles across the text

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="wave-char">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');
var chars = headline.querySelectorAll('.wave-char');

var phase = 0;
function tick() {
  phase += 0.035;
  chars.forEach(function (el, i) {
    var y = Math.sin((i / (chars.length - 1)) * Math.PI * 2 * FREQUENCY + phase) * AMPLITUDE;
    el.style.transform = 'translateY(' + y + 'px)';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 3. Noise Jitter ───────────────────────────────────
  jitter: {
    html: `<p class="jitter-headline" id="jitterHeadline"></p>`,
    css: `.jitter-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.jitter-char {
  display: inline-block;
  will-change: transform;
}`,
    js: `var headline = document.getElementById('jitterHeadline');
var text = 'Noise Jitter';
var JITTER = 5;   // max px displacement
var SPEED = 0.06;

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="jitter-char">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');
var chars = headline.querySelectorAll('.jitter-char');
var seeds = Array.from(chars, function () { return Math.random() * 1000; });

// fract() of a sine hash — cheap 1D pseudo-noise
function noise1D(x) {
  var v = Math.sin(x * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

var phase = 0;
function tick() {
  phase += SPEED;
  chars.forEach(function (el, i) {
    var tx = (noise1D(seeds[i] + phase) - 0.5) * 2 * JITTER;
    var ty = (noise1D(seeds[i] + 100 + phase) - 0.5) * 2 * JITTER;
    el.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 4. Text on Path ───────────────────────────────────
  path: {
    html: `<svg viewBox="0 0 700 200" width="100%">
  <path id="textPath" d="M 50 120 Q 350 84 650 120" fill="none" stroke="none"/>
  <!-- text-anchor="middle" + startOffset="50%" centres the run on the curve;
       left-aligned at 0% it hangs off the start of the path -->
  <text class="path-text" text-anchor="middle">
    <textPath href="#textPath" startOffset="50%">Text follows the path</textPath>
  </text>
</svg>`,
    css: `.path-text {
  font-size: 2rem;
  font-weight: 600;
  fill: #f0f0f5;
}`,
    js: `var pathEl = document.getElementById('textPath');

// viewBox is 0 0 700 200 at 1:1 scale, .path-text is 2rem (32px).
// Glyph ink runs from baseline-capHeight to baseline+descender, so the ink's
// centre sits above the baseline — measured at 11.3px for this face/size.
var BASELINE = 111.3;
var MAX_AMP = 60;
// On a curved path the glyphs rotate with the tangent, which inflates the ink
// box upward in proportion to the arc depth. Measured at 0.146px per unit amp.
var TILT_COMP = 0.146;

// For a quadratic Bezier the mean y over t is (y0 + y1 + y2)/3. Pinning that
// mean (rather than the endpoints) is what keeps the text vertically centred at
// every curve value: raising the control point by \`amp\` drops the two ends by
// amp/2, leaving the mean unchanged.
//   mean = (2*(m + amp/2) + (m - amp))/3 = m
function buildPath(curveVal) {
  var amp = (curveVal / 100) * MAX_AMP;
  var mean = BASELINE + TILT_COMP * amp;
  var cpY = (mean - amp).toFixed(1);
  var endY = (mean + amp / 2).toFixed(1);
  pathEl.setAttribute('d', 'M 50 ' + endY + ' Q 350 ' + cpY + ' 650 ' + endY);
}

buildPath(40); // curveVal runs -100..100

// Optional: animate the curve by sweeping curveVal
var phase = 0;
function tick() {
  phase += 0.02;
  buildPath(Math.sin(phase) * 100);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 5. Magnetic Letters ───────────────────────────────
  magnetic: {
    html: `<p class="magnetic-headline">
  <span class="mag-char">M</span><span class="mag-char">a</span><span class="mag-char">g</span><span class="mag-char">n</span><span class="mag-char">e</span><span class="mag-char">t</span><span class="mag-char">i</span><span class="mag-char">c</span>
</p>`,
    css: `.magnetic-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.mag-char {
  display: inline-block;
  will-change: transform;
}`,
    js: `var chars = document.querySelectorAll('.mag-char');
var RADIUS = 120;    // px — attraction range
var STRENGTH = 0.35;
var SMOOTH = 0.12;   // lerp factor

var mouseX = -9999, mouseY = -9999;
var targets = [], current = [];
chars.forEach(function () {
  targets.push({ x: 0, y: 0 });
  current.push({ x: 0, y: 0 });
});

document.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function tick() {
  chars.forEach(function (el, i) {
    var r = el.getBoundingClientRect();
    var dx = mouseX - (r.left + r.width / 2);
    var dy = mouseY - (r.top + r.height / 2);
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < RADIUS && dist > 0) {
      var f = (1 - dist / RADIUS) * STRENGTH;
      targets[i].x = (dx / dist) * f * 30;
      targets[i].y = (dy / dist) * f * 30;
    } else {
      targets[i].x *= 0.9;
      targets[i].y *= 0.9;
    }
    current[i].x += (targets[i].x - current[i].x) * SMOOTH;
    current[i].y += (targets[i].y - current[i].y) * SMOOTH;
    el.style.transform = 'translate(' + current[i].x + 'px, ' + current[i].y + 'px)';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 6. Cursor Repulsion ───────────────────────────────
  repulsion: {
    html: `<p class="repel-headline">
  <span class="repel-char">R</span><span class="repel-char">e</span><span class="repel-char">p</span><span class="repel-char">e</span><span class="repel-char">l</span><span class="repel-char">&nbsp;</span><span class="repel-char">M</span><span class="repel-char">e</span>
</p>`,
    css: `.repel-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.repel-char {
  display: inline-block;
  will-change: transform;
}`,
    js: `var chars = document.querySelectorAll('.repel-char');
var MAX_DIST = 150;   // px — repulsion range
var STRENGTH = 1.2;
var SMOOTH = 0.18;

var mouseX = -9999, mouseY = -9999;
var positions = [];
chars.forEach(function () { positions.push({ x: 0, y: 0 }); });

document.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function tick() {
  chars.forEach(function (el, i) {
    var r = el.getBoundingClientRect();
    var dx = (r.left + r.width / 2) - mouseX;
    var dy = (r.top + r.height / 2) - mouseY;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
    if (dist < MAX_DIST) {
      var force = (1 - dist / MAX_DIST) * STRENGTH * 80;
      positions[i].x += ((dx / dist) * force - positions[i].x) * SMOOTH;
      positions[i].y += ((dy / dist) * force - positions[i].y) * SMOOTH;
    } else {
      positions[i].x *= 0.92;
      positions[i].y *= 0.92;
    }
    el.style.transform = 'translate(' + positions[i].x + 'px, ' + positions[i].y + 'px)';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 7. 3D Tilt ────────────────────────────────────────
  tilt3d: {
    html: `<div class="tilt3d-wrapper">
  <p class="tilt3d-headline" id="tilt3dHeadline">Tilt Me</p>
</div>`,
    css: `.tilt3d-wrapper {
  perspective: 800px;
  display: flex;
  justify-content: center;
}

.tilt3d-headline {
  font-size: 3.5rem;
  font-weight: 600;
  transform-style: preserve-3d;
  will-change: transform;
}`,
    js: `var headline = document.getElementById('tilt3dHeadline');

document.addEventListener('mousemove', function (e) {
  var dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  var dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  headline.style.transform =
    'perspective(800px) rotateX(' + (-dy * 20) + 'deg) rotateY(' + (dx * 25) + 'deg)';
});`
  },

  // ── 8. Glitch ─────────────────────────────────────────
  glitch: {
    html: `<p class="glitch-headline">
  <span class="glitch-text glitch-main">Glitch Effect</span>
  <span class="glitch-text glitch-r" aria-hidden="true">Glitch Effect</span>
  <span class="glitch-text glitch-g" aria-hidden="true">Glitch Effect</span>
</p>`,
    css: `.glitch-headline {
  position: relative;
  display: inline-block;
  font-size: 3.5rem;
  font-weight: 600;
}

.glitch-text {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
}

.glitch-main {
  position: relative;
  color: #f0f0f5;
}

.glitch-r { color: #ff006e; mix-blend-mode: screen; }
.glitch-g { color: #00f5d4; mix-blend-mode: screen; }`,
    js: `var glitchR = document.querySelector('.glitch-r');
var glitchG = document.querySelector('.glitch-g');
var OFFSET = 4;    // max px displacement
var OPACITY = 0.25;

function tick() {
  var rx = (Math.random() - 0.5) * 2 * OFFSET;
  var ry = (Math.random() - 0.5) * 2 * OFFSET;
  var gx = (Math.random() - 0.5) * 2 * OFFSET;
  var gy = (Math.random() - 0.5) * 2 * OFFSET;
  glitchR.style.transform = 'translate(' + rx + 'px, ' + ry + 'px)';
  glitchG.style.transform = 'translate(' + gx + 'px, ' + gy + 'px)';
  glitchR.style.opacity = OPACITY;
  glitchG.style.opacity = OPACITY;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 9. Scale Wave ─────────────────────────────────────
  scaleWave: {
    html: `<p class="scale-wave-headline" id="scaleWaveHeadline"></p>`,
    css: `.scale-wave-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.scale-char {
  display: inline-block;
  transform-origin: center bottom;
  will-change: transform;
}`,
    js: `var headline = document.getElementById('scaleWaveHeadline');
var text = 'Scale Wave';
var AMPLITUDE = 0.25; // scale variation
var SPEED = 0.1;

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="scale-char">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');
var chars = headline.querySelectorAll('.scale-char');

var phase = 0;
function tick() {
  phase += SPEED;
  chars.forEach(function (el, i) {
    var s = 1 + Math.sin(phase + i * 0.5) * AMPLITUDE;
    el.style.transform = 'scaleY(' + s + ')';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 10. Blur on Distance ──────────────────────────────
  blurDistance: {
    html: `<p class="blur-distance-headline">
  <span class="blur-char">S</span><span class="blur-char">h</span><span class="blur-char">a</span><span class="blur-char">r</span><span class="blur-char">p</span><span class="blur-char">&nbsp;</span><span class="blur-char">H</span><span class="blur-char">e</span><span class="blur-char">r</span><span class="blur-char">e</span>
</p>`,
    css: `.blur-distance-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.blur-char {
  display: inline-block;
  will-change: filter;
  transition: filter 0.1s ease-out;
}`,
    js: `var chars = document.querySelectorAll('.blur-char');
var MAX_DIST = 120; // px — fully blurred beyond this distance
var MAX_BLUR = 8;   // px

var mouseX = -9999, mouseY = -9999;
document.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function tick() {
  chars.forEach(function (el) {
    var r = el.getBoundingClientRect();
    var dx = (r.left + r.width / 2) - mouseX;
    var dy = (r.top + r.height / 2) - mouseY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var blur = Math.min(MAX_BLUR, (dist / MAX_DIST) * MAX_BLUR);
    el.style.filter = 'blur(' + blur + 'px)';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 11. Color Chase ───────────────────────────────────
  colorChase: {
    html: `<div class="color-chase-wrapper">
  <p class="color-chase-headline" id="colorChaseHeadline">Chase the Light</p>
</div>`,
    css: `.color-chase-headline {
  font-size: 3.5rem;
  font-weight: 600;
  background: linear-gradient(90deg,
    #f0f0f5 0%, #f0f0f5 35%, #7c5cff 50%, #f0f0f5 65%, #f0f0f5 100%);
  background-size: 200% 100%;
  background-position: 50% 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background-position 0.08s ease-out;
}`,
    js: `var headline = document.getElementById('colorChaseHeadline');
var wrapper = document.querySelector('.color-chase-wrapper');

wrapper.addEventListener('mousemove', function (e) {
  var rect = wrapper.getBoundingClientRect();
  var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  headline.style.backgroundPosition = ((1 - x) * 100) + '% 0';
});`
  },

  // ── 12. Staggered Reveal ──────────────────────────────
  stagger: {
    html: `<p class="stagger-headline" id="staggerHeadline"></p>`,
    css: `.stagger-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.stagger-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(24px);
  will-change: transform, opacity;
}

.stagger-char.revealed {
  opacity: 1;
  transform: translateY(0);
}`,
    js: `var headline = document.getElementById('staggerHeadline');
var text = 'Hello World';
var DELAY = 50; // ms between letters
var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="stagger-char">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');
var chars = headline.querySelectorAll('.stagger-char');

requestAnimationFrame(function () {
  chars.forEach(function (el, i) {
    el.style.transition =
      'opacity 0.5s ' + EASE + ' ' + (i * DELAY) + 'ms, ' +
      'transform 0.5s ' + EASE + ' ' + (i * DELAY) + 'ms';
    el.classList.add('revealed');
  });
});`
  },

  // ── 13. Spring Letters ────────────────────────────────
  spring: {
    html: `<p class="spring-headline" id="springHeadline"></p>`,
    css: `.spring-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.spring-char {
  display: inline-block;
  transform-origin: center bottom;
  will-change: transform;
}`,
    js: `var headline = document.getElementById('springHeadline');
var text = 'Spring';
var STIFFNESS = 400;
var DAMPING = 15;
var LIFT = -12; // px hover target

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="spring-char">' + c + '</span>';
}).join('');
var chars = headline.querySelectorAll('.spring-char');

var targets = [], state = [];
chars.forEach(function (el, i) {
  targets[i] = 0;
  state[i] = { y: 0, v: 0 };
  el.addEventListener('mouseenter', function () { targets[i] = LIFT; });
  el.addEventListener('mouseleave', function () { targets[i] = 0; });
});

function tick() {
  var dt = 1 / 60;
  chars.forEach(function (el, i) {
    var s = state[i];
    var force = (targets[i] - s.y) * STIFFNESS - s.v * DAMPING;
    s.v += force * dt;
    s.y += s.v * dt;
    s.v *= 0.98;
    if (Math.abs(s.v) < 0.01 && Math.abs(targets[i] - s.y) < 0.01) {
      s.y = targets[i];
      s.v = 0;
    }
    el.style.transform = 'translateY(' + s.y + 'px)';
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 14. Scroll Into View ──────────────────────────────
  scrollView: {
    html: `<p class="scroll-view-headline" id="scrollViewHeadline"></p>`,
    css: `.scroll-view-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.scroll-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  will-change: transform, opacity;
}

.scroll-char.in-view {
  opacity: 1;
  transform: translateY(0);
}`,
    js: `var headline = document.getElementById('scrollViewHeadline');
var text = 'In View';
var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

headline.innerHTML = text.split('').map(function (c, i) {
  return '<span class="scroll-char" style="transition: ' +
    'opacity 0.6s ' + (i * 0.06) + 's ' + EASE + ', ' +
    'transform 0.6s ' + (i * 0.06) + 's ' + EASE + '">' +
    (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');
var chars = headline.querySelectorAll('.scroll-char');

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      chars.forEach(function (el) { el.classList.add('in-view'); });
    }
  });
}, { threshold: 0.1 });
observer.observe(headline);`
  },

  // ── 15. Hover Pop (pure CSS) ──────────────────────────
  hoverPop: {
    html: `<p class="hover-pop-headline">
  <span class="hover-pop-char">H</span><span class="hover-pop-char">o</span><span class="hover-pop-char">v</span><span class="hover-pop-char">e</span><span class="hover-pop-char">r</span><span class="hover-pop-char">&nbsp;</span><span class="hover-pop-char">M</span><span class="hover-pop-char">e</span>
</p>`,
    css: `.hover-pop-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.hover-pop-char {
  display: inline-block;
  transform-origin: center bottom;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.hover-pop-char:hover {
  transform: scale(1.15) translateY(-4px);
  color: #7c5cff;
}`
  },

  // ── 16. Scramble Reveal ───────────────────────────────
  scramble: {
    html: `<p class="scramble-headline" id="scrambleHeadline"></p>`,
    css: `.scramble-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.scramble-char {
  display: inline-block;
  min-width: 0.6em;
  font-variant-numeric: tabular-nums;
}`,
    js: `var headline = document.getElementById('scrambleHeadline');
var text = 'Decoded';
var POOL = '!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="scramble-char" data-final="' + c + '">' + c + '</span>';
}).join('');
var chars = headline.querySelectorAll('.scramble-char');

function scrambleChar(el) {
  var final = el.dataset.final;
  var iterations = 12 + Math.floor(Math.random() * 8);
  var i = 0;
  var t = setInterval(function () {
    el.textContent = POOL[Math.floor(Math.random() * POOL.length)];
    i++;
    if (i >= iterations) {
      el.textContent = final;
      clearInterval(t);
    }
  }, 28);
}

chars.forEach(function (el, i) {
  setTimeout(function () { scrambleChar(el); }, i * 50);
});`
  },

  // ── 17. Shadow Chase ──────────────────────────────────
  shadowChase: {
    html: `<div class="shadow-chase-wrapper">
  <p class="shadow-chase-headline" id="shadowChaseHeadline">Shadow</p>
</div>`,
    css: `.shadow-chase-wrapper {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.shadow-chase-headline {
  font-size: 3.5rem;
  font-weight: 600;
  text-shadow: 0 4px 12px rgba(124, 92, 255, 0.4);
  will-change: text-shadow;
}`,
    js: `var headline = document.getElementById('shadowChaseHeadline');
var wrapper = document.querySelector('.shadow-chase-wrapper');

wrapper.addEventListener('mousemove', function (e) {
  var rect = wrapper.getBoundingClientRect();
  var dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  var dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
  var len = 24 + Math.sqrt(dx * dx + dy * dy) * 16;
  var angle = Math.atan2(dy, dx);
  headline.style.textShadow =
    (Math.cos(angle) * len) + 'px ' + (Math.sin(angle) * len) +
    'px 20px rgba(124, 92, 255, 0.5)';
});`
  },

  // ── 18. Letter Flip (pure CSS) ────────────────────────
  letterFlip: {
    html: `<p class="letter-flip-headline">
  <span class="flip-char">F</span><span class="flip-char">l</span><span class="flip-char">i</span><span class="flip-char">p</span>
</p>`,
    css: `.letter-flip-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
  perspective: 600px;
}

.flip-char {
  display: inline-block;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.flip-char:hover {
  transform: rotateY(180deg);
}`
  },

  // ── 19. Breathing (pure CSS) ──────────────────────────
  breathing: {
    html: `<p class="breathing-headline">Breathe</p>`,
    css: `.breathing-headline {
  font-size: 3.5rem;
  font-weight: 600;
  text-align: center;
  transform-origin: center center;
  animation: breathe 2.5s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}`
  },

  // ── 20. Gradient Sweep (pure CSS) ─────────────────────
  gradientSweep: {
    html: `<p class="gradient-sweep-headline">Sweep</p>`,
    css: `.gradient-sweep-headline {
  font-size: 3.5rem;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(90deg, #f0f0f5, #7c5cff, #a78bfa, #f0f0f5);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-sweep 4s linear infinite;
}

@keyframes gradient-sweep {
  from { background-position: 0% 50%; }
  to { background-position: 300% 50%; }
}`
  },

  // ── 21. Spotlight Reveal ──────────────────────────────
  spotlight: {
    html: `<div class="spotlight-wrapper" id="spotlightWrapper">
  <h2 class="spotlight-text">Hidden in Shadows</h2>
  <div class="spotlight-mask" id="spotlightMask"></div>
</div>`,
    css: `.spotlight-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  background: #000;
  overflow: hidden;
}

.spotlight-text {
  font-size: 3.5rem;
  font-weight: 600;
  color: #222;
  z-index: 1;
  margin: 0;
}

/* Bright copy sits behind, revealed through the mask hole */
.spotlight-wrapper::after {
  content: "Hidden in Shadows";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  z-index: 0;
  font-size: 3.5rem;
  font-weight: 600;
}

.spotlight-mask {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle 80px at var(--x, 50%) var(--y, 50%),
    transparent 0%, #000 100%);
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: hard-light;
}`,
    js: `var wrapper = document.getElementById('spotlightWrapper');
var mask = document.getElementById('spotlightMask');

wrapper.addEventListener('mousemove', function (e) {
  var rect = wrapper.getBoundingClientRect();
  mask.style.setProperty('--x', (e.clientX - rect.left) + 'px');
  mask.style.setProperty('--y', (e.clientY - rect.top) + 'px');
});`
  },

  // ── 22. Gooey Text (pure CSS + SVG filter) ────────────
  gooey: {
    html: `<svg width="0" height="0">
  <filter id="gooey-filter" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
    <feColorMatrix in="blur" mode="matrix"
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
    <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
  </filter>
</svg>

<div class="gooey-wrapper">
  <h2 class="gooey-text"><span class="gooey-char">G</span><span class="gooey-char">o</span><span class="gooey-char">o</span><span class="gooey-char">e</span><span class="gooey-char">y</span></h2>
</div>`,
    css: `.gooey-wrapper {
  filter: url('#gooey-filter');
  padding: 1rem; /* room so gooey blobs don't clip */
  text-align: center;
}

.gooey-text {
  display: inline-block;
  font-size: 3.5rem;
  font-weight: 700; /* thick strokes merge better */
  color: #7c5cff;
}

.gooey-char {
  display: inline-block;
  position: relative; /* animate left, not transform, so the filter covers every letter */
  animation: gooey-drift 2.4s ease-in-out infinite alternate;
}

.gooey-char:nth-child(odd) { animation-direction: alternate-reverse; }
.gooey-char:nth-child(2) { animation-delay: 0.15s; }
.gooey-char:nth-child(3) { animation-delay: 0.3s; }
.gooey-char:nth-child(4) { animation-delay: 0.45s; }
.gooey-char:nth-child(5) { animation-delay: 0.6s; }

@keyframes gooey-drift {
  0% { left: -0.18em; }
  100% { left: 0.18em; }
}`
  },

  // ── 23. Infinite Marquee (pure CSS) ───────────────────
  marquee: {
    html: `<div class="marquee-wrapper">
  <div class="marquee-inner">
    <span>SCROLLING TEXT LOOP &bull; SCROLLING TEXT LOOP &bull; </span><span aria-hidden="true">SCROLLING TEXT LOOP &bull; SCROLLING TEXT LOOP &bull; </span>
  </div>
</div>`,
    css: `.marquee-wrapper {
  overflow: hidden;
  white-space: nowrap;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-inner {
  display: inline-block;
  animation: marquee 10s linear infinite;
}

.marquee-inner span {
  padding-right: 2rem;
  font-size: 3rem;
  font-weight: 700;
  color: #6b6b80;
}

/* The text is duplicated in the HTML, so -50% loops seamlessly */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`
  },

  // ── 24. Elastic Bounce (pure CSS) ─────────────────────
  elastic: {
    html: `<h2 class="elastic-text">
  <span class="elastic-char">B</span><span class="elastic-char">o</span><span class="elastic-char">u</span><span class="elastic-char">n</span><span class="elastic-char">c</span><span class="elastic-char">e</span>
</h2>`,
    css: `.elastic-text {
  display: flex;
  justify-content: center;
  gap: 2px;
  font-size: 3.5rem;
  font-weight: 600;
}

.elastic-char {
  display: inline-block;
  /* Overshooting cubic-bezier gives the elastic feel */
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.elastic-char:hover {
  transform: scale(1.4) translateY(-10px);
  color: #7c5cff;
}`
  },

  // ── 25. Liquid Fill (pure CSS) ────────────────────────
  liquid: {
    html: `<h2 class="liquid-text">Liquid Fill</h2>`,
    css: `.liquid-text {
  font-size: 3.5rem;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(to top, #7c5cff 50%, #6b6b80 50%);
  background-size: 100% 200%;
  background-position: 0 0%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background-position 0.5s ease;
  cursor: pointer;
}

.liquid-text:hover {
  background-position: 0 100%;
}`
  },

  // ── 26. Neon Flicker (pure CSS) ───────────────────────
  neon: {
    html: `<h2 class="neon-text">OPEN 24/7</h2>`,
    css: `.neon-text {
  font-size: 3.5rem;
  font-weight: 600;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff,
    0 0 20px #7c5cff, 0 0 30px #7c5cff, 0 0 40px #7c5cff;
  animation: neon-flicker 3s infinite;
}

@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
    text-shadow: 0 0 5px #fff, 0 0 10px #fff,
      0 0 20px #7c5cff, 0 0 30px #7c5cff, 0 0 40px #7c5cff;
  }
  20%, 24%, 55% {
    opacity: 0.5;
    text-shadow: none;
  }
}`
  },

  // ── 27. Mirror Reflection (pure CSS) ──────────────────
  mirror: {
    html: `<div class="mirror-wrapper">
  <h2 class="mirror-text">Reflection</h2>
  <h2 class="mirror-reflection" aria-hidden="true">Reflection</h2>
</div>`,
    css: `.mirror-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 500px;
}

.mirror-text,
.mirror-reflection {
  font-size: 3.5rem;
  font-weight: 600;
  margin: 0;
}

.mirror-reflection {
  transform: rotateX(180deg);
  opacity: 0.3;
  background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: -10px;
  filter: blur(1px);
}`
  },

  // ── 28. Variable Axis Hover (pure CSS) ────────────────
  variableAxis: {
    html: `<!-- Requires a variable font, e.g. Roboto Flex from Google Fonts:
<link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,slnt,wdth,wght@8..144,-10..0,25..151,100..1000&display=swap" rel="stylesheet"> -->

<h2 class="variable-axis-text">Variable</h2>`,
    css: `.variable-axis-text {
  font-family: 'Roboto Flex', sans-serif;
  font-size: 3.5rem;
  text-align: center;
  font-variation-settings: 'wght' 100, 'wdth' 100, 'slnt' 0;
  transition: font-variation-settings 0.5s ease;
  cursor: pointer;
}

.variable-axis-text:hover {
  font-variation-settings: 'wght' 900, 'wdth' 150, 'slnt' -10;
  color: #7c5cff;
}`
  },

  // ── 29. Code Decode ───────────────────────────────────
  codeDecode: {
    html: `<h2 class="code-text" data-value="System Ready">01010101</h2>`,
    css: `.code-text {
  font-family: monospace;
  font-size: 3.5rem;
  text-align: center;
  color: #7c5cff;
  cursor: pointer;
}`,
    js: `var el = document.querySelector('.code-text');
var final = el.dataset.value;
var POOL = '01';
var interval = null;

el.addEventListener('mouseenter', function () {
  var iteration = 0;
  clearInterval(interval);
  interval = setInterval(function () {
    el.innerText = final.split('').map(function (letter, index) {
      if (index < iteration) return final[index];
      return POOL[Math.floor(Math.random() * POOL.length)];
    }).join('');
    if (iteration >= final.length) clearInterval(interval);
    iteration += 1 / 3;
  }, 30);
});

el.addEventListener('mouseleave', function () {
  clearInterval(interval);
  el.innerText = '01010101';
});`
  },

  // ── 30. Split Hover (pure CSS) ────────────────────────
  splitHover: {
    html: `<div class="split-hover-wrapper">
  <div class="split-hover-inner">
    <span class="split-top">Menu</span>
    <span class="split-bottom">Open</span>
  </div>
</div>`,
    css: `.split-hover-wrapper {
  position: relative;
  overflow: hidden;
  height: 3.5rem; /* must match .split-top/.split-bottom height */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.split-hover-inner {
  display: block;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;
}

.split-hover-wrapper:hover .split-hover-inner {
  transform: translateY(-3.5rem);
}

.split-top,
.split-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
}

.split-bottom {
  color: #7c5cff;
}`
  },

  // ── 31. Weight Wave ───────────────────────────────────
  weightWave: {
    html: `<!-- Requires a variable font, e.g. Roboto Flex from Google Fonts:
<link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,slnt,wdth,wght@8..144,-10..0,25..151,100..1000&display=swap" rel="stylesheet"> -->

<p class="weight-wave-headline" id="weightWaveHeadline"></p>`,
    css: `.weight-wave-headline {
  font-family: 'Roboto Flex', sans-serif;
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
}

.weight-wave-char {
  display: inline-block;
  font-variation-settings: 'wght' 100;
}`,
    js: `var headline = document.getElementById('weightWaveHeadline');
var text = 'Heavy Light';
var SPEED = 0.06;

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="weight-wave-char">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');
var chars = headline.querySelectorAll('.weight-wave-char');

var phase = 0;
function tick() {
  phase += SPEED;
  chars.forEach(function (el, i) {
    // A wave of font-weight 100..900 travels through the word
    var w = 500 + Math.sin(phase - i * 0.6) * 400;
    el.style.fontVariationSettings = "'wght' " + Math.round(w);
  });
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 32. Stroke Draw ───────────────────────────────────
  strokeDraw: {
    html: `<svg class="stroke-svg" viewBox="0 0 700 120" width="100%">
  <text x="350" y="85" text-anchor="middle" class="stroke-text" id="strokeText">Draw Me</text>
</svg>`,
    css: `.stroke-text {
  font-size: 4.5rem;
  font-weight: 700;
  fill: none;
  stroke: #7c5cff;
  stroke-width: 1.5;
}

.stroke-text.drawing {
  /* Near-linear pen speed — ease-out-expo drew ~90% of the outline in the first
     third and then crawled, which reads as a glitch rather than handwriting */
  animation: stroke-draw 2.6s cubic-bezier(0.4, 0, 0.5, 1) forwards;
}

@keyframes stroke-draw {
  0% { stroke-dashoffset: var(--dash-from, 3300); fill: transparent; }
  84% { fill: transparent; }
  100% { stroke-dashoffset: var(--dash-to, 1020); fill: #f0f0f5; }
}`,
    js: `var textEl = document.getElementById('strokeText');

// SVG <text> has no getTotalLength(), so the glyph outline perimeter has to be
// estimated. getComputedTextLength() is the *advance width* — not the outline —
// so a small multiplier falls well short of it. When stroke-dasharray is shorter
// than the real outline the pattern REPEATS, so a second dash starts partway
// through and leaves a visible seam mid-glyph.
//
// Model each glyph as its bbox perimeter 2(w + h) times ~1.6 for the inner
// counters that most letters carry:  actual ~= 3.2 * (W + N*h)
function measure() {
  var W = textEl.getComputedTextLength();   // total advance width
  var h = textEl.getBBox().height;          // ink height
  var N = (textEl.textContent.replace(/\\s/g, '') || ' ').length;
  var unit = W + N * h;

  // \`bound\` must exceed the true perimeter so the pattern can never repeat.
  // \`draw\`  must also exceed it (an undershoot would leave letters unfinished),
  // but only slightly, so the reveal spans almost the whole duration.
  return { bound: Math.ceil(5.5 * unit), draw: Math.ceil(3.8 * unit) };
}

function play() {
  textEl.classList.remove('drawing');

  var bound = 3300, draw = 2280; // fallbacks if measurement throws
  try {
    var m = measure();
    bound = m.bound;
    draw = m.draw;
  } catch (e) {}

  textEl.style.strokeDasharray = bound;
  // Reveal by walking the offset from \`bound\` down to \`bound - draw\` — never to
  // 0, which would idle for ~40% of the duration after the outline is complete.
  textEl.style.setProperty('--dash-from', bound);
  textEl.style.setProperty('--dash-to', bound - draw);
  textEl.style.strokeDashoffset = bound;
  void textEl.getBoundingClientRect(); // force reflow so the animation restarts
  textEl.classList.add('drawing');
}

// Fonts must be loaded before measuring the outline length
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(play);
} else {
  play();
}`
  },

  // ── 33. Gravity Drop ──────────────────────────────────
  gravityDrop: {
    html: `<div class="gravity-wrapper" id="gravityWrapper">
  <p class="gravity-headline" id="gravityHeadline"></p>
</div>`,
    css: `.gravity-wrapper {
  min-height: 160px;
  cursor: pointer;
  overflow: hidden;
}

.gravity-headline {
  display: flex;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 600;
}

.gravity-char {
  display: inline-block;
  will-change: transform;
}`,
    js: `var headline = document.getElementById('gravityHeadline');
var wrapper = document.getElementById('gravityWrapper');
var text = 'Timber!';

headline.innerHTML = text.split('').map(function (c) {
  return '<span class="gravity-char">' + c + '</span>';
}).join('');
var chars = headline.querySelectorAll('.gravity-char');

var dropped = false;
var rafId = null;

function drop() {
  var wrapRect = wrapper.getBoundingClientRect();
  var bodies = Array.from(chars).map(function (el) {
    var r = el.getBoundingClientRect();
    return {
      el: el,
      y: 0,
      vy: -(2 + Math.random() * 3),        // small upward pop first
      rot: 0,
      vr: (Math.random() - 0.5) * 10,
      floor: wrapRect.bottom - r.bottom,   // distance to wrapper floor
      delay: Math.random() * 15,           // frames before falling
      bounces: 0
    };
  });

  function tick() {
    var alive = false;
    bodies.forEach(function (b) {
      if (b.delay > 0) { b.delay--; alive = true; return; }
      b.vy += 0.9;                         // gravity
      b.y += b.vy;
      b.rot += b.vr;
      if (b.y >= b.floor) {
        b.y = b.floor;
        b.vy *= -0.45;                     // restitution
        b.vr *= 0.6;
        b.bounces++;
        if (Math.abs(b.vy) < 1 || b.bounces > 4) { b.vy = 0; b.vr = 0; }
      }
      if (b.vy !== 0 || b.y < b.floor) alive = true;
      b.el.style.transform = 'translateY(' + b.y + 'px) rotate(' + b.rot + 'deg)';
    });
    if (alive) rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

function reset() {
  if (rafId) cancelAnimationFrame(rafId);
  chars.forEach(function (el) {
    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transform = 'translateY(0) rotate(0deg)';
    setTimeout(function () { el.style.transition = ''; }, 500);
  });
}

wrapper.addEventListener('click', function () {
  dropped = !dropped;
  if (dropped) drop(); else reset();
});`
  }
};
