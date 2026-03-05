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

  // Global Mouse Move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Main cursor (instant)
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    
    // Default follower movement (lerp handled in loop)
  });

  // Animation Loop for Smooth Follower
  function tick() {
    posX += (mouseX - posX) * 0.2;
    posY += (mouseY - posY) * 0.2;
    
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  }
  tick();

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
      
      // Animate out
      dot.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0)', opacity: 0 }
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
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(0)`;
      follower.style.background = 'rgba(124, 92, 255, 0.2)';
      follower.style.width = '80px';
      follower.style.height = '80px';
      follower.style.borderColor = 'var(--accent)';
    });
    scaleTarget.addEventListener('mouseleave', () => {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(1)`;
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
      glitchInterval = setInterval(() => {
        const ox = (Math.random() - 0.5) * 20;
        const oy = (Math.random() - 0.5) * 20;
        follower.style.transform = `translate(${followerX + ox}px, ${followerY + oy}px) translate(-50%, -50%) skew(${ox}deg)`;
        cursor.style.transform = `translate(${mouseX - ox}px, ${mouseY - oy}px) translate(-50%, -50%)`;
      }, 50);
    });
    glitchArea.addEventListener('mouseleave', () => {
      clearInterval(glitchInterval);
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });
  }

  // 10. Arrow Direction
  const arrowArea = document.querySelector('.arrow-area');
  if (arrowArea) {
    let lastX = 0, lastY = 0;
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
    });
    arrowArea.addEventListener('mousemove', (e) => {
      const arrow = document.getElementById('cursorArrow');
      if (arrow) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        arrow.style.left = e.clientX + 'px';
        arrow.style.top = e.clientY + 'px';
        arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        lastX = e.clientX;
        lastY = e.clientY;
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
      zoomLens.style.left = e.clientX + 'px';
      zoomLens.style.top = e.clientY + 'px';
      
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

})();
