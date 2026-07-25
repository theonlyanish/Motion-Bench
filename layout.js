/**
 * Reveal & Layout Page Logic
 */

(function () {
  'use strict';

  const cursorGlow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    document.body.classList.add('show-cursor-glow');
  });

  // 1. Modal
  const modalBtn = document.getElementById('modalBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModal = document.querySelector('.close-modal');

  modalBtn.addEventListener('click', () => {
    modalBackdrop.classList.add('open');
  });
  closeModal.addEventListener('click', () => {
    modalBackdrop.classList.remove('open');
  });
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
  });

  // 2. Accordion
  const accItems = document.querySelectorAll('.acc-item');
  accItems.forEach(item => {
    const header = item.querySelector('.acc-header');
    const content = item.querySelector('.acc-content');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all
      accItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.acc-content').style.height = '0';
      });

      // Open clicked if wasn't active
      if (!isActive) {
        item.classList.add('active');
        content.style.height = content.scrollHeight + 'px';
      }
    });
  });

  // 3. Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const tabIndicator = document.querySelector('.tab-indicator');

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Update nav
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Move indicator
      tabIndicator.style.transform = `translateX(${index * 100}%)`;

      // Update content
      const target = btn.dataset.tab;
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.dataset.tab === target) {
          setTimeout(() => pane.classList.add('active'), 50); // slight delay for fade transition logic
        }
      });
    });
  });

  // 5. Off-canvas
  const menuBtn = document.getElementById('menuBtn');
  const sidePanel = document.getElementById('sidePanel');
  const closePanel = document.querySelector('.close-panel');

  menuBtn.addEventListener('click', () => sidePanel.classList.add('open'));
  closePanel.addEventListener('click', () => sidePanel.classList.remove('open'));

  // 6. Toast
  const toastBtn = document.getElementById('toastBtn');
  const toastContainer = document.getElementById('toastContainer');

  toastBtn.addEventListener('click', () => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Notification Received';
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s, transform 0.5s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  });

  // 7. Grid/List
  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');
  const layoutContainer = document.getElementById('layoutContainer');

  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    
    // Simple fade transition for demo
    layoutContainer.style.opacity = '0';
    setTimeout(() => {
      layoutContainer.classList.remove('list-mode');
      layoutContainer.style.opacity = '1';
    }, 300);
  });

  listBtn.addEventListener('click', () => {
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    
    layoutContainer.style.opacity = '0';
    setTimeout(() => {
      layoutContainer.classList.add('list-mode');
      layoutContainer.style.opacity = '1';
    }, 300);
  });

  // 8. Expandable Card
  const expandCard = document.querySelector('.expand-card');
  const ecContent = document.querySelector('.ec-content');
  expandCard.addEventListener('click', () => {
    expandCard.classList.toggle('open');
  });

  // 9. Stagger Load
  const staggerBtn = document.getElementById('staggerBtn');
  const staggerList = document.getElementById('staggerList');
  const items = staggerList.querySelectorAll('li');

  staggerBtn.addEventListener('click', () => {
    staggerList.classList.remove('show');
    items.forEach(li => li.style.animation = 'none');
    void staggerList.offsetWidth; // trigger reflow
    staggerList.classList.add('show');
    items.forEach((li, i) => {
      li.style.animation = `staggerFade 0.5s var(--ease-out) forwards ${i * 0.1}s`;
    });
  });

  // 10. Dropdown
  const dropBtn = document.getElementById('dropBtn');
  const dropdown = document.querySelector('.dropdown');
  dropBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));

  // 11. Skeleton
  const skeletonCard = document.getElementById('skeletonCard');
  skeletonCard.classList.add('loading'); // Always load for demo

  // 13. Carousel Snap — translate vertical wheel into horizontal scroll
  const carousel = document.querySelector('.carousel-snap');
  if (carousel) {
    const items = carousel.querySelectorAll('.c-item');
    let carouselIndex = 0;

    function snapTo(index) {
      carouselIndex = Math.max(0, Math.min(items.length - 1, index));
      const item = items[carouselIndex];
      const left = item.offsetLeft - (carousel.clientWidth - item.offsetWidth) / 2;
      carousel.scrollTo({ left, behavior: 'smooth' });
    }

    carousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      snapTo(carouselIndex + ((e.deltaY || e.deltaX) > 0 ? 1 : -1));
    }, { passive: false });

    // Drag to scroll (mouse drag does nothing on overflow containers by default)
    let dragStartX = 0;
    let dragStartScroll = 0;
    let isDragging = false;

    carousel.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartScroll = carousel.scrollLeft;
      carousel.setPointerCapture(e.pointerId);
      carousel.style.scrollSnapType = 'none'; // let the drag move freely
      carousel.style.scrollBehavior = 'auto';
      carousel.classList.add('dragging');
    });

    carousel.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      carousel.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove('dragging');
      carousel.style.scrollBehavior = '';
      // Snap to whichever item is closest to the center
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      carousel.style.scrollSnapType = 'none'; // keep off so smooth scrollTo isn't hijacked
      snapTo(best);
    }

    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
  }

  // 14. Stepper — click a step (or anywhere in the stepper) to advance
  const stepper = document.querySelector('.stepper');
  if (stepper) {
    const steps = stepper.querySelectorAll('.step');
    let activeStep = 0;
    stepper.style.cursor = 'pointer';
    stepper.addEventListener('click', () => {
      activeStep = (activeStep + 1) % steps.length;
      steps.forEach((s, i) => s.classList.toggle('active', i <= activeStep));
    });
  }

  // 18. Delete Wipe
  const deleteBtn = document.querySelector('.delete-btn');
  const deleteItem = document.getElementById('deleteItem');
  const resetDelete = document.getElementById('resetDelete');

  deleteBtn.addEventListener('click', () => {
    deleteItem.classList.add('deleting');
    setTimeout(() => {
      deleteItem.style.display = 'none';
      resetDelete.style.display = 'inline-block';
    }, 500);
  });

  resetDelete.addEventListener('click', () => {
    deleteItem.style.display = 'flex';
    deleteItem.classList.remove('deleting');
    resetDelete.style.display = 'none';
  });

  // 20. Badge
  const addBtn = document.getElementById('addBtn');
  const badge = document.getElementById('cartBadge');
  let count = 0;

  addBtn.addEventListener('click', () => {
    count++;
    badge.textContent = count;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  });

  // 21. Confetti Burst
  //
  // Projectile motion with linear air drag, integrated into explicit keyframes and
  // played back with easing:'linear' — so the sampled physics *is* the motion.
  // (A single cubic-bezier can't express "decelerate horizontally while accelerating
  // downward"; an ease-out curve front-loads everything and the burst reads as a blink.)
  //
  //   dv/dt = g - k*v   ->   v(t) = (v0 - g/k)e^(-kt) + g/k
  //   x(t) = (v0x/k)(1 - e^(-kt))
  //   y(t) = ((v0y - g/k)/k)(1 - e^(-kt)) + (g/k)t
  //
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) {
    const colors = ['#7c5cff', '#a78bfa', '#ff006e', '#00f5d4', '#ffd60a'];

    const G = 1600;      // px/s^2 — effective gravity
    const K = 2.2;       // 1/s   — drag; terminal fall speed = G/K ≈ 727 px/s
    const K_ROT = 1.2;   // 1/s   — rotational drag
    const VT = G / K;
    const STEPS = 26;    // keyframes sampled per piece

    confettiBtn.addEventListener('click', () => {
      if (window.A11Y && window.A11Y.reduced) return;

      const rect = confettiBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = cx + 'px';
        piece.style.top = cy + 'px';
        piece.style.background = colors[i % colors.length];
        document.body.appendChild(piece);

        // Launch in an upward cone: theta = -PI/2 + s, so v0y is always negative.
        const s = (Math.random() * 2 - 1) * 0.95;
        const v0 = 700 + Math.random() * 600;
        const v0x = v0 * Math.sin(s);
        const v0y = -v0 * Math.cos(s);

        const durS = 2.4 + Math.random() * 0.8;
        const w0 = (Math.random() < 0.5 ? -1 : 1) * (720 + Math.random() * 1440); // deg/s
        // ~2-6 edge-on flips over the piece's life; faster than this strobes
        const flutter0 = (Math.random() < 0.5 ? -1 : 1) * (300 + Math.random() * 500);
        const flutterPhase = Math.random() * Math.PI * 2;

        const frames = [];
        for (let n = 0; n < STEPS; n++) {
          const p = n / (STEPS - 1);
          const t = p * durS;
          const decay = 1 - Math.exp(-K * t);

          const x = (v0x / K) * decay;
          const y = ((v0y - VT) / K) * decay + VT * t;

          const rot = (w0 / K_ROT) * (1 - Math.exp(-K_ROT * t));
          // Edge-on flip, so pieces flash thin like real paper
          const flip = flutter0 * t + Math.sin(t * 6 + flutterPhase) * 30;

          frames.push({
            offset: p,
            transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
                       `rotate(${rot.toFixed(1)}deg) rotateY(${flip.toFixed(1)}deg)`,
            opacity: p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.3)
          });
        }

        piece.animate(frames, {
          duration: durS * 1000,
          easing: 'linear'   // the physics is already baked into the offsets
        }).onfinish = () => piece.remove();
      }
    });
  }

  // 22. Odometer Counter
  const odometer = document.getElementById('odometer');
  const odometerBtn = document.getElementById('odometerBtn');
  if (odometer && odometerBtn) {
    const DIGITS = 4;
    const strips = [];
    for (let i = 0; i < DIGITS; i++) {
      const digit = document.createElement('div');
      digit.className = 'odo-digit';
      const strip = document.createElement('div');
      strip.className = 'odo-strip';
      for (let n = 0; n <= 9; n++) {
        const s = document.createElement('span');
        s.textContent = n;
        strip.appendChild(s);
      }
      digit.appendChild(strip);
      odometer.appendChild(digit);
      strips.push(strip);
    }

    function rollTo(value) {
      const str = String(value).padStart(DIGITS, '0');
      strips.forEach((strip, i) => {
        strip.style.transform = `translateY(-${(+str[i]) * 52}px)`;
      });
    }

    rollTo(0);
    odometerBtn.addEventListener('click', () => {
      rollTo(Math.floor(Math.random() * 10000));
    });
  }

  // 23. Hamburger Morph
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => hamburgerBtn.classList.toggle('open'));
  }

})();
