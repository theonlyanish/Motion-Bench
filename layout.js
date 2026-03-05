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
  setInterval(() => {
    // Toggle loading state for demo
    // skeletonCard.classList.add('loading');
  }, 3000);
  skeletonCard.classList.add('loading'); // Always load for demo

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

})();
