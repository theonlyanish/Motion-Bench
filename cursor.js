/**
 * Cursor & Pointer Page Logic
 */

(function () {
  'use strict';

  const cursor = document.getElementById('mainCursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;
  let followerX = 0, followerY = 0;

  let primed = false;
  // Dot scale + per-effect offset, applied by the RAF loop (which owns the transform)
  let cursorScale = 1;
  let cursorOX = 0, cursorOY = 0;

  // Global Mouse Move — only record coords here; all writes happen in the RAF loop
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!primed) {
      // First move: snap both cursors to the pointer instead of easing in from (0,0)
      posX = followerX = mouseX;
      posY = followerY = mouseY;
      primed = true;
    }
  });

  // Glitch offsets (applied inside the RAF loop so they aren't overwritten)
  let glitchActive = false;
  let glitchOX = 0, glitchOY = 0;

  // Frame-rate independent smoothing: alpha = 1 - e^(-dt/tau).
  // tau is the lag in ms — the follower ring is the only element allowed to lag.
  const FOLLOWER_TAU = 70;
  let lastT = 0;

  function tick(now) {
    const dt = lastT ? Math.min(now - lastT, 64) : 16.7;
    lastT = now;

    // Dot is pinned to the true pointer so trail/rope heads line up with it exactly
    posX = mouseX + cursorOX;
    posY = mouseY + cursorOY;
    cursor.style.transform =
      `translate(${posX}px, ${posY}px) translate(-50%, -50%) scale(${cursorScale})`;

    const a = 1 - Math.exp(-dt / FOLLOWER_TAU);
    followerX += (mouseX - followerX) * a;
    followerY += (mouseY - followerY) * a;

    if (glitchActive) {
      follower.style.transform = `translate(${followerX + glitchOX}px, ${followerY + glitchOY}px) translate(-50%, -50%) skew(${glitchOX}deg)`;
    } else {
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // 1. Magnetic Button
  const magArea = document.querySelector('.magnetic-area');
  const magBtn = document.querySelector('.magnetic-btn');
  if (magArea && magBtn) {
    magArea.addEventListener('mousemove', (e) => {
      const rect = magBtn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 80) {
        magBtn.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
        follower.style.width = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'var(--accent)';
      } else {
        magBtn.style.transform = `translate(0, 0)`;
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.borderColor = 'rgba(255,255,255,0.5)';
      }
    });
    magArea.addEventListener('mouseleave', () => {
      magBtn.style.transform = `translate(0, 0)`;
    });
  }

  // 2. Blend Mode
  const blendArea = document.querySelector('.blend-area');
  if (blendArea) {
    blendArea.addEventListener('mouseenter', () => {
      cursor.style.width = '30px';
      cursor.style.height = '30px';
      follower.style.opacity = '0';
    });
    blendArea.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      follower.style.opacity = '1';
    });
  }

  // 3. Mask Reveal
  const maskArea = document.querySelector('.mask-area');
  const maskFront = document.querySelector('.mask-front');
  if (maskArea && maskFront) {
    maskArea.addEventListener('mousemove', (e) => {
      const rect = maskArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      maskFront.style.clipPath = `circle(25% at ${x}px ${y}px)`;
    });
    maskArea.addEventListener('mouseleave', () => {
      maskFront.style.clipPath = `circle(0% at 50% 50%)`;
    });
  }

  // 4. Cursor Trail (Dots)
  const trailArea = document.querySelector('.trail-area');
  if (trailArea) {
    let dots = [];
    trailArea.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.5) return; // Limit density
      const dot = document.createElement('div');
      dot.style.position = 'fixed';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      dot.style.width = '6px';
      dot.style.height = '6px';
      dot.style.background = 'var(--accent)';
      dot.style.borderRadius = '50%';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = '9997';
      document.body.appendChild(dot);
      
      // Animate out. The translate(-50%,-50%) must live in the keyframes — a base
      // transform would be replaced by the animation, leaving each dot offset by
      // half its size (down-right of the pointer) for its whole life.
      dot.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out'
      }).onfinish = () => dot.remove();
    });
  }

  // 5. Scale Interaction
  const scaleArea = document.querySelector('.scale-area');
  const scaleTarget = document.querySelector('.scale-target');
  if (scaleTarget) {
    scaleTarget.addEventListener('mouseenter', () => {
      cursorScale = 0;
      follower.style.background = 'rgba(124, 92, 255, 0.2)';
      follower.style.width = '80px';
      follower.style.height = '80px';
      follower.style.borderColor = 'var(--accent)';
    });
    scaleTarget.addEventListener('mouseleave', () => {
      cursorScale = 1;
      follower.style.background = 'transparent';
      follower.style.width = '40px';
      follower.style.height = '40px';
      follower.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    });
  }

  // 6. Text Cursor
  const textArea = document.querySelector('.text-cursor-area');
  const textLabel = document.createElement('div');
  textLabel.className = 'cursor-text-label';
  textLabel.style.position = 'fixed';
  textLabel.style.pointerEvents = 'none';
  textLabel.style.color = '#fff';
  textLabel.style.fontWeight = '700';
  textLabel.style.fontSize = '12px';
  textLabel.style.opacity = '0';
  textLabel.style.zIndex = '9999';
  textLabel.style.textTransform = 'uppercase';
  document.body.appendChild(textLabel);

  if (textArea) {
    textArea.addEventListener('mouseenter', () => {
      textLabel.textContent = textArea.dataset.cursorText;
      textLabel.style.opacity = '1';
      cursor.style.opacity = '0';
      follower.style.width = '60px';
      follower.style.height = '60px';
      follower.style.background = 'var(--accent)';
      follower.style.borderColor = 'transparent';
      follower.style.mixBlendMode = 'normal';
    });
    textArea.addEventListener('mousemove', (e) => {
      textLabel.style.left = e.clientX + 'px';
      textLabel.style.top = e.clientY + 'px';
      textLabel.style.transform = 'translate(-50%, -50%)';
    });
    textArea.addEventListener('mouseleave', () => {
      textLabel.style.opacity = '0';
      cursor.style.opacity = '1';
      follower.style.width = '40px';
      follower.style.height = '40px';
      follower.style.background = 'transparent';
      follower.style.borderColor = 'rgba(255,255,255,0.5)';
    });
  }

  // 7. Spotlight
  const spotlightArea = document.querySelector('.spotlight-area');
  const spotlightLayer = document.querySelector('.spotlight-layer');
  if (spotlightArea && spotlightLayer) {
    spotlightArea.addEventListener('mousemove', (e) => {
      const rect = spotlightArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightLayer.style.setProperty('--x', x + 'px');
      spotlightLayer.style.setProperty('--y', y + 'px');
    });
    spotlightArea.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    spotlightArea.addEventListener('mouseleave', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // 8. Sticky Element
  const stickyArea = document.querySelector('.sticky-area');
  const stickyItem = document.querySelector('.sticky-item');
  if (stickyItem) {
    stickyItem.addEventListener('mouseenter', () => {
      follower.style.borderRadius = '12px';
      follower.style.width = '100px';
      follower.style.height = '100px';
      follower.style.borderColor = 'var(--accent)';
      cursor.style.opacity = '0';
    });
    stickyItem.addEventListener('mousemove', (e) => {
       const rect = stickyItem.getBoundingClientRect();
       const cx = rect.left + rect.width / 2;
       const cy = rect.top + rect.height / 2;
       followerX = cx;
       followerY = cy;
    });
    stickyItem.addEventListener('mouseleave', () => {
      follower.style.borderRadius = '50%';
      follower.style.width = '40px';
      follower.style.height = '40px';
      follower.style.borderColor = 'rgba(255,255,255,0.5)';
      cursor.style.opacity = '1';
    });
  }

  // 9. Glitch Cursor
  const glitchArea = document.querySelector('.glitch-area');
  if (glitchArea) {
    let glitchInterval;
    glitchArea.addEventListener('mouseenter', () => {
      glitchActive = true;
      glitchInterval = setInterval(() => {
        glitchOX = (Math.random() - 0.5) * 20;
        glitchOY = (Math.random() - 0.5) * 20;
        // Dot jitters opposite the ring; the RAF loop applies it
        cursorOX = -glitchOX;
        cursorOY = -glitchOY;
      }, 50);
    });
    glitchArea.addEventListener('mouseleave', () => {
      clearInterval(glitchInterval);
      glitchActive = false;
      glitchOX = 0; glitchOY = 0;
      cursorOX = 0; cursorOY = 0;
    });
  }

  // 10. Arrow Direction
  const arrowArea = document.querySelector('.arrow-area');
  if (arrowArea) {
    let lastX = 0, lastY = 0;
    let arrowAngle = 0;      // smoothed angle actually rendered
    let targetAngle = 0;     // latest raw movement angle
    let arrowRafOn = false;

    function tickArrow() {
      const arrow = document.getElementById('cursorArrow');
      if (!arrow) { arrowRafOn = false; return; }
      // Rotate along the shortest path so diagonals don't spin the long way round
      let diff = targetAngle - arrowAngle;
      diff = ((diff + 180) % 360 + 360) % 360 - 180;
      arrowAngle += diff * 0.25;
      arrow.style.transform = `translate(-50%, -50%) rotate(${arrowAngle}deg)`;
      requestAnimationFrame(tickArrow);
    }

    arrowArea.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0';
      follower.style.width = '0';
      follower.style.height = '0';
      // Create arrow
      const arrow = document.createElement('div');
      arrow.id = 'cursorArrow';
      arrow.style.position = 'fixed';
      arrow.style.width = '0'; 
      arrow.style.height = '0'; 
      arrow.style.borderLeft = '10px solid transparent';
      arrow.style.borderRight = '10px solid transparent';
      arrow.style.borderBottom = '20px solid var(--accent)';
      arrow.style.pointerEvents = 'none';
      arrow.style.zIndex = '9999';
      arrow.style.transformOrigin = 'center';
      document.body.appendChild(arrow);
      lastX = mouseX;
      lastY = mouseY;
      arrowAngle = targetAngle;
      if (!arrowRafOn) {
        arrowRafOn = true;
        requestAnimationFrame(tickArrow);
      }
    });
    arrowArea.addEventListener('mousemove', (e) => {
      const arrow = document.getElementById('cursorArrow');
      if (arrow) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        // Ignore sub-pixel jitters — they produce wildly noisy angles on diagonals
        if (Math.sqrt(dx * dx + dy * dy) > 3) {
          targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
          lastX = e.clientX;
          lastY = e.clientY;
        }
        arrow.style.left = e.clientX + 'px';
        arrow.style.top = e.clientY + 'px';
      }
    });
    arrowArea.addEventListener('mouseleave', () => {
      const arrow = document.getElementById('cursorArrow');
      if (arrow) arrow.remove();
      cursor.style.opacity = '1';
      follower.style.width = '40px';
      follower.style.height = '40px';
    });
  }

  // 11. Image Trail
  const imgTrailArea = document.querySelector('.img-trail-area');
  if (imgTrailArea) {
    let lastTime = 0;
    imgTrailArea.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime > 100) { // Limit spawn rate
        const img = document.createElement('img');
        img.src = 'https://picsum.photos/id/10/80/60';
        img.className = 'trail-img';
        img.style.left = e.clientX + 'px';
        img.style.top = e.clientY + 'px';
        img.style.transform = 'translate(-50%, -50%) scale(0.5)';
        document.body.appendChild(img);
        
        requestAnimationFrame(() => {
          img.style.opacity = '0.8';
          img.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        setTimeout(() => {
          img.style.opacity = '0';
          img.style.transform = 'translate(-50%, -50%) scale(0.5)';
          setTimeout(() => img.remove(), 300);
        }, 500);

        lastTime = now;
      }
    });
  }

  // 12. Zoom Lens
  const zoomArea = document.querySelector('.zoom-area');
  const zoomLens = document.querySelector('.zoom-lens');
  if (zoomArea && zoomLens) {
    zoomArea.addEventListener('mousemove', (e) => {
      const rect = zoomArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      zoomLens.style.left = x + 'px';
      zoomLens.style.top = y + 'px';
      
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      zoomLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
    });
    zoomArea.addEventListener('mouseenter', () => {
      zoomLens.style.opacity = '1';
      zoomLens.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    zoomArea.addEventListener('mouseleave', () => {
      zoomLens.style.opacity = '0';
      zoomLens.style.transform = 'translate(-50%, -50%) scale(0)';
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // 13. Emoji Cursor
  const emojiArea = document.querySelector('.emoji-area');
  if (emojiArea) {
    const emojiEl = document.createElement('div');
    emojiEl.style.position = 'fixed';
    emojiEl.style.fontSize = '40px';
    emojiEl.style.pointerEvents = 'none';
    emojiEl.style.zIndex = '9999';
    emojiEl.style.opacity = '0';
    emojiEl.textContent = emojiArea.dataset.emoji;
    document.body.appendChild(emojiEl);

    emojiArea.addEventListener('mousemove', (e) => {
      emojiEl.style.left = e.clientX + 'px';
      emojiEl.style.top = e.clientY + 'px';
      emojiEl.style.transform = 'translate(-50%, -50%)';
    });
    emojiArea.addEventListener('mouseenter', () => {
      emojiEl.style.opacity = '1';
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    emojiArea.addEventListener('mouseleave', () => {
      emojiEl.style.opacity = '0';
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // 14. Ripple Click
  const rippleArea = document.querySelector('.ripple-area');
  if (rippleArea) {
    rippleArea.addEventListener('click', (e) => {
      const rip = document.createElement('div');
      rip.style.position = 'fixed';
      rip.style.left = e.clientX + 'px';
      rip.style.top = e.clientY + 'px';
      rip.style.width = '10px';
      rip.style.height = '10px';
      rip.style.border = '2px solid var(--accent)';
      rip.style.borderRadius = '50%';
      rip.style.pointerEvents = 'none';
      rip.style.zIndex = '9998';
      rip.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(rip);

      rip.animate([
        { width: '10px', height: '10px', opacity: 1 },
        { width: '200px', height: '200px', opacity: 0 }
      ], { duration: 600, easing: 'ease-out' }).onfinish = () => rip.remove();
    });
  }

  // 15. Elastic Line
  const elasticArea = document.querySelector('.elastic-line-area');
  const elasticPath = document.querySelector('.elastic-svg path');
  if (elasticArea && elasticPath) {
    elasticArea.addEventListener('mousemove', (e) => {
      const rect = elasticArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      elasticPath.setAttribute('d', `M0 100 Q ${x} ${y} ${rect.width} 100`);
    });
    elasticArea.addEventListener('mouseleave', () => {
      // Bounce back animation could be complex, just reset for now
      elasticPath.setAttribute('d', `M0 100 Q ${elasticArea.offsetWidth/2} 100 ${elasticArea.offsetWidth} 100`);
    });
  }

  // 16. Noise Aura (was previously unimplemented)
  const noiseArea = document.querySelector('.noise-area');
  if (noiseArea) {
    const nCanvas = document.createElement('canvas');
    nCanvas.width = 120; nCanvas.height = 120;
    nCanvas.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);opacity:0;transition:opacity 0.2s;border-radius:50%;';
    document.body.appendChild(nCanvas);
    const nCtx = nCanvas.getContext('2d');
    let noiseOn = false;

    function drawNoise() {
      const imgData = nCtx.createImageData(120, 120);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const px = (i / 4) % 120 - 60;
        const py = Math.floor(i / 4 / 120) - 60;
        const dist = Math.sqrt(px * px + py * py);
        if (dist > 60) continue; // circular mask
        const v = Math.random() * 255;
        const alpha = Math.max(0, 1 - dist / 60) * 180;
        d[i] = v; d[i + 1] = v; d[i + 2] = v;
        d[i + 3] = Math.random() > 0.6 ? alpha : 0;
      }
      nCtx.clearRect(0, 0, 120, 120);
      nCtx.putImageData(imgData, 0, 0);
      if (noiseOn) requestAnimationFrame(drawNoise);
    }

    noiseArea.addEventListener('mousemove', (e) => {
      nCanvas.style.left = e.clientX + 'px';
      nCanvas.style.top = e.clientY + 'px';
    });
    noiseArea.addEventListener('mouseenter', () => {
      noiseOn = true;
      nCanvas.style.opacity = '1';
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      drawNoise();
    });
    noiseArea.addEventListener('mouseleave', () => {
      noiseOn = false;
      nCanvas.style.opacity = '0';
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // 17. Video Cursor
  const videoArea = document.querySelector('.video-cursor-area');
  if (videoArea) {
    const videoFloat = document.createElement('div');
    videoFloat.className = 'video-float';
    const videoSrc = videoArea.querySelector('video').src;
    const v = document.createElement('video');
    v.src = videoSrc;
    v.loop = true;
    v.muted = true;
    videoFloat.appendChild(v);
    document.body.appendChild(videoFloat);

    videoArea.addEventListener('mousemove', (e) => {
      videoFloat.style.left = e.clientX + 'px';
      videoFloat.style.top = e.clientY + 'px';
    });
    videoArea.addEventListener('mouseenter', () => {
      videoFloat.style.transform = 'translate(-50%, -50%) scale(1)';
      v.play();
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    videoArea.addEventListener('mouseleave', () => {
      videoFloat.style.transform = 'translate(-50%, -50%) scale(0)';
      v.pause();
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // 18. Perspective Tilt
  const perspArea = document.querySelector('.perspective-area');
  const plane = document.querySelector('.tilt-plane');
  if (perspArea && plane) {
    perspArea.addEventListener('mousemove', (e) => {
      const rect = perspArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 20; // deg
      const yPct = (y / rect.height - 0.5) * 20;
      plane.style.transform = `rotateX(${-yPct}deg) rotateY(${xPct}deg)`;
    });
    perspArea.addEventListener('mouseleave', () => {
      plane.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  }

  // 19. Dot Grid Repel
  const dotArea = document.querySelector('.dot-grid-area');
  if (dotArea) {
    // Generate dots
    for (let i = 0; i < 80; i++) {
      const d = document.createElement('div');
      d.className = 'grid-dot';
      dotArea.appendChild(d);
    }
    const dots = document.querySelectorAll('.grid-dot');
    
    dotArea.addEventListener('mousemove', (e) => {
      const rect = dotArea.getBoundingClientRect();
      const mx = e.clientX;
      const my = e.clientY;
      
      dots.forEach(dot => {
        const r = dot.getBoundingClientRect();
        const cx = r.left + r.width/2;
        const cy = r.top + r.height/2;
        const dist = Math.sqrt(Math.pow(mx - cx, 2) + Math.pow(my - cy, 2));
        
        if (dist < 60) {
          const angle = Math.atan2(my - cy, mx - cx);
          const force = (60 - dist) * 0.5;
          const moveX = Math.cos(angle) * -force;
          const moveY = Math.sin(angle) * -force;
          dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          dot.style.transform = `translate(0, 0)`;
        }
      });
    });
    dotArea.addEventListener('mouseleave', () => {
      dots.forEach(d => d.style.transform = `translate(0,0)`);
    });
  }

  // 20. Circle Progress
  const progArea = document.querySelector('.progress-area');
  if (progArea) {
    const canvas = document.createElement('canvas');
    canvas.width = 60; canvas.height = 60;
    canvas.style.position = 'fixed';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let progress = 0;
    let isHolding = false;
    let animId;

    function draw() {
      ctx.clearRect(0, 0, 60, 60);
      ctx.beginPath();
      ctx.arc(30, 30, 25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(30, 30, 25, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * progress));
      ctx.strokeStyle = '#7c5cff';
      ctx.lineWidth = 4;
      ctx.stroke();

      if (isHolding && progress < 1) {
        progress += 0.02;
        animId = requestAnimationFrame(draw);
      } else if (!isHolding && progress > 0) {
        progress -= 0.05;
        if (progress < 0) progress = 0;
        animId = requestAnimationFrame(draw);
      }
    }

    progArea.addEventListener('mousemove', (e) => {
      canvas.style.left = e.clientX + 'px';
      canvas.style.top = e.clientY + 'px';
    });
    progArea.addEventListener('mousedown', () => { isHolding = true; draw(); });
    progArea.addEventListener('mouseup', () => { isHolding = false; });
    progArea.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      canvas.style.opacity = '1';
      isHolding = false; progress = 0; draw();
    });
    progArea.addEventListener('mouseleave', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
      canvas.style.opacity = '0';
      isHolding = false;
    });
  }

  // 21. Particle Sparks
  const sparksArea = document.querySelector('.sparks-area');
  const sparksCanvas = document.querySelector('.sparks-canvas');
  if (sparksArea && sparksCanvas) {
    const sctx = sparksCanvas.getContext('2d');
    let particles = [];

    function resizeSparks() {
      sparksCanvas.width = sparksArea.clientWidth;
      sparksCanvas.height = sparksArea.clientHeight;
    }
    resizeSparks();
    window.addEventListener('resize', resizeSparks);

    sparksArea.addEventListener('mousemove', (e) => {
      const rect = sparksArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 3; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 1,
          life: 1,
          size: 1 + Math.random() * 2.5,
          hue: 255 + Math.random() * 40 // purple range
        });
      }
    });

    function tickSparks() {
      sctx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // slight gravity
        p.life -= 0.02;
        if (p.life <= 0) return; // negative radius would throw and kill the loop
        sctx.globalAlpha = p.life;
        sctx.fillStyle = `hsl(${p.hue}, 90%, 70%)`;
        sctx.beginPath();
        sctx.arc(p.x, p.y, Math.max(0, p.size * p.life), 0, Math.PI * 2);
        sctx.fill();
      });
      sctx.globalAlpha = 1;
      requestAnimationFrame(tickSparks);
    }
    requestAnimationFrame(tickSparks);
  }

  // 22. Rope Trail — chain of segments, each chasing the previous
  const ropeArea = document.querySelector('.rope-area');
  const ropeLine = document.querySelector('.rope-svg polyline');
  if (ropeArea && ropeLine) {
    const SEGMENTS = 18;
    const pts = Array.from({ length: SEGMENTS }, () => ({ x: 0, y: 0 }));
    let ropeX = 0, ropeY = 0, inside = false;

    ropeArea.addEventListener('mousemove', (e) => {
      const rect = ropeArea.getBoundingClientRect();
      ropeX = e.clientX - rect.left;
      ropeY = e.clientY - rect.top;
      if (!inside) {
        // Snap the whole rope to entry point to avoid a whip from (0,0)
        pts.forEach(p => { p.x = ropeX; p.y = ropeY; });
        inside = true;
      }
    });
    ropeArea.addEventListener('mouseleave', () => { inside = false; });

    // Per-segment lag in ms. Frame-rate independent, so the rope has the same
    // length and slack at 60Hz and 144Hz instead of snapping tight on fast displays.
    const SEG_TAU = 38;
    let ropeLast = 0;

    function tickRope(now) {
      const dt = ropeLast ? Math.min(now - ropeLast, 64) : 16.7;
      ropeLast = now;
      const a = 1 - Math.exp(-dt / SEG_TAU);

      // Head is pinned to the cursor, each segment chases the one before it,
      // so the rope always trails behind instead of drifting ahead
      pts[0].x = ropeX;
      pts[0].y = ropeY;
      for (let i = 1; i < SEGMENTS; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * a;
        pts[i].y += (pts[i - 1].y - pts[i].y) * a;
      }
      ropeLine.setAttribute('points', pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
      requestAnimationFrame(tickRope);
    }
    requestAnimationFrame(tickRope);
  }

})();
