/**
 * Typography Playground — Interactive Experiments
 * Variable fonts, wave distort, noise jitter, path text, magnetic letters, cursor repulsion
 */

(function () {
  'use strict';

  // Reduced-motion: true when the user asked for less motion.
  // Used to skip continuous autoplay loops and jump entrances to their end state.
  function reduced() { return !!(window.A11Y && window.A11Y.reduced); }

  let mouseX = 0, mouseY = 0;
  let magTargets = {};
  let magCurrent = {};
  let repelPositions = [];
  let repelOrigins = [];
  let jitterOffsets = [];
  let jitterPhase = 0;
  let wavePhase = 0;

  // ─── Variable Font Axes ────────────────────────────────────────────
  function initVariableFonts() {
    const weight = document.getElementById('weight');
    const width = document.getElementById('width');
    const slant = document.getElementById('slant');
    const headline = document.getElementById('variableHeadline');
    
    if (!weight || !width || !slant || !headline) return;

    const weightVal = document.getElementById('weightVal');
    const widthVal = document.getElementById('widthVal');
    const slantVal = document.getElementById('slantVal');

    function update() {
      const w = weight.value;
      const wd = width.value;
      const s = slant.value;
      // Use setProperty for better performance and priority
      headline.style.setProperty('font-variation-settings', `'wght' ${w}, 'wdth' ${wd}, 'slnt' ${s}`);
      
      if (weightVal) weightVal.textContent = w;
      if (widthVal) widthVal.textContent = wd;
      if (slantVal) slantVal.textContent = s;
    }

    weight.addEventListener('input', update);
    width.addEventListener('input', update);
    slant.addEventListener('input', update);
    
    // Initial call
    requestAnimationFrame(update);
  }

  // ─── Wave Distort (per-character sine displacement) ─────────────────
  function initWaveDistort() {
    const waveAmp = document.getElementById('waveAmp');
    const waveFreq = document.getElementById('waveFreq');
    const wavePhase = document.getElementById('wavePhase');
    const waveHeadline = document.getElementById('waveHeadline');
    const waveAmpVal = document.getElementById('waveAmpVal');
    const waveFreqVal = document.getElementById('waveFreqVal');
    const wavePhaseVal = document.getElementById('wavePhaseVal');

    const text = 'Wave Distortion';
    waveHeadline.innerHTML = text.split('').map((c, i) =>
      `<span class="wave-char" data-i="${i}">${c}</span>`
    ).join('');
    const chars = waveHeadline.querySelectorAll('.wave-char');

    function update() {
      const amp = +waveAmp.value;
      const freq = +waveFreq.value;
      const phaseRad = (+wavePhase.value / 360) * Math.PI * 2;
      waveAmpVal.textContent = amp;
      waveFreqVal.textContent = freq;
      wavePhaseVal.textContent = wavePhase.value;

      chars.forEach((el, i) => {
        const y = Math.sin((i / (chars.length - 1 || 1)) * Math.PI * 2 * freq + phaseRad) * amp;
        el.style.transform = `translateY(${y}px)`;
      });
    }

    const waveAuto = document.getElementById('waveAuto');
    let phaseAcc = 0;
    waveAmp.addEventListener('input', update);
    waveFreq.addEventListener('input', update);
    wavePhase.addEventListener('input', update);
    update();

    function animateWave() {
      if (waveAuto.checked && !reduced()) {
        phaseAcc += 2;
        wavePhase.value = Math.round(phaseAcc % 360);
        update();
      }
      requestAnimationFrame(animateWave);
    }
    requestAnimationFrame(animateWave);
  }

  // ─── Noise Jitter ───────────────────────────────────────────────────
  function initNoiseJitter() {
    const jitterSlider = document.getElementById('jitter');
    const speedSlider = document.getElementById('jitterSpeed');
    const chars = document.querySelectorAll('.jitter-char');
    const jitterVal = document.getElementById('jitterVal');
    const jitterSpeedVal = document.getElementById('jitterSpeedVal');
    const numChars = chars.length;
    const seeds = Array.from({ length: numChars }, () => Math.random() * 1000);

    function noise1D(x) {
      // fract() of a sine hash — must be wrapped to 0..1 (raw % 1 can be negative)
      const v = Math.sin(x * 12.9898) * 43758.5453;
      return v - Math.floor(v);
    }

    function updateOutputs() {
      jitterVal.textContent = jitterSlider.value;
      jitterSpeedVal.textContent = speedSlider.value;
    }

    jitterSlider.addEventListener('input', updateOutputs);
    speedSlider.addEventListener('input', updateOutputs);
    updateOutputs();

    // Reduced motion: leave characters at rest (no continuous jitter)
    if (reduced()) return;

    function tick() {
      const amount = +jitterSlider.value;
      const speed = +speedSlider.value * 0.01;
      jitterPhase += speed;

      chars.forEach((el, i) => {
        const n1 = noise1D(seeds[i] + jitterPhase);
        const n2 = noise1D(seeds[i] + 100 + jitterPhase);
        const tx = (n1 - 0.5) * 2 * amount;
        const ty = (n2 - 0.5) * 2 * amount;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Text on Path ───────────────────────────────────────────────────
  function initTextOnPath() {
    const pathCurve = document.getElementById('pathCurve');
    const pathEl = document.getElementById('textPath');
    const pathCurveVal = document.getElementById('pathCurveVal');

    // viewBox is 0 0 700 200 at 1:1 scale, .path-text is 2rem (32px).
    // Glyph ink runs from baseline-capHeight to baseline+descender, so the ink's
    // centre sits above the baseline — measured at 11.3px for this face/size.
    const BASELINE = 111.3;
    const MAX_AMP = 60;
    // On a curved path the glyphs rotate with the tangent, which inflates the ink
    // box upward in proportion to the arc depth. Measured at 0.146px per unit amp.
    const TILT_COMP = 0.146;

    // For a quadratic Bezier the mean y over t is (y0 + y1 + y2)/3. Pinning that
    // mean (rather than the endpoints, which the old code did) is what keeps the
    // text centred at every curve value: raising the control point by `amp` drops
    // the two ends by amp/2, leaving the mean unchanged.
    //   mean = (2*(m + amp/2) + (m - amp))/3 = m
    function buildPath(curveVal) {
      const amp = (curveVal / 100) * MAX_AMP;
      const mean = BASELINE + TILT_COMP * amp;
      const cpY = (mean - amp).toFixed(1);
      const endY = (mean + amp / 2).toFixed(1);
      pathEl.setAttribute('d', `M 50 ${endY} Q 350 ${cpY} 650 ${endY}`);
    }

    function update() {
      const c = +pathCurve.value;
      buildPath(c);
      pathCurveVal.textContent = c;
    }

    pathCurve.addEventListener('input', update);
    update();
  }

  // ─── Magnetic Letters ───────────────────────────────────────────────
  function initMagneticLetters() {
    const chars = document.querySelectorAll('.mag-char');
    const wrapper = document.querySelector('.magnetic-wrapper');
    const radius = 120;
    const strength = 0.35;
    const smooth = 0.12;

    chars.forEach((el, i) => {
      magTargets[i] = { x: 0, y: 0 };
      magCurrent[i] = { x: 0, y: 0 };
    });

    function getPos(el) {
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2
      };
    }

    wrapper.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function tick() {
      chars.forEach((el, i) => {
        const pos = getPos(el);
        const dx = mouseX - pos.cx;
        const dy = mouseY - pos.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius && dist > 0) {
          const f = (1 - dist / radius) * strength;
          magTargets[i].x = (dx / dist) * f * 30;
          magTargets[i].y = (dy / dist) * f * 30;
        } else {
          magTargets[i].x *= 0.9;
          magTargets[i].y *= 0.9;
        }
        magCurrent[i].x += (magTargets[i].x - magCurrent[i].x) * smooth;
        magCurrent[i].y += (magTargets[i].y - magCurrent[i].y) * smooth;
        el.style.transform = `translate(${magCurrent[i].x}px, ${magCurrent[i].y}px)`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Cursor Repulsion ───────────────────────────────────────────────
  function initCursorRepulsion() {
    const chars = document.querySelectorAll('.repel-char');
    const wrapper = document.querySelector('.repel-wrapper');
    const strengthSlider = document.getElementById('repelStrength');
    const repelStrengthVal = document.getElementById('repelStrengthVal');

    repelOrigins = [];
    repelPositions = [];
    chars.forEach((el, i) => {
      el.style.position = 'relative';
      const r = el.getBoundingClientRect();
      repelOrigins[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      repelPositions[i] = { x: 0, y: 0 };
    });

    function storeOrigins() {
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const parent = el.offsetParent;
        if (parent) {
          const pr = parent.getBoundingClientRect();
          repelOrigins[i] = {
            x: r.left - pr.left + r.width / 2,
            y: r.top - pr.top + r.height / 2
          };
        }
      });
    }

    window.addEventListener('resize', storeOrigins);
    setTimeout(storeOrigins, 100);

    wrapper.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    strengthSlider.addEventListener('input', () => {
      repelStrengthVal.textContent = strengthSlider.value;
    });
    repelStrengthVal.textContent = strengthSlider.value;

    const smooth = 0.18;
    function tick() {
      const strength = +strengthSlider.value / 100;

      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const maxDist = 150;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * strength * 80;
          const tx = (dx / dist) * force;
          const ty = (dy / dist) * force;
          repelPositions[i].x += (tx - repelPositions[i].x) * smooth;
          repelPositions[i].y += (ty - repelPositions[i].y) * smooth;
        } else {
          repelPositions[i].x *= 0.92;
          repelPositions[i].y *= 0.92;
        }
        el.style.transform = `translate(${repelPositions[i].x}px, ${repelPositions[i].y}px)`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── 3D Tilt ───────────────────────────────────────────────────────
  function init3DTilt() {
    const headline = document.getElementById('tilt3dHeadline');
    const wrapper = document.querySelector('.tilt3d-wrapper');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      const dx = (e.clientX - centerX) / centerX;
      const dy = (e.clientY - centerY) / centerY;
      const rotY = dx * 25;
      const rotX = -dy * 20;
      headline.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  }

  // ─── Glitch ────────────────────────────────────────────────────────
  function initGlitch() {
    const headline = document.getElementById('glitchHeadline');
    const glitchR = headline.querySelector('.glitch-r');
    const glitchG = headline.querySelector('.glitch-g');
    const offsetSlider = document.getElementById('glitchOffset');
    const rgbSlider = document.getElementById('glitchRGB');
    const autoCheck = document.getElementById('glitchAuto');
    const offsetVal = document.getElementById('glitchOffsetVal');
    const rgbVal = document.getElementById('glitchRGBVal');

    offsetSlider.addEventListener('input', () => { offsetVal.textContent = offsetSlider.value; });
    rgbSlider.addEventListener('input', () => { rgbVal.textContent = rgbSlider.value; });
    offsetVal.textContent = offsetSlider.value;
    rgbVal.textContent = rgbSlider.value;

    // Reduced motion: show the clean, un-split headline (no auto glitch loop)
    if (reduced()) {
      glitchR.style.transform = 'translate(0, 0)';
      glitchG.style.transform = 'translate(0, 0)';
      glitchR.style.opacity = '0';
      glitchG.style.opacity = '0';
      return;
    }

    let frame = 0;
    function tick() {
      const offset = +offsetSlider.value;
      const rgb = +rgbSlider.value;
      const active = autoCheck.checked;
      if (active && offset > 0) {
        const rnd = Math.sin(frame * 0.7) * 0.5 + 0.5;
        const rx = (Math.random() - 0.5) * 2 * offset;
        const ry = (Math.random() - 0.5) * 2 * offset;
        const gx = (Math.random() - 0.5) * 2 * offset;
        const gy = (Math.random() - 0.5) * 2 * offset;
        glitchR.style.transform = `translate(${rx}px, ${ry}px)`;
        glitchG.style.transform = `translate(${gx}px, ${gy}px)`;
        glitchR.style.opacity = rgb / 8;
        glitchG.style.opacity = rgb / 8;
      } else {
        glitchR.style.transform = 'translate(0, 0)';
        glitchG.style.transform = 'translate(0, 0)';
        glitchR.style.opacity = '0';
        glitchG.style.opacity = '0';
      }
      frame++;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Scale Wave ────────────────────────────────────────────────────
  function initScaleWave() {
    const headline = document.getElementById('scaleWaveHeadline');
    const ampSlider = document.getElementById('scaleAmp');
    const speedSlider = document.getElementById('scaleSpeed');
    const ampVal = document.getElementById('scaleAmpVal');
    const speedVal = document.getElementById('scaleSpeedVal');

    const text = 'Scale Wave';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="scale-char" data-i="${i}">${c}</span>`
    ).join('');
    const chars = headline.querySelectorAll('.scale-char');

    ampSlider.addEventListener('input', () => { ampVal.textContent = ampSlider.value; });
    speedSlider.addEventListener('input', () => { speedVal.textContent = speedSlider.value; });
    ampVal.textContent = ampSlider.value;
    speedVal.textContent = speedSlider.value;

    // Reduced motion: leave characters at their natural scale
    if (reduced()) return;

    let phase = 0;
    function tick() {
      phase += +speedSlider.value * 0.02;
      const amp = +ampSlider.value / 100;
      chars.forEach((el, i) => {
        const s = 1 + Math.sin(phase + i * 0.5) * amp;
        el.style.transform = `scaleY(${s})`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Blur on Distance ──────────────────────────────────────────────
  function initBlurDistance() {
    const chars = document.querySelectorAll('.blur-char');
    const wrapper = document.querySelector('.blur-distance-wrapper');
    const maxDist = 120;

    wrapper.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function tick() {
      chars.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const blur = Math.min(8, (dist / maxDist) * 8);
        el.style.filter = `blur(${blur}px)`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Color Chase ────────────────────────────────────────────────────
  function initColorChase() {
    const headline = document.getElementById('colorChaseHeadline');
    const wrapper = document.querySelector('.color-chase-wrapper');

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      headline.style.backgroundPosition = `${(1 - x) * 100}% 0`;
    });
  }

  // ─── Staggered Reveal (Framer: staggerChildren) ─────────────────────
  function initStaggeredReveal() {
    const headline = document.getElementById('staggerHeadline');
    const delaySlider = document.getElementById('staggerDelay');
    const delayVal = document.getElementById('staggerDelayVal');
    const replayBtn = document.getElementById('staggerReplay');

    const text = 'Hello World';
    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const chars = text.split('').map((c, i) =>
      `<span class="stagger-char" data-i="${i}">${c}</span>`
    ).join('');
    headline.innerHTML = chars;
    const charEls = headline.querySelectorAll('.stagger-char');

    delaySlider.addEventListener('input', () => { delayVal.textContent = delaySlider.value; });
    delayVal.textContent = delaySlider.value;

    function play() {
      charEls.forEach((el) => {
        el.classList.remove('revealed');
        el.style.transition = 'none';
      });
      const d = +delaySlider.value;
      requestAnimationFrame(() => {
        charEls.forEach((el, i) => {
          el.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * d}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * d}ms`;
          el.classList.add('revealed');
        });
      });
    }

    replayBtn.addEventListener('click', () => {
      charEls.forEach((el) => {
        el.classList.remove('revealed');
        el.style.transition = 'none';
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => play());
      });
    });
    play();
  }

  // ─── Spring Letters (Framer: spring physics) ───────────────────────────
  function initSpringLetters() {
    const headline = document.getElementById('springHeadline');
    const text = 'Spring';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="spring-char" data-i="${i}">${c}</span>`
    ).join('');
    const chars = headline.querySelectorAll('.spring-char');

    const stiffness = 400;
    const damping = 15;
    const targets = {};
    const state = {};
    chars.forEach((el, i) => {
      targets[i] = 0;
      state[i] = { y: 0, v: 0 };
    });

    chars.forEach((el, i) => {
      el.addEventListener('mouseenter', () => { targets[i] = -12; });
      el.addEventListener('mouseleave', () => { targets[i] = 0; });
    });

    function springTick() {
      chars.forEach((el, i) => {
        const s = state[i];
        const dt = 1 / 60;
        const force = (targets[i] - s.y) * stiffness - s.v * damping;
        s.v += force * dt;
        s.y += s.v * dt;
        s.v *= 0.98;
        if (Math.abs(s.v) < 0.01 && Math.abs(targets[i] - s.y) < 0.01) {
          s.y = targets[i];
          s.v = 0;
        }
        el.style.transform = `translateY(${s.y}px)`;
      });
      requestAnimationFrame(springTick);
    }
    requestAnimationFrame(springTick);
  }

  // ─── Scroll Into View (Framer: whileInView) ──────────────────────────
  function initScrollIntoView() {
    const headline = document.getElementById('scrollViewHeadline');
    const section = document.querySelector('.panel-scroll-trigger');
    const text = 'In View';
    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="scroll-char" data-i="${i}" style="transition: opacity 0.6s ${i * 0.06}s ${ease}, transform 0.6s ${i * 0.06}s ${ease}">${c}</span>`
    ).join('');
    const charEls = headline.querySelectorAll('.scroll-char');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          charEls.forEach(el => el.classList.add('in-view'));
        }
      });
    }, { threshold: 0.1 });
    observer.observe(section);

    const replayBtn = document.getElementById('scrollViewReplay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        charEls.forEach((el) => {
          el.style.transition = 'none';
          el.classList.remove('in-view');
        });
        void headline.offsetWidth;
        charEls.forEach((el, i) => {
          el.style.transition = `opacity 0.6s ${i * 0.06}s ${ease}, transform 0.6s ${i * 0.06}s ${ease}`;
          el.classList.add('in-view');
        });
      });
    }
  }

  // ─── Hover Pop (Framer: whileHover) ───────────────────────────────────
  function initHoverPop() {
    const headline = document.getElementById('hoverPopHeadline');
    const text = 'Hover Me';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="hover-pop-char" data-i="${i}">${c}</span>`
    ).join('');
  }

  // ─── Scramble Reveal ──────────────────────────────────────────────────
  function initScrambleReveal() {
    const headline = document.getElementById('scrambleHeadline');
    const speedSlider = document.getElementById('scrambleSpeed');
    const speedVal = document.getElementById('scrambleSpeedVal');
    const replayBtn = document.getElementById('scrambleReplay');

    const text = 'Decoded';
    const chars = '!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="scramble-char" data-i="${i}" data-final="${c}">${c}</span>`
    ).join('');
    const charEls = headline.querySelectorAll('.scramble-char');

    speedSlider.addEventListener('input', () => { speedVal.textContent = speedSlider.value; });
    speedVal.textContent = speedSlider.value;

    function scrambleChar(el, delay) {
      const final = el.dataset.final;
      const iterations = 12 + Math.floor(Math.random() * 8);
      const interval = 40 - (+speedSlider.value / 4);

      let i = 0;
      const t = setInterval(() => {
        el.textContent = chars[Math.floor(Math.random() * chars.length)];
        i++;
        if (i >= iterations) {
          el.textContent = final;
          clearInterval(t);
        }
      }, Math.max(20, interval));
    }

    function play() {
      charEls.forEach((el, i) => {
        const delay = i * 50;
        setTimeout(() => scrambleChar(el, delay), delay);
      });
    }

    replayBtn.addEventListener('click', play);
    // Reduced motion: skip the auto-scramble; the text already reads its final value
    if (!reduced()) play();
  }

  // ─── Shadow Chase ─────────────────────────────────────────────────────
  function initShadowChase() {
    const headline = document.getElementById('shadowChaseHeadline');
    const wrapper = document.querySelector('.shadow-chase-wrapper');

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const hw = rect.width / 2;
      const hh = rect.height / 2;
      const cx = rect.left + hw;
      const cy = rect.top + hh;
      const dx = (e.clientX - cx) / hw;
      const dy = (e.clientY - cy) / hh;
      const len = 24 + Math.sqrt(dx * dx + dy * dy) * 16;
      const angle = Math.atan2(dy, dx);
      const ox = Math.cos(angle) * len;
      const oy = Math.sin(angle) * len;
      headline.style.textShadow = `${ox}px ${oy}px 20px rgba(124, 92, 255, 0.5)`;
    });
  }

  // ─── Letter Flip ──────────────────────────────────────────────────────
  function initLetterFlip() {
    const headline = document.getElementById('letterFlipHeadline');
    const text = 'Flip';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="flip-char" data-i="${i}">${c}</span>`
    ).join('');
  }

  // ─── Breathing ─────────────────────────────────────────────────────────
  function initBreathing() {
    const headline = document.getElementById('breathingHeadline');
    const speedSlider = document.getElementById('breathSpeed');
    const speedVal = document.getElementById('breathSpeedVal');

    speedSlider.addEventListener('input', () => { speedVal.textContent = speedSlider.value; });
    speedVal.textContent = speedSlider.value;

    // Reduced motion: hold a steady scale (no breathing pulse)
    if (reduced()) return;

    let phase = 0;
    function tick() {
      phase += +speedSlider.value * 0.008;
      const s = 1 + Math.sin(phase) * 0.04;
      headline.style.transform = `scale(${s})`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Gradient Sweep ───────────────────────────────────────────────────
  function initGradientSweep() {
    const headline = document.getElementById('gradientSweepHeadline');
    const speedSlider = document.getElementById('sweepSpeed');
    const speedVal = document.getElementById('sweepSpeedVal');

    speedSlider.addEventListener('input', () => { speedVal.textContent = speedSlider.value; });
    speedVal.textContent = speedSlider.value;

    // Reduced motion: park the gradient in a pleasant static position
    if (reduced()) { headline.style.backgroundPosition = '50% 50%'; return; }

    let offset = 0;
    function tick() {
      offset += +speedSlider.value * 0.15;
      if (offset >= 300) offset = 0;
      headline.style.backgroundPosition = `${offset}% 50%`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Code Decode ──────────────────────────────────────────────────────
  function initCodeDecode() {
    const el = document.querySelector('.code-text');
    if (!el) return;
    const final = el.dataset.value;
    const chars = '01';
    let interval = null;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        el.innerText = final
          .split('')
          .map((letter, index) => {
            if (index < iteration) return final[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        if (iteration >= final.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(interval);
      el.innerText = '01010101';
    });
  }

  // ─── Spotlight Reveal ─────────────────────────────────────────────────
  function initSpotlight() {
    const wrapper = document.getElementById('spotlightWrapper');
    const mask = document.getElementById('spotlightMask');
    if (!wrapper || !mask) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mask.style.setProperty('--x', `${x}px`);
      mask.style.setProperty('--y', `${y}px`);
    });
  }

  // ─── Cursor Glow ───────────────────────────────────────────────────
  function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    const isTouch = 'ontouchstart' in window;

    if (isTouch) {
      document.body.classList.remove('show-cursor-glow');
      document.body.style.cursor = 'auto';
      return;
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.left = mouseX + 'px';
      glow.style.top = mouseY + 'px';
      document.body.classList.add('show-cursor-glow');
    });

    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('show-cursor-glow');
    });
  }

  // ─── Weight Wave (variable font 'wght' animated per character) ───────
  function initWeightWave() {
    const headline = document.getElementById('weightWaveHeadline');
    const speedSlider = document.getElementById('weightWaveSpeed');
    const speedVal = document.getElementById('weightWaveSpeedVal');
    if (!headline || !speedSlider) return;

    const text = 'Heavy Light';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="weight-wave-char" data-i="${i}">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
    const chars = headline.querySelectorAll('.weight-wave-char');

    speedSlider.addEventListener('input', () => { speedVal.textContent = speedSlider.value; });
    speedVal.textContent = speedSlider.value;

    // Reduced motion: set a single uniform weight (no travelling wave)
    if (reduced()) {
      chars.forEach((el) => { el.style.fontVariationSettings = "'wght' 500"; });
      return;
    }

    let phase = 0;
    function tick() {
      phase += +speedSlider.value * 0.015;
      chars.forEach((el, i) => {
        // Wave of weight 100..900 travelling through the word
        const w = 500 + Math.sin(phase - i * 0.6) * 400;
        el.style.fontVariationSettings = `'wght' ${Math.round(w)}`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ─── Stroke Draw (SVG text stroke-dasharray self-drawing) ────────────
  function initStrokeDraw() {
    const textEl = document.getElementById('strokeText');
    const replayBtn = document.getElementById('strokeReplay');
    if (!textEl) return;

    // SVG <text> has no getTotalLength(), so the glyph outline perimeter has to be
    // estimated. getComputedTextLength() is the *advance width* — not the outline —
    // and the old `* 2.5` fell well short of it. When stroke-dasharray is shorter
    // than the real outline the pattern REPEATS, so a second dash starts partway
    // through and leaves a visible seam mid-glyph (this is what showed up on the
    // R and the A, whose counters put the wrap point inside the letter).
    //
    // Model each glyph as its bbox perimeter 2(w + h) times ~1.6 for the inner
    // counters that most letters carry:  actual ~= 3.2 * (W + N*h)
    function measure() {
      const W = textEl.getComputedTextLength();          // total advance width
      const h = textEl.getBBox().height;                 // ink height
      const N = (textEl.textContent.replace(/\s/g, '') || ' ').length;
      const unit = W + N * h;

      // `bound` must exceed the true perimeter so the pattern can never repeat.
      // `draw`  must also exceed it (an undershoot would leave letters unfinished),
      // but only slightly, so the reveal spans almost the whole duration.
      return { bound: Math.ceil(5.5 * unit), draw: Math.ceil(3.8 * unit) };
    }

    function play() {
      textEl.classList.remove('drawing');

      let bound = 3300, draw = 2280; // fallbacks if measurement throws
      try { ({ bound, draw } = measure()); } catch (e) {}

      textEl.style.strokeDasharray = bound;
      // Reveal by walking the offset from `bound` down to `bound - draw` — never to
      // 0, which would idle for ~40% of the duration after the outline is complete.
      textEl.style.setProperty('--dash-from', bound);
      textEl.style.setProperty('--dash-to', bound - draw);
      textEl.style.strokeDashoffset = bound;
      void textEl.getBoundingClientRect();
      textEl.classList.add('drawing');
    }

    // Reduced motion: show the finished, filled text without the drawing animation
    function playOrStatic() {
      if (reduced()) {
        textEl.classList.remove('drawing');
        textEl.style.strokeDasharray = 'none';
        textEl.style.strokeDashoffset = '0';
        textEl.style.fill = 'var(--text-primary)';
        return;
      }
      play();
    }

    if (replayBtn) replayBtn.addEventListener('click', play);
    // Fonts must be loaded before measuring
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(playOrStatic);
    } else {
      playOrStatic();
    }
  }

  // ─── Gravity Drop (per-letter gravity + floor bounce physics) ────────
  function initGravityDrop() {
    const headline = document.getElementById('gravityHeadline');
    const wrapper = document.getElementById('gravityWrapper');
    if (!headline || !wrapper) return;

    const text = 'Timber!';
    headline.innerHTML = text.split('').map((c, i) =>
      `<span class="gravity-char" data-i="${i}">${c}</span>`
    ).join('');
    const chars = headline.querySelectorAll('.gravity-char');

    let dropped = false;
    let bodies = [];
    let rafId = null;

    function drop() {
      const wrapRect = wrapper.getBoundingClientRect();
      bodies = Array.from(chars).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          y: 0,
          vy: -(2 + Math.random() * 3),           // small upward pop first
          rot: 0,
          vr: (Math.random() - 0.5) * 10,
          floor: wrapRect.bottom - r.bottom,      // distance to wrapper floor
          delay: Math.random() * 15,               // frames before falling
          bounces: 0
        };
      });

      function tick() {
        let alive = false;
        bodies.forEach((b) => {
          if (b.delay > 0) { b.delay--; alive = true; return; }
          b.vy += 0.9;                             // gravity
          b.y += b.vy;
          b.rot += b.vr;
          if (b.y >= b.floor) {
            b.y = b.floor;
            b.vy *= -0.45;                         // restitution
            b.vr *= 0.6;
            b.bounces++;
            if (Math.abs(b.vy) < 1 || b.bounces > 4) { b.vy = 0; b.vr = 0; }
          }
          if (b.vy !== 0 || b.y < b.floor) alive = true;
          b.el.style.transform = `translateY(${b.y}px) rotate(${b.rot}deg)`;
        });
        if (alive) rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }

    function reset() {
      if (rafId) cancelAnimationFrame(rafId);
      chars.forEach((el) => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'translateY(0) rotate(0deg)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    }

    wrapper.addEventListener('click', () => {
      dropped = !dropped;
      if (dropped) drop(); else reset();
    });
  }

  // ─── Gooey Text (SVG goo filter, sized to the text) ──────────────────
  function initGooey() {
    const wrap = document.querySelector('.gooey-wrapper');
    const text = document.querySelector('.gooey-text');
    const blur = document.querySelector('#gooey-filter feGaussianBlur');
    const matrix = document.querySelector('#gooey-filter feColorMatrix');
    if (!wrap || !text || !blur || !matrix) return;

    // A bare url(#id) resolves against the document base URL. A <base> tag
    // (injected by some extensions and by CodePen-style previews) turns it into
    // a cross-document reference that Chrome won't load. Referencing the filter
    // by the page's own absolute URL sidesteps that. about:/blob: documents
    // keep the bare form.
    const base = location.href.split('#')[0];
    const ref = /^https?:/.test(base) ? 'url("' + base + '#gooey-filter")' : 'url(#gooey-filter)';

    // Blur is in pixels, so scale it with the font size: LEVEL is "goo per 50px
    // of text", which keeps the look the same at every viewport width.
    const LEVEL = 1.5;
    const K = 20;
    const THRESHOLD = Math.max(0.2, 0.45 - 0.02 * LEVEL);

    function apply() {
      const sd = LEVEL * parseFloat(getComputedStyle(text).fontSize) / 50;
      blur.setAttribute('stdDeviation', sd.toFixed(2));
      matrix.setAttribute('values',
        '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + K + ' ' + (-(K * THRESHOLD)).toFixed(1));
      // Re-attach the filter so Chrome repaints with the new primitives instead
      // of showing the letters unfiltered until something else invalidates them.
      wrap.style.filter = 'none';
      void wrap.offsetWidth;
      wrap.style.filter = ref;
    }

    apply();
    window.addEventListener('load', apply);
    window.addEventListener('resize', apply);
  }

  // ─── Init ───────────────────────────────────────────────────────────
  function init() {
    initGooey();
    initVariableFonts();
    initWaveDistort();
    initNoiseJitter();
    initTextOnPath();
    initMagneticLetters();
    initCursorRepulsion();
    init3DTilt();
    initGlitch();
    initScaleWave();
    initBlurDistance();
    initColorChase();
    initStaggeredReveal();
    initSpringLetters();
    initScrollIntoView();
    initHoverPop();
    initScrambleReveal();
    initShadowChase();
    initLetterFlip();
    initBreathing();
    initGradientSweep();
    initSpotlight();
    initCodeDecode();
    initWeightWave();
    initStrokeDraw();
    initGravityDrop();
    initCursorGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
