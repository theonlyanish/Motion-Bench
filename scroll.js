/**
 * Scroll Animations — scroll-triggered effects (replayable)
 */

(function () {
  'use strict';

  function reduced() { return !!(window.A11Y && window.A11Y.reduced); }

  const blocks = document.querySelectorAll('.scroll-block');
  const parallaxBlock = document.querySelector('[data-anim="parallax"]');
  const parallaxStage = document.querySelector('.parallax-stage');
  const twChars = document.querySelector('.tw-chars');

  const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.dataset.anim === 'typewriter') runTypewriter(entry.target);
        if (entry.target.dataset.anim === 'counter') runCounter(entry.target);
      } else {
        entry.target.classList.remove('in-view');
        if (entry.target.dataset.anim === 'typewriter') resetTypewriter(entry.target);
        if (entry.target.dataset.anim === 'counter') resetCounter(entry.target);
      }
    });
  }, observerOptions);

  blocks.forEach((block) => observer.observe(block));

  // Track running intervals per block so replays never overlap
  const intervals = new WeakMap();

  function clearBlockInterval(block) {
    const id = intervals.get(block);
    if (id) {
      clearInterval(id);
      intervals.delete(block);
    }
  }

  // Typewriter effect
  function runTypewriter(block) {
    const target = block.querySelector('.tw-chars');
    if (!target) return;
    clearBlockInterval(block);
    const text = 'Typewriter Reveal';
    // Reduced motion: reveal the whole line at once
    if (reduced()) { target.textContent = text; return; }
    target.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        target.textContent += text[i];
        i++;
      } else {
        clearBlockInterval(block);
      }
    }, 80);
    intervals.set(block, interval);
  }

  function resetTypewriter(block) {
    clearBlockInterval(block);
    const target = block && block.querySelector('.tw-chars');
    if (target) target.textContent = '';
  }

  // Counter Up
  function runCounter(block) {
    const target = block.querySelector('.counter-text');
    if (!target) return;
    clearBlockInterval(block);
    const end = +target.dataset.target;
    // Reduced motion: show the final number immediately (no count-up)
    if (reduced()) { target.textContent = end; return; }
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(end / 40);
      if (current >= end) {
        current = end;
        clearBlockInterval(block);
      }
      target.textContent = current;
    }, 30);
    intervals.set(block, interval);
  }

  function resetCounter(block) {
    clearBlockInterval(block);
    const target = block.querySelector('.counter-text');
    if (target) target.textContent = '0';
  }

  // Replay: snap back to the initial state with transitions disabled,
  // then re-trigger so the full animation plays again
  function replayBlock(block) {
    block.classList.add('replay-reset');
    block.classList.remove('in-view');
    if (block.dataset.anim === 'typewriter') resetTypewriter(block);
    if (block.dataset.anim === 'counter') resetCounter(block);
    void block.offsetWidth;
    block.classList.remove('replay-reset');
    void block.offsetWidth;
    requestAnimationFrame(() => {
      block.classList.add('in-view');
      if (block.dataset.anim === 'typewriter') runTypewriter(block);
      if (block.dataset.anim === 'counter') runCounter(block);
    });
  }

  // Scrub-driven effects: their state is a pure function of scroll position, not a
  // timeline with a start and an end. There is nothing to replay — a Replay button
  // would be overwritten by the next animation frame — so they don't get one.
  const SCRUB_ANIMS = new Set([
    'parallax',      // offset mapped from scroll progress
    'velocitySkew',  // skew mapped from scroll velocity
    'textFillScrub', // background-position mapped from scroll progress
    'zoomThrough',   // scale/opacity mapped from scroll progress
    'letterScrub'    // per-letter opacity mapped from scroll progress
  ]);

  const REPLAY_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 12a9 9 0 1 1-3.2-6.9"/><path d="M21 3v5h-5"/></svg>';

  // Every block gets one centred actions row. code-panel.js mounts its panel here
  // too (it looks for .block-actions first), so Replay and View code share a single
  // row instead of each being positioned independently.
  blocks.forEach((block) => {
    const actions = document.createElement('div');
    actions.className = 'block-actions';
    block.appendChild(actions);

    if (SCRUB_ANIMS.has(block.dataset.anim)) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'replay-btn';
    btn.innerHTML = REPLAY_ICON + '<span>Replay</span>';
    btn.setAttribute('aria-label', 'Replay animation');

    btn.addEventListener('click', () => {
      if (!reduced()) {
        // Drop the class and force a reflow before re-adding, so clicking again
        // mid-spin restarts the animation instead of being ignored
        btn.classList.remove('spinning');
        void btn.offsetWidth;
        btn.classList.add('spinning');
      }
      replayBlock(block);
    });
    btn.addEventListener('animationend', (e) => {
      if (e.animationName === 'replay-spin') btn.classList.remove('spinning');
    });

    actions.appendChild(btn);
  });

  // ── Scrub effects ───────────────────────────────────────────────────────
  // All four share one RAF loop. Previously each ran its own, so every frame did
  // four separate getBoundingClientRect() calls — four forced layout reflows.

  const velocityText = document.querySelector('.velocity-text');
  const fillScrub = document.querySelector('.fill-scrub-text');
  const fillBlock = document.querySelector('[data-anim="textFillScrub"]');
  const zoomText = document.querySelector('.zoom-through-text');
  const zoomBlock = document.querySelector('[data-anim="zoomThrough"]');

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  // Fraction of the way through the window-crossing span:
  // 0 when the element's top touches the bottom of the viewport,
  // 1 when its bottom clears the top of the viewport.
  // Right for a continuous offset like parallax, which has no "finish" state.
  function crossProgress(rect, vh) {
    return clamp01((vh - rect.top) / (vh + rect.height));
  }

  // Wrong, though, for an effect that has a climax. crossProgress only reaches 1.0
  // once the block has fully exited the top of the viewport, so Zoom Through's peak
  // scale and its whole fade-out (which starts at 0.75) played off-screen — and on
  // the last block on the page there was no runway left to reach it at all: it
  // capped at 0.693, so it never faded and only ever hit 1.57 of its 2.0 scale.
  // Completing over ZOOM_SPAN of a viewport instead puts the climax on screen with
  // the text near centre, and needs far less trailing room than a full viewport.
  //
  // The block is 60vh (.scroll-block-tall), so the room required below it is
  // vh * (ZOOM_SPAN - 0.6). That scales with the viewport while the trailing room is
  // mostly fixed px (footer + margins), so keep ZOOM_SPAN low enough that the
  // requirement stays satisfiable on tall screens: 0.75 needs only 15vh. At 0.85 it
  // needed 25vh and stopped fitting past ~1600px tall.
  const ZOOM_SPAN = 0.75;
  function zoomProgress(rect, vh) {
    return clamp01((vh - rect.top) / (vh * ZOOM_SPAN));
  }

  const PARALLAX_RANGE = 180;

  // 5b. Letter Scrub Reveal — letters switch on one by one as the pinned block is
  // scrolled through; each one that lands releases a puff of particles onto a
  // canvas that covers the stage. Reduced motion keeps the fade, skips the puff.
  const letterBlock = document.querySelector('[data-anim="letterScrub"]');
  const letterStage = letterBlock && letterBlock.querySelector('.letter-scrub-stage');
  const letterText = letterBlock && letterBlock.querySelector('.letter-scrub-text');
  const letterCanvas = letterBlock && letterBlock.querySelector('.letter-scrub-canvas');
  let letterSpans = [];
  let letterOn = [];
  let letterCtx = null;
  let letterParticles = [];
  let letterColor = '#6fb2d6';
  const LETTER_TAIL = 160;
  const LETTER_GAP = 45; // ms between letters settling; a big scroll step still plays one by one
  let letterLast = 0;

  if (letterText && letterCanvas) {
    letterText.innerHTML = letterText.textContent.replace(/\S/g, '<span class="ls-char">$&</span>');
    letterSpans = Array.from(letterText.querySelectorAll('.ls-char'));
    letterOn = letterSpans.map(() => false);
    letterCtx = letterCanvas.getContext('2d');
    letterColor = getComputedStyle(letterBlock).getPropertyValue('--cat').trim() || letterColor;
    const sizeLetterCanvas = () => {
      letterCanvas.width = letterStage.clientWidth;
      letterCanvas.height = letterStage.clientHeight;
    };
    sizeLetterCanvas();
    window.addEventListener('resize', sizeLetterCanvas);
  }

  function letterPuff(span) {
    if (reduced()) return;
    const r = span.getBoundingClientRect();
    const s = letterStage.getBoundingClientRect();
    const cx = r.left + r.width / 2 - s.left;
    const cy = r.top + r.height / 2 - s.top;
    for (let i = 0; i < 8; i++) {
      letterParticles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.5) * 2.4 - 0.6,
        size: 1 + Math.random() * 2.5,
        life: 1
      });
    }
  }

  function tickLetterScrub(vh) {
    const rect = letterBlock.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < vh;
    if (!onScreen && !letterParticles.length) return;

    // 0 when the stage pins (block top reaches 25vh), 1 when it releases
    // (block bottom reaches 75vh). The whole reveal happens while pinned.
    // Finish LETTER_TAIL px before the stage releases, so the caption that sits at
    // the block's bottom never scrolls up under text that is still arriving.
    const progress = clamp01((vh * 0.25 - rect.top) / (rect.height - vh * 0.5 - LETTER_TAIL));
    // Settle at most one letter every LETTER_GAP ms. One wheel notch can carry
    // several letters over their threshold in a single frame, and toggling them
    // together made them appear as a pair; this keeps it strictly one at a time.
    // Forward: the lowest letter that should be on. Backward: the highest that
    // should be off, so un-writing runs from the end like a backspace.
    const n = letterSpans.length;
    const now = performance.now();
    if (now - letterLast >= LETTER_GAP) {
      let idx = -1;
      for (let i = 0; i < n; i++) {
        if (i / n < progress && !letterOn[i]) { idx = i; break; }
      }
      if (idx === -1) {
        for (let i = n - 1; i >= 0; i--) {
          if (!(i / n < progress) && letterOn[i]) { idx = i; break; }
        }
      }
      if (idx !== -1) {
        const on = !letterOn[idx];
        letterOn[idx] = on;
        letterSpans[idx].classList.toggle('is-on', on);
        if (on) letterPuff(letterSpans[idx]);
        letterLast = now;
      }
    }

    const ctx = letterCtx;
    ctx.clearRect(0, 0, letterCanvas.width, letterCanvas.height);
    if (!letterParticles.length) return;
    ctx.fillStyle = letterColor;
    letterParticles = letterParticles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= 0.025;
      if (p.life <= 0) return false;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
  }

  let lastScrollY = window.scrollY;
  let skew = 0;

  function tickScrub() {
    const vh = window.innerHeight;

    // Parallax. One offset drives every layer; each scales it by its own --depth in
    // CSS, so the differential the eye reads as depth comes for free.
    // Note: `in-view` is owned by the IntersectionObserver — the old loop re-added
    // it every frame, which silently undid replayBlock()'s reset.
    if (parallaxBlock && parallaxStage) {
      const rect = parallaxBlock.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        // Total travel of a depth-1 layer across the crossing. The spread between
        // the back layer (1) and the front tag (-0.45) is 1.45x this.
        const offset = (crossProgress(rect, vh) - 0.5) * PARALLAX_RANGE;
        parallaxStage.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);
      }
    }

    // 31. Velocity Skew — skew follows scroll speed, springs back to 0
    if (velocityText) {
      const y = window.scrollY;
      const velocity = y - lastScrollY;
      lastScrollY = y;
      const target = Math.max(-20, Math.min(20, velocity * 0.8));
      skew += (target - skew) * 0.12;
      velocityText.style.transform =
        `skewY(${skew.toFixed(2)}deg) scaleY(${(1 + Math.abs(skew) * 0.01).toFixed(3)})`;
    }

    // 32. Text Fill Scrub
    if (fillScrub && fillBlock) {
      const rect = fillBlock.getBoundingClientRect();
      const progress = clamp01((vh - rect.top) / (vh + rect.height * 0.5) * 1.4);
      fillScrub.style.backgroundPosition = `${(100 - progress * 100).toFixed(2)}% 0`;
    }

    // 5b. Letter Scrub Reveal
    if (letterBlock && letterCtx) tickLetterScrub(vh);

    // 33. Zoom Through
    if (zoomText && zoomBlock) {
      const rect = zoomBlock.getBoundingClientRect();
      const progress = zoomProgress(rect, vh);
      const scale = 0.6 + progress * 1.4;
      zoomText.style.transform = `scale(${scale.toFixed(3)})`;
      zoomText.style.opacity = progress < 0.75 ? 1 : Math.max(0, 1 - (progress - 0.75) * 4);
    }

    requestAnimationFrame(tickScrub);
  }

  if (parallaxBlock || velocityText || fillScrub || zoomText || letterBlock) {
    requestAnimationFrame(tickScrub);
  }
})();
