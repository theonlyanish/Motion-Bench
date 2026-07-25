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
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) {
    const colors = ['#7c5cff', '#a78bfa', '#ff006e', '#00f5d4', '#ffd60a'];
    confettiBtn.addEventListener('click', () => {
      const rect = confettiBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = cx + 'px';
        piece.style.top = cy + 'px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(piece);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 150 + Math.random() * 250;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 150; // bias upward
        const rot = (Math.random() - 0.5) * 720;

        piece.animate([
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${tx * 0.6}px, ${ty * 0.6}px) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.4 },
          { transform: `translate(${tx}px, ${ty + 400}px) rotate(${rot}deg)`, opacity: 0 } // gravity pulls down
        ], {
          duration: 1200 + Math.random() * 600,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
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
