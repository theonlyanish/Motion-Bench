/**
 * Gallery Effects — Interactive Image Playground
 */

(function () {
  'use strict';

  // 1. 3D Tilt Card
  const tiltCard = document.querySelector('.tilt-card');
  const tiltInner = tiltCard && tiltCard.querySelector('.tilt-inner');

  if (tiltCard && tiltInner) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;
      const rotX = -yPct * 15;
      const rotY = xPct * 15;
      tiltInner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // 2. Parallax Scroll (RAF Loop)
  const parallaxContainer = document.querySelector('.parallax-container');
  const parallaxImg = document.querySelector('.parallax-img');

  if (parallaxContainer && parallaxImg) {
    function tickParallax() {
      const rect = parallaxContainer.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        const y = (progress - 0.5) * 80;
        parallaxImg.style.transform = `translateY(${y}px)`;
      }
      requestAnimationFrame(tickParallax);
    }
    requestAnimationFrame(tickParallax);
  }

  // 3. Magnetic Cursor
  const magneticWrap = document.querySelector('.magnetic-wrap');
  const magneticCursor = document.querySelector('.magnetic-cursor');

  if (magneticWrap && magneticCursor) {
    magneticWrap.addEventListener('mousemove', (e) => {
      const rect = magneticWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      magneticCursor.style.left = `${x}px`;
      magneticCursor.style.top = `${y}px`;
      magneticCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    magneticWrap.addEventListener('mouseleave', () => {
      magneticCursor.style.transform = 'translate(-50%, -50%) scale(0)';
    });
  }

  // 4. Glitch Image
  const glitchImg = document.querySelector('.glitch-img');
  const layers = glitchImg ? glitchImg.querySelectorAll('.glitch-layer') : [];

  if (glitchImg && layers.length) {
    glitchImg.addEventListener('mousemove', (e) => {
      const rect = glitchImg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      layers.forEach((layer, i) => {
        const factor = (i + 1) * 5;
        const moveX = (x - 0.5) * factor;
        const moveY = (y - 0.5) * factor;
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    glitchImg.addEventListener('mouseleave', () => {
      layers.forEach((layer) => {
        layer.style.transform = 'translate(0, 0)';
      });
    });
  }

  // 5. Slice Reveal
  const sliceReveal = document.querySelector('.slice-reveal');
  const slices = sliceReveal ? sliceReveal.querySelectorAll('.slice') : [];

  if (sliceReveal && slices.length) {
    sliceReveal.addEventListener('mouseenter', () => {
      slices.forEach((slice, i) => {
        slice.style.transform = 'scaleY(0)';
        slice.style.transitionDelay = `${i * 0.1}s`;
      });
    });

    sliceReveal.addEventListener('mouseleave', () => {
      slices.forEach((slice, i) => {
        slice.style.transform = 'scaleY(1)';
        slice.style.transitionDelay = `${i * 0.05}s`;
      });
    });
  }

  // 6. Ink Spread
  const inkSpread = document.querySelector('.ink-spread');
  const inkMask = document.querySelector('.ink-mask');

  if (inkSpread && inkMask) {
    inkSpread.addEventListener('mouseenter', () => {
      inkMask.style.transform = 'scaleY(0)';
    });
    inkSpread.addEventListener('mouseleave', () => {
      inkMask.style.transform = 'scaleY(1)';
    });
  }

  // 7. Perspective Rotate
  const perspectiveRotate = document.querySelector('.perspective-rotate');
  const perspectiveImg = perspectiveRotate && perspectiveRotate.querySelector('img');

  if (perspectiveRotate && perspectiveImg) {
    perspectiveRotate.addEventListener('mousemove', (e) => {
      const rect = perspectiveRotate.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;
      const rotX = -yPct * 15;
      const rotY = xPct * 15;
      perspectiveImg.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(0.95)`;
    });

    perspectiveRotate.addEventListener('mouseleave', () => {
      perspectiveImg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // 8. Center Reveal
  const centerReveal = document.querySelector('.center-reveal');
  const centerMask = document.querySelector('.center-mask');

  if (centerReveal && centerMask) {
    centerReveal.addEventListener('mouseenter', () => {
      centerMask.style.transform = 'translate(-50%, -50%) scale(3)';
    });
    centerReveal.addEventListener('mouseleave', () => {
      centerMask.style.transform = 'translate(-50%, -50%) scale(0)';
    });
  }

  // 9. Slide Behind
  const slideBehind = document.querySelector('.slide-behind');
  const imgFront = document.querySelector('.img-front');

  if (slideBehind && imgFront) {
    slideBehind.addEventListener('mouseenter', () => {
      imgFront.style.transform = 'translateX(60px) translateY(-40px) scale(0.8)';
    });
    slideBehind.addEventListener('mouseleave', () => {
      imgFront.style.transform = 'translateX(0) translateY(0) scale(1)';
    });
  }

  // 10. Flash Overlay
  const flashOverlay = document.querySelector('.flash-overlay');
  const flash = document.querySelector('.flash');

  if (flashOverlay && flash) {
    flashOverlay.addEventListener('mouseenter', () => {
      flash.style.opacity = '0.6';
      setTimeout(() => {
        flash.style.opacity = '0';
      }, 100);
    });
  }

  // 11. Pan on Hover
  const panHover = document.querySelector('.pan-hover');
  const panImg = document.querySelector('.pan-img');

  if (panHover && panImg) {
    panHover.addEventListener('mousemove', (e) => {
      const rect = panHover.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;
      panImg.style.transformOrigin = `${xPct}% ${yPct}%`;
      panImg.style.transform = 'scale(1.2)';
    });

    panHover.addEventListener('mouseleave', () => {
      panImg.style.transform = 'scale(1)';
    });
  }

  // 12. Directional Overlay
  const dirOverlay = document.querySelector('.dir-overlay');
  const dirContent = document.querySelector('.dir-content');

  if (dirOverlay && dirContent) {
    dirOverlay.addEventListener('mouseenter', (e) => {
      const rect = dirOverlay.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Determine direction: 0=top, 1=right, 2=bottom, 3=left (roughly)
      const direction = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
      
      const from = [
        'translateY(-100%)', // top
        'translateX(100%)',  // right
        'translateY(100%)',  // bottom
        'translateX(-100%)'  // left
      ][direction];

      dirContent.style.transition = 'none';
      dirContent.style.transform = from;
      
      requestAnimationFrame(() => {
        dirContent.style.transition = 'transform 0.4s ease';
        dirContent.style.transform = 'translate(0, 0)';
      });
    });

    dirOverlay.addEventListener('mouseleave', (e) => {
      const rect = dirOverlay.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const direction = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;

      const to = [
        'translateY(-100%)', // top
        'translateX(100%)',  // right
        'translateY(100%)',  // bottom
        'translateX(-100%)'  // left
      ][direction];

      dirContent.style.transform = to;
    });
  }

  // 13. Video Hover
  const videoHover = document.querySelector('.video-hover');
  const videoContainer = document.querySelector('.video-container');
  if (videoHover && videoContainer) {
    const src = videoHover.dataset.video;
    let video = null;

    videoHover.addEventListener('mouseenter', () => {
      if (!video) {
        video = document.createElement('video');
        video.src = src;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        videoContainer.appendChild(video);
      }
      video.play().catch(() => {});
    });

    videoHover.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  // 30. Ripple Effect (JS Animation)
  const rippleEffect = document.querySelector('.ripple-effect');
  const rippleFilter = document.querySelector('#ripple-filter feDisplacementMap');
  
  if (rippleEffect && rippleFilter) {
    let rippleScale = 0;
    let targetScale = 0;
    
    rippleEffect.addEventListener('mouseenter', () => { targetScale = 30; });
    rippleEffect.addEventListener('mouseleave', () => { targetScale = 0; });
    
    function tickRipple() {
      rippleScale += (targetScale - rippleScale) * 0.1;
      rippleFilter.setAttribute('scale', rippleScale);
      requestAnimationFrame(tickRipple);
    }
    requestAnimationFrame(tickRipple);
  }

  // 33. Before / After Comparison Slider
  const compareSlider = document.getElementById('compareSlider');
  if (compareSlider) {
    let dragging = false;

    function setSplit(clientX) {
      const rect = compareSlider.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      compareSlider.style.setProperty('--split', pct + '%');
    }

    // Stop the browser's native image drag from hijacking the gesture
    compareSlider.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
    });
    compareSlider.addEventListener('dragstart', (e) => e.preventDefault());

    compareSlider.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dragging = true;
      compareSlider.setPointerCapture(e.pointerId);
      setSplit(e.clientX);
    });
    compareSlider.addEventListener('pointermove', (e) => {
      if (dragging) setSplit(e.clientX);
    });
    compareSlider.addEventListener('pointerup', () => { dragging = false; });
    compareSlider.addEventListener('pointercancel', () => { dragging = false; });
  }

})();
