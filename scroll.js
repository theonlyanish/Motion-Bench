/**
 * Scroll Animations — scroll-triggered effects (replayable)
 */

(function () {
  'use strict';

  function reduced() { return !!(window.A11Y && window.A11Y.reduced); }

  const blocks = document.querySelectorAll('.scroll-block');
  const parallaxBlock = document.querySelector('[data-anim="parallax"]');
  const parallaxInner = document.querySelector('.parallax-inner');
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

  // Add replay buttons
  blocks.forEach((block) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'replay-btn';
    btn.textContent = 'Replay';
    btn.setAttribute('aria-label', 'Replay animation');
    btn.addEventListener('click', () => replayBlock(block));
    block.appendChild(btn);
  });

  // Parallax: scroll progress (RAF loop for Lenis compatibility)
  function updateParallax() {
    if (!parallaxBlock || !parallaxInner) return;
    
    // Use RAF loop instead of scroll event for smoother sync with Lenis
    function tick() {
      const rect = parallaxBlock.getBoundingClientRect();
      const blockHeight = parallaxBlock.offsetHeight;
      const viewHeight = window.innerHeight;
      const inView = rect.top < viewHeight && rect.bottom > 0;
      
      if (inView) {
        parallaxBlock.classList.add('in-view');
        parallaxInner.classList.add('parallax-active');
        // Map scroll position to offset
        const progress = (viewHeight - rect.top) / (viewHeight + blockHeight);
        // Clamp progress between 0 and 1 roughly
        const offset = (progress - 0.5) * 100; // Increased range for visibility
        parallaxInner.style.setProperty('--parallax-offset', `${offset}px`);
      } else {
        parallaxInner.classList.remove('parallax-active');
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  updateParallax();

  // 31. Velocity Skew — skew amount follows scroll speed
  const velocityText = document.querySelector('.velocity-text');
  if (velocityText) {
    let lastScrollY = window.scrollY;
    let skew = 0;
    function tickVelocity() {
      const y = window.scrollY;
      const velocity = y - lastScrollY;
      lastScrollY = y;
      const target = Math.max(-20, Math.min(20, velocity * 0.8));
      skew += (target - skew) * 0.12; // spring back toward 0
      velocityText.style.transform = `skewY(${skew}deg) scaleY(${1 + Math.abs(skew) * 0.01})`;
      requestAnimationFrame(tickVelocity);
    }
    requestAnimationFrame(tickVelocity);
  }

  // 32. Text Fill Scrub — fill tied to scroll progress through the section
  const fillScrub = document.querySelector('.fill-scrub-text');
  const fillBlock = document.querySelector('[data-anim="textFillScrub"]');
  if (fillScrub && fillBlock) {
    function tickFill() {
      const rect = fillBlock.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section enters at bottom, 1 when its center passes viewport center
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height * 0.5) * 1.4));
      fillScrub.style.backgroundPosition = `${100 - progress * 100}% 0`;
      requestAnimationFrame(tickFill);
    }
    requestAnimationFrame(tickFill);
  }

  // 33. Zoom Through — scale + fade tied to scroll progress
  const zoomText = document.querySelector('.zoom-through-text');
  const zoomBlock = document.querySelector('[data-anim="zoomThrough"]');
  if (zoomText && zoomBlock) {
    function tickZoom() {
      const rect = zoomBlock.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const scale = 0.6 + progress * 1.4;         // grows as you scroll through
      const opacity = progress < 0.75 ? 1 : Math.max(0, 1 - (progress - 0.75) * 4);
      zoomText.style.transform = `scale(${scale})`;
      zoomText.style.opacity = opacity;
      requestAnimationFrame(tickZoom);
    }
    requestAnimationFrame(tickZoom);
  }
})();
