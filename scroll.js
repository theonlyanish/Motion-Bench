/**
 * Scroll Animations — 20 scroll-triggered effects (replayable)
 */

(function () {
  'use strict';

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

  // Typewriter effect
  function runTypewriter(block) {
    if (!twChars || !block.querySelector('.tw-chars')) return;
    const target = block.querySelector('.tw-chars');
    const text = 'Typewriter Reveal';
    target.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        target.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
  }

  function resetTypewriter(block) {
    const target = block && block.querySelector('.tw-chars');
    if (target) target.textContent = '';
  }

  // Counter Up
  function runCounter(block) {
    const target = block.querySelector('.counter-text');
    if (!target) return;
    const end = +target.dataset.target;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(end / 40);
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      target.textContent = current;
    }, 30);
  }

  function resetCounter(block) {
    const target = block.querySelector('.counter-text');
    if (target) target.textContent = '0';
  }

  // Replay: reset block and re-trigger
  function replayBlock(block) {
    block.classList.remove('in-view');
    if (block.dataset.anim === 'typewriter') resetTypewriter(block);
    if (block.dataset.anim === 'counter') resetCounter(block);
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
})();
