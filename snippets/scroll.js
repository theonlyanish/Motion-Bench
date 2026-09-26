/**
 * Standalone code snippets for the Scroll Animations page (scroll.html).
 * Each entry is keyed by the section's data-anim attribute and holds
 * self-contained, copy-paste-ready html / css / js strings.
 * Rendered by code-panel.js.
 */
window.EFFECT_SNIPPETS = {

  // ── 1. Fade In ────────────────────────────────────────
  fade: {
    html: `<!-- Place inside a scrollable page so the section starts off-screen -->
<section class="fade-section">
  <h2>Fade In</h2>
</section>`,
    css: `.fade-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-section.in-view h2 {
  opacity: 1;
}`,
    js: `var section = document.querySelector('.fade-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    // toggle so the animation replays every time it scrolls into view
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 2. Slide Up ───────────────────────────────────────
  slideUp: {
    html: `<section class="slide-up-section">
  <h2>Slide Up</h2>
</section>`,
    css: `.slide-up-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-up-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-section.in-view h2 {
  opacity: 1;
  transform: translateY(0);
}`,
    js: `var section = document.querySelector('.slide-up-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 3. Slide From Right ───────────────────────────────
  slideLeft: {
    html: `<section class="slide-left-section">
  <h2>Slide From Right</h2>
</section>`,
    css: `.slide-left-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* keep the off-screen start from widening the page */
}

.slide-left-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: translateX(80px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-section.in-view h2 {
  opacity: 1;
  transform: translateX(0);
}`,
    js: `var section = document.querySelector('.slide-left-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 4. Slide From Left ────────────────────────────────
  slideRight: {
    html: `<section class="slide-right-section">
  <h2>Slide From Left</h2>
</section>`,
    css: `.slide-right-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slide-right-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: translateX(-80px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-section.in-view h2 {
  opacity: 1;
  transform: translateX(0);
}`,
    js: `var section = document.querySelector('.slide-right-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 5. Scale Up ───────────────────────────────────────
  scaleUp: {
    html: `<section class="scale-up-section">
  <h2>Scale Up</h2>
</section>`,
    css: `.scale-up-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-up-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-up-section.in-view h2 {
  opacity: 1;
  transform: scale(1);
}`,
    js: `var section = document.querySelector('.scale-up-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 6. Rotate In ──────────────────────────────────────
  rotateIn: {
    html: `<section class="rotate-in-section">
  <h2>Rotate In</h2>
</section>`,
    css: `.rotate-in-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rotate-in-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: rotate(-12deg) scale(0.9);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.rotate-in-section.in-view h2 {
  opacity: 1;
  transform: rotate(0) scale(1);
}`,
    js: `var section = document.querySelector('.rotate-in-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 7. Staggered Letters ──────────────────────────────
  stagger: {
    html: `<section class="stagger-section">
  <h2 class="stagger-word"></h2>
</section>`,
    css: `.stagger-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stagger-word {
  font-size: 2.5rem;
  color: #f0f0f5;
}

.stagger-word .s-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stagger-section.in-view .s-char {
  opacity: 1;
  transform: translateY(0);
}`,
    js: `var section = document.querySelector('.stagger-section');
var word = document.querySelector('.stagger-word');
var text = 'Stagger';
var DELAY = 50; // ms between letters

// Split into spans and stagger the transition-delay per letter
word.innerHTML = text.split('').map(function (c, i) {
  return '<span class="s-char" style="transition-delay: ' + (i * DELAY) + 'ms">' +
    (c === ' ' ? '&nbsp;' : c) + '</span>';
}).join('');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 8. Blur to Sharp ──────────────────────────────────
  blurSharp: {
    html: `<section class="blur-sharp-section">
  <h2>Blur to Sharp</h2>
</section>`,
    css: `.blur-sharp-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blur-sharp-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0.6;
  filter: blur(12px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.blur-sharp-section.in-view h2 {
  opacity: 1;
  filter: blur(0);
}`,
    js: `var section = document.querySelector('.blur-sharp-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 9. Skew In ────────────────────────────────────────
  skewIn: {
    html: `<section class="skew-in-section">
  <h2>Skew In</h2>
</section>`,
    css: `.skew-in-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skew-in-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: skewX(-15deg);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.skew-in-section.in-view h2 {
  opacity: 1;
  transform: skewX(0);
}`,
    js: `var section = document.querySelector('.skew-in-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 10. Parallax ──────────────────────────────────────
  parallax: {
    html: `<!-- Make the section tall so there is room to scrub through it.
     The bordered stage is the frame of reference — parallax is differential
     motion, so without something STATIC to measure against, and without layers
     moving at different rates, a lone drifting element reads as nothing. -->
<section class="parallax-section">
  <div class="parallax-stage">
    <div class="px-layer px-rules" aria-hidden="true"></div>
    <span class="px-layer px-label">Parallax</span>
    <h2 class="px-layer px-title">Parallax</h2>
  </div>
</section>`,
    css: `.parallax-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallax-stage {
  position: relative;
  width: 100%;
  max-width: 460px;
  height: 240px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: #16161a;
  overflow: hidden;          /* layers clip against the fixed edge */
  display: grid;
  place-items: center;
}

/* One offset, scaled per layer. Higher --depth lags further behind the scroll and
   so reads as more distant. Keep every depth the same sign: mixing signs makes
   layers travel toward each other and cross over, which breaks the illusion and
   collides the text. Each layer also needs (depth * RANGE/2) of clearance from the
   stage edge, or it clips out of the frame at the extremes of the sweep. */
.px-layer {
  transform: translateY(calc(var(--parallax-offset, 0px) * var(--depth, 0)));
  will-change: transform;
}

/* Back — ruled hairlines give the eye something to read the other layers against */
.px-rules {
  --depth: 1;
  position: absolute;
  left: 0; right: 0;
  top: -140px; bottom: -140px;   /* overshoot so it never runs out while travelling */
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08) 0 1px,
    transparent 1px 34px
  );
}

/* Mid — the only in-flow child, so place-items centres it */
.px-title {
  --depth: 0.5;
  position: relative;
  z-index: 1;
  margin: 0;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: #f0f0f5;
}

/* Front — pinned near the top rather than sitting directly above the title:
   adjacent lines can't hold different depths without colliding, since the gap
   between them is only a few px to spend. */
.px-label {
  --depth: 0.15;
  position: absolute;
  top: 1.75rem; left: 0; right: 0;
  z-index: 2;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #6fb2d6;
}

@media (prefers-reduced-motion: reduce) {
  .px-layer { transform: none !important; }
}`,
    js: `var section = document.querySelector('.parallax-section');
var stage = document.querySelector('.parallax-stage');
var RANGE = 180; // px travelled by a depth-1 layer across the crossing

function tick() {
  var rect = section.getBoundingClientRect();
  var vh = window.innerHeight;
  if (rect.top < vh && rect.bottom > 0) {
    // 0 when the section enters at the bottom, 1 when it leaves at the top
    var progress = (vh - rect.top) / (vh + rect.height);
    progress = Math.max(0, Math.min(1, progress));
    var offset = (progress - 0.5) * RANGE;
    // Write once; CSS multiplies it by each layer's --depth
    stage.style.setProperty('--parallax-offset', offset.toFixed(2) + 'px');
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 11. Clip Reveal ───────────────────────────────────
  clipReveal: {
    html: `<section class="clip-reveal-section">
  <h2>Clip Reveal</h2>
</section>`,
    css: `.clip-reveal-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clip-reveal-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  clip-path: inset(0 100% 0 0); /* fully clipped from the right */
  transition: clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.clip-reveal-section.in-view h2 {
  clip-path: inset(0 0 0 0);
}`,
    js: `var section = document.querySelector('.clip-reveal-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 12. 3D Flip ───────────────────────────────────────
  flip3d: {
    html: `<section class="flip3d-section">
  <h2>3D Flip</h2>
</section>`,
    css: `.flip3d-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip3d-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: perspective(600px) rotateY(-90deg);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.5s;
}

.flip3d-section.in-view h2 {
  opacity: 1;
  transform: perspective(600px) rotateY(0);
}`,
    js: `var section = document.querySelector('.flip3d-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 13. Bounce In ─────────────────────────────────────
  bounceIn: {
    html: `<section class="bounce-in-section">
  <h2>Bounce In</h2>
</section>`,
    css: `.bounce-in-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bounce-in-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: translateY(80px) scale(0.8);
  /* Overshooting cubic-bezier gives the bounce */
  transition: opacity 0.5s,
              transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bounce-in-section.in-view h2 {
  opacity: 1;
  transform: translateY(0) scale(1);
}`,
    js: `var section = document.querySelector('.bounce-in-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 14. Split Converge ────────────────────────────────
  splitConverge: {
    html: `<section class="split-converge-section">
  <h2><span class="split-left">Split</span> <span class="split-right">Converge</span></h2>
</section>`,
    css: `.split-converge-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.split-converge-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
}

.split-left,
.split-right {
  display: inline-block;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.split-left { transform: translateX(-80px); }
.split-right { transform: translateX(80px); }

.split-converge-section.in-view .split-left,
.split-converge-section.in-view .split-right {
  transform: translateX(0);
}`,
    js: `var section = document.querySelector('.split-converge-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 15. Underline Grow ────────────────────────────────
  underlineGrow: {
    html: `<section class="underline-grow-section">
  <h2 class="underline-text">Underline Grow</h2>
</section>`,
    css: `.underline-grow-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.underline-text {
  font-size: 2.5rem;
  color: #f0f0f5;
  /* The underline is a gradient background that grows from 0% to 100% wide */
  background: linear-gradient(#7c5cff, #7c5cff) no-repeat bottom;
  background-size: 0% 2px;
  padding-bottom: 4px;
  transition: background-size 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.underline-grow-section.in-view .underline-text {
  background-size: 100% 2px;
}`,
    js: `var section = document.querySelector('.underline-grow-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 16. Letter Spacing ────────────────────────────────
  letterSpacing: {
    html: `<section class="letter-spacing-section">
  <h2 class="letter-spacing-text">Letter Spacing</h2>
</section>`,
    css: `.letter-spacing-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.letter-spacing-text {
  font-size: 2.5rem;
  color: #f0f0f5;
  letter-spacing: 0.5em;
  opacity: 0;
  transition: letter-spacing 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.6s;
}

.letter-spacing-section.in-view .letter-spacing-text {
  letter-spacing: -0.02em;
  opacity: 1;
}`,
    js: `var section = document.querySelector('.letter-spacing-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 17. Slide + Fade ──────────────────────────────────
  slideFade: {
    html: `<section class="slide-fade-section">
  <h2>Slide + Fade</h2>
</section>`,
    css: `.slide-fade-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-fade-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-section.in-view h2 {
  opacity: 1;
  transform: translateX(0);
}`,
    js: `var section = document.querySelector('.slide-fade-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 18. Scale + Rotate ────────────────────────────────
  scaleRotate: {
    html: `<section class="scale-rotate-section">
  <h2>Scale + Rotate</h2>
</section>`,
    css: `.scale-rotate-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-rotate-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
  opacity: 0;
  transform: scale(0.5) rotate(-20deg);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-rotate-section.in-view h2 {
  opacity: 1;
  transform: scale(1) rotate(0);
}`,
    js: `var section = document.querySelector('.scale-rotate-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 19. Gradient Shift ────────────────────────────────
  gradientShift: {
    html: `<section class="gradient-shift-section">
  <h2 class="gradient-text">Gradient Shift</h2>
</section>`,
    css: `.gradient-shift-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-text {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #f0f0f5, #7c5cff, #a78bfa);
  background-size: 200% 100%;
  background-position: 100% 50%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background-position 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.gradient-shift-section.in-view .gradient-text {
  background-position: 0% 50%;
}`,
    js: `var section = document.querySelector('.gradient-shift-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 20. Typewriter ────────────────────────────────────
  typewriter: {
    html: `<section class="typewriter-section">
  <h2 class="typewriter-text"><span class="tw-chars"></span><span class="tw-cursor">|</span></h2>
</section>`,
    css: `.typewriter-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.typewriter-text {
  font-size: 2.5rem;
  color: #f0f0f5;
}

.tw-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}`,
    js: `var section = document.querySelector('.typewriter-section');
var target = document.querySelector('.tw-chars');
var TEXT = 'Typewriter Reveal';
var SPEED = 80; // ms per character

var interval = null;

function start() {
  stop();
  target.textContent = '';
  var i = 0;
  interval = setInterval(function () {
    if (i < TEXT.length) {
      target.textContent += TEXT[i];
      i++;
    } else {
      stop();
    }
  }, SPEED);
}

function stop() {
  clearInterval(interval);
  interval = null;
}

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      start();
    } else {
      stop();
      target.textContent = ''; // reset so it replays next time
    }
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 21. Sticky Stack ──────────────────────────────────
  stickyStack: {
    html: `<section class="sticky-stack-section">
  <div class="stack-card stack-card-1">Card 1</div>
  <div class="stack-card stack-card-2">Card 2</div>
  <div class="stack-card stack-card-3">Card 3</div>
</section>`,
    css: `.sticky-stack-section {
  height: 60vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  color: #f0f0f5;
}

.stack-card {
  position: absolute;
  width: 200px;
  height: 120px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100px) scale(0.8);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s;
}

.stack-card-1 { z-index: 1; background: #222; }
.stack-card-2 { z-index: 2; background: #333; }
.stack-card-3 { z-index: 3; background: #444; }

/* Cards settle into a fanned stack, each slightly delayed */
.sticky-stack-section.in-view .stack-card-1 {
  opacity: 1;
  transform: translateY(-40px) scale(0.9);
}
.sticky-stack-section.in-view .stack-card-2 {
  opacity: 1;
  transform: translateY(-20px) scale(0.95);
  transition-delay: 0.1s;
}
.sticky-stack-section.in-view .stack-card-3 {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 0.2s;
}`,
    js: `var section = document.querySelector('.sticky-stack-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 22. Horizontal Scroll ─────────────────────────────
  horizontalScroll: {
    html: `<section class="horizontal-scroll-section">
  <div class="horizontal-track">
    <div class="h-item">Item 1</div>
    <div class="h-item">Item 2</div>
    <div class="h-item">Item 3</div>
    <div class="h-item">Item 4</div>
  </div>
</section>`,
    css: `.horizontal-scroll-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #f0f0f5;
}

.horizontal-track {
  display: flex;
  gap: 1rem;
  opacity: 0;
  transform: translateX(100px);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s;
}

.h-item {
  width: 120px;
  height: 120px;
  background: #12121a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.horizontal-scroll-section.in-view .horizontal-track {
  opacity: 1;
  transform: translateX(0);
}`,
    js: `var section = document.querySelector('.horizontal-scroll-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 23. Counter Up ────────────────────────────────────
  counter: {
    html: `<section class="counter-section">
  <h2 class="counter-text" data-target="100">0</h2>
</section>`,
    css: `.counter-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-text {
  font-size: 2.5rem;
  color: #f0f0f5;
  font-variant-numeric: tabular-nums;
}`,
    js: `var section = document.querySelector('.counter-section');
var target = document.querySelector('.counter-text');
var STEPS = 40;     // how many increments to reach the target
var TICK_MS = 30;   // ms between increments

var interval = null;

function start() {
  stop();
  var end = +target.dataset.target;
  var current = 0;
  interval = setInterval(function () {
    current += Math.ceil(end / STEPS);
    if (current >= end) {
      current = end;
      stop();
    }
    target.textContent = current;
  }, TICK_MS);
}

function stop() {
  clearInterval(interval);
  interval = null;
}

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      start();
    } else {
      stop();
      target.textContent = '0'; // reset so it replays next time
    }
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 24. Image Reveal (Curtain) ────────────────────────
  imgReveal: {
    html: `<section class="img-reveal-section">
  <div class="img-reveal-wrapper">
    <div class="img-reveal-curtain"></div>
    <img src="https://picsum.photos/id/237/600/400" alt="Reveal">
  </div>
</section>`,
    css: `.img-reveal-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-reveal-wrapper {
  position: relative;
  width: 300px;
  height: 200px;
  overflow: hidden;
}

.img-reveal-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* A solid panel that slides away to reveal the image beneath */
.img-reveal-curtain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #7c5cff;
  transform: translateX(0);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
}

.img-reveal-section.in-view .img-reveal-curtain {
  transform: translateX(100%);
}`,
    js: `var section = document.querySelector('.img-reveal-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 25. Text Highlight (Marker) ───────────────────────
  textHighlight: {
    html: `<section class="text-highlight-section">
  <h2>Important <span class="marker">Concept</span></h2>
</section>`,
    css: `.text-highlight-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-highlight-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
}

/* The "marker" is a background that grows from 0% to 100% wide */
.marker {
  background: linear-gradient(120deg,
    rgba(124, 92, 255, 0.35) 0%, rgba(124, 92, 255, 0.35) 100%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: 0 0;
  padding: 0 4px;
  transition: background-size 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.text-highlight-section.in-view .marker {
  background-size: 100% 100%;
}`,
    js: `var section = document.querySelector('.text-highlight-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 26. Perspective Grid ──────────────────────────────
  perspectiveGrid: {
    html: `<section class="perspective-grid-section">
  <div class="perspective-grid">
    <div class="grid-item"></div>
    <div class="grid-item"></div>
    <div class="grid-item"></div>
    <div class="grid-item"></div>
  </div>
</section>`,
    css: `.perspective-grid-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.perspective-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  perspective: 600px;
}

.grid-item {
  width: 100px;
  height: 100px;
  background: #12121a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  opacity: 0;
  transform: rotateX(45deg) translateY(50px);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s;
}

.perspective-grid-section.in-view .grid-item {
  opacity: 1;
  transform: rotateX(0) translateY(0);
}

.perspective-grid-section.in-view .grid-item:nth-child(2) { transition-delay: 0.1s; }
.perspective-grid-section.in-view .grid-item:nth-child(3) { transition-delay: 0.2s; }
.perspective-grid-section.in-view .grid-item:nth-child(4) { transition-delay: 0.3s; }`,
    js: `var section = document.querySelector('.perspective-grid-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 27. Circle Expand ─────────────────────────────────
  circleExpand: {
    html: `<section class="circle-expand-section">
  <div class="circle-expand">
    <span>Circle Expand</span>
  </div>
</section>`,
    css: `.circle-expand-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-expand {
  width: 200px;
  height: 200px;
  background: #7c5cff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transform: scale(0);
  /* Overshooting cubic-bezier gives a springy pop */
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.circle-expand-section.in-view .circle-expand {
  transform: scale(1);
}`,
    js: `var section = document.querySelector('.circle-expand-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 28. Staggered List ────────────────────────────────
  staggerList: {
    html: `<section class="stagger-list-section">
  <ul class="stagger-list">
    <li>List Item 1</li>
    <li>List Item 2</li>
    <li>List Item 3</li>
    <li>List Item 4</li>
  </ul>
</section>`,
    css: `.stagger-list-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0f0f5;
}

.stagger-list {
  list-style: none;
  padding: 0;
}

.stagger-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.5s, transform 0.5s;
}

.stagger-list-section.in-view li {
  opacity: 1;
  transform: translateX(0);
}

.stagger-list-section.in-view li:nth-child(2) { transition-delay: 100ms; }
.stagger-list-section.in-view li:nth-child(3) { transition-delay: 200ms; }
.stagger-list-section.in-view li:nth-child(4) { transition-delay: 300ms; }`,
    js: `var section = document.querySelector('.stagger-list-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 29. Video Play on Scroll ──────────────────────────
  videoScroll: {
    html: `<!-- Swap the placeholder for a real <video muted playsinline> to
     auto play/pause it — see the commented lines in the JS -->
<section class="video-scroll-section">
  <div class="video-placeholder">Video Play/Pause</div>
</section>`,
    css: `.video-scroll-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-placeholder {
  width: 300px;
  height: 180px;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  transition: border-color 0.5s, color 0.5s;
}

.video-scroll-section.in-view .video-placeholder {
  border-color: #7c5cff;
  color: #7c5cff;
}`,
    js: `var section = document.querySelector('.video-scroll-section');
// var video = document.querySelector('.video-scroll-section video');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
    // With a real <video> element, play while visible and pause otherwise:
    // if (entry.isIntersecting) video.play(); else video.pause();
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 30. Color Morph Background ────────────────────────
  colorMorph: {
    html: `<section class="color-morph-section">
  <h2>Background Shift</h2>
</section>`,
    css: `.color-morph-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: background 1s;
}

.color-morph-section h2 {
  font-size: 2.5rem;
  color: #f0f0f5;
}

.color-morph-section.in-view {
  background: rgba(124, 92, 255, 0.1);
}`,
    js: `var section = document.querySelector('.color-morph-section');

new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.25 }).observe(section);`
  },

  // ── 31. Velocity Skew ─────────────────────────────────
  velocitySkew: {
    html: `<!-- Needs a scrollable page — the skew follows how fast you scroll -->
<section class="velocity-skew-section">
  <h2 class="velocity-text">Scroll Fast!</h2>
</section>`,
    css: `.velocity-skew-section {
  min-height: 35vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.velocity-text {
  font-size: 2.5rem;
  color: #f0f0f5;
  will-change: transform;
}`,
    js: `var text = document.querySelector('.velocity-text');
var MAX_SKEW = 20;     // deg — cap for very fast scrolls
var SENSITIVITY = 0.8; // deg of skew per px of scroll per frame
var SMOOTH = 0.12;     // lerp factor — springs back toward 0

var lastScrollY = window.scrollY;
var skew = 0;

function tick() {
  var y = window.scrollY;
  var velocity = y - lastScrollY;
  lastScrollY = y;
  var target = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, velocity * SENSITIVITY));
  skew += (target - skew) * SMOOTH;
  text.style.transform =
    'skewY(' + skew + 'deg) scaleY(' + (1 + Math.abs(skew) * 0.01) + ')';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 32. Text Fill Scrub ───────────────────────────────
  textFillScrub: {
    html: `<!-- Make the section tall so there is room to scrub through it -->
<section class="fill-scrub-section">
  <h2 class="fill-scrub-text">Filled by your scroll position, not by time</h2>
</section>`,
    css: `.fill-scrub-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fill-scrub-text {
  font-size: 2.5rem;
  max-width: 480px;
  text-align: center;
  /* Left half accent, right half faint — sliding the position fills the text */
  background: linear-gradient(90deg, #7c5cff 50%, rgba(255, 255, 255, 0.15) 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`,
    js: `var section = document.querySelector('.fill-scrub-section');
var text = document.querySelector('.fill-scrub-text');
var SPEED = 1.4; // >1 finishes the fill before the section fully passes

function tick() {
  var rect = section.getBoundingClientRect();
  var vh = window.innerHeight;
  // 0 when the section enters at the bottom, 1 once its center passes
  var progress = Math.max(0, Math.min(1,
    (vh - rect.top) / (vh + rect.height * 0.5) * SPEED));
  text.style.backgroundPosition = (100 - progress * 100) + '% 0';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 33. Zoom Through ──────────────────────────────────
  zoomThrough: {
    html: `<!-- Make the section tall so there is room to scrub through it -->
<section class="zoom-through-section">
  <h2 class="zoom-through-text">Closer</h2>
</section>`,
    css: `.zoom-through-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-through-text {
  font-size: 2.5rem;
  color: #f0f0f5;
  transform-origin: center center;
  will-change: transform, opacity;
}`,
    js: `var section = document.querySelector('.zoom-through-section');
var text = document.querySelector('.zoom-through-text');
var MIN_SCALE = 0.6;
var MAX_GROWTH = 1.4;   // scale reaches MIN_SCALE + MAX_GROWTH at full progress
var FADE_START = 0.75;  // progress where the fade-out begins

function tick() {
  var rect = section.getBoundingClientRect();
  var vh = window.innerHeight;
  // 0 when the section enters at the bottom, 1 when it leaves at the top
  var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
  var scale = MIN_SCALE + progress * MAX_GROWTH;
  var opacity = progress < FADE_START
    ? 1
    : Math.max(0, 1 - (progress - FADE_START) * 4);
  text.style.transform = 'scale(' + scale + ')';
  text.style.opacity = opacity;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },

  // ── 5b. Letter Scrub Reveal ───────────────────────────
  letterScrub: {
    html: `<section class="letter-scrub-block">
  <div class="letter-scrub-stage">
    <canvas class="letter-scrub-canvas" id="lsCanvas" aria-hidden="true"></canvas>
    <h2 class="letter-scrub-text" id="lsText">Written by your scroll</h2>
  </div>
</section>`,
    css: `/* Tall block; the stage pins for the middle 80vh of it */
.letter-scrub-block {
  min-height: 130vh;
}

.letter-scrub-stage {
  position: sticky;
  top: 25vh;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.letter-scrub-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.letter-scrub-text {
  position: relative;
  margin: 0;
  font-size: 2.8rem;
  font-weight: 600;
  color: #f3f3f5;
}

.ls-char {
  opacity: 0.12; /* faint ghost so the layout reads before the reveal */
  transition: opacity 0.25s ease-out;
}

.ls-char.is-on { opacity: 1; }`,
    js: `var block = document.querySelector('.letter-scrub-block');
var stage = document.querySelector('.letter-scrub-stage');
var text = document.getElementById('lsText');
var canvas = document.getElementById('lsCanvas');
var ctx = canvas.getContext('2d');
var COLOR = '#6fb2d6';
var PUFF = 8;   // particles per letter
var TAIL = 160; // px of scroll left after the last letter lands, before the stage releases
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wrap every non-space character so each can be switched on individually
text.innerHTML = text.textContent.replace(/\\S/g, '<span class="ls-char">$&</span>');
var spans = Array.prototype.slice.call(text.querySelectorAll('.ls-char'));
var on = spans.map(function () { return false; });
var particles = [];

function size() {
  canvas.width = stage.clientWidth;
  canvas.height = stage.clientHeight;
}
size();
window.addEventListener('resize', size);

function puff(span) {
  if (reduced) return;
  var r = span.getBoundingClientRect();
  var s = stage.getBoundingClientRect();
  var cx = r.left + r.width / 2 - s.left;
  var cy = r.top + r.height / 2 - s.top;
  for (var i = 0; i < PUFF; i++) {
    particles.push({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4 - 0.6,
      size: 1 + Math.random() * 2.5,
      life: 1
    });
  }
}

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

function tick() {
  var vh = window.innerHeight;
  var rect = block.getBoundingClientRect();

  // 0 when the stage pins (block top at 25vh), 1 when it releases
  // (block bottom at 75vh) — the whole reveal happens while pinned
  var progress = clamp01((vh * 0.25 - rect.top) / (rect.height - vh * 0.5 - TAIL));

  for (var i = 0; i < spans.length; i++) {
    var next = i / spans.length < progress;
    if (next !== on[i]) {
      on[i] = next;
      spans[i].classList.toggle('is-on', next);
      if (next) puff(spans[i]);
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = COLOR;
  particles = particles.filter(function (p) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;    // a little gravity
    p.life -= 0.025;
    if (p.life <= 0) return false;
    ctx.globalAlpha = p.life;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
    return true;
  });
  ctx.globalAlpha = 1;

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`
  },
};
