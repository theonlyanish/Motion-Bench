/**
 * Standalone code snippets for the Reveal & Layout page (layout.html).
 * Each entry is keyed by the section's data-fx attribute and holds
 * self-contained, copy-paste-ready html / css / js strings.
 * Rendered by code-panel.js.
 */
window.EFFECT_SNIPPETS = {

  // ── 1. Modal Scale ────────────────────────────────────
  modal: {
    html: `<button class="trigger-btn" id="modalBtn">Open Modal</button>

<div class="modal-backdrop" id="modalBackdrop">
  <div class="modal-content">
    <h2>Modal Title</h2>
    <p>This is a modal window with a smooth scale and backdrop blur animation.</p>
    <button class="close-modal">Close</button>
  </div>
</div>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  background: #12121a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #f0f0f5;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  transform: scale(0.8);
  /* Overshooting cubic-bezier gives the iOS-style spring */
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-backdrop.open .modal-content {
  transform: scale(1);
}

.close-modal {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
    js: `var modalBtn = document.getElementById('modalBtn');
var modalBackdrop = document.getElementById('modalBackdrop');
var closeModal = document.querySelector('.close-modal');

modalBtn.addEventListener('click', function () {
  modalBackdrop.classList.add('open');
});
closeModal.addEventListener('click', function () {
  modalBackdrop.classList.remove('open');
});
// Clicking the dimmed backdrop (not the dialog) also closes it
modalBackdrop.addEventListener('click', function (e) {
  if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
});`
  },

  // ── 2. Accordion ──────────────────────────────────────
  accordion: {
    html: `<div class="accordion">
  <div class="acc-item">
    <div class="acc-header">Accordion Item 1</div>
    <div class="acc-content">
      <p>Content expands smoothly with height animation.</p>
    </div>
  </div>
  <div class="acc-item">
    <div class="acc-header">Accordion Item 2</div>
    <div class="acc-content">
      <p>More details revealed here.</p>
    </div>
  </div>
</div>`,
    css: `.accordion {
  width: 100%;
  max-width: 400px;
  color: #f0f0f5;
}

.acc-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.acc-header {
  padding: 1rem 0;
  cursor: pointer;
  font-weight: 600;
}

.acc-content {
  height: 0; /* JS animates this to the content's scrollHeight */
  overflow: hidden;
  color: #6b6b80;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}`,
    js: `var accItems = document.querySelectorAll('.acc-item');

accItems.forEach(function (item) {
  var header = item.querySelector('.acc-header');
  var content = item.querySelector('.acc-content');

  header.addEventListener('click', function () {
    var isActive = item.classList.contains('active');

    // Close all items first
    accItems.forEach(function (i) {
      i.classList.remove('active');
      i.querySelector('.acc-content').style.height = '0';
    });

    // Open the clicked one if it wasn't already open.
    // Animating to the measured scrollHeight lets CSS
    // transition height smoothly to an "auto"-like value.
    if (!isActive) {
      item.classList.add('active');
      content.style.height = content.scrollHeight + 'px';
    }
  });
});`
  },

  // ── 3. Tabs Fade ──────────────────────────────────────
  tabs: {
    html: `<div class="tabs-container">
  <div class="tabs-nav">
    <button class="tab-btn active" data-tab="1">Tab 1</button>
    <button class="tab-btn" data-tab="2">Tab 2</button>
    <div class="tab-indicator"></div>
  </div>
  <div class="tabs-content">
    <div class="tab-pane active" data-tab="1">Content 1</div>
    <div class="tab-pane" data-tab="2">Content 2</div>
  </div>
</div>`,
    css: `.tabs-container {
  width: 100%;
  max-width: 400px;
  color: #f0f0f5;
}

.tabs-nav {
  display: flex;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 1rem;
}

.tab-btn {
  flex: 1;
  padding: 0.8rem;
  background: none;
  border: none;
  color: #6b6b80;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.tab-btn.active {
  color: #7c5cff;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #7c5cff;
  width: 50%; /* 100% / number of tabs */
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Panes are stacked so they can crossfade */
.tabs-content {
  position: relative;
  height: 40px;
}

.tab-pane {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s;
}

.tab-pane.active {
  opacity: 1;
  transform: translateY(0);
}`,
    js: `var tabBtns = document.querySelectorAll('.tab-btn');
var tabPanes = document.querySelectorAll('.tab-pane');
var tabIndicator = document.querySelector('.tab-indicator');

tabBtns.forEach(function (btn, index) {
  btn.addEventListener('click', function () {
    // Update nav highlight
    tabBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    // Slide the underline: each step is one indicator-width
    tabIndicator.style.transform = 'translateX(' + (index * 100) + '%)';

    // Crossfade content — slight delay lets the old pane fade out first
    var target = btn.dataset.tab;
    tabPanes.forEach(function (pane) {
      pane.classList.remove('active');
      if (pane.dataset.tab === target) {
        setTimeout(function () { pane.classList.add('active'); }, 50);
      }
    });
  });
});`
  },

  // ── 4. Card Flip (pure CSS) ───────────────────────────
  cardFlip: {
    html: `<div class="flip-card">
  <div class="flip-inner">
    <div class="flip-front">Front</div>
    <div class="flip-back">Back</div>
  </div>
</div>`,
    css: `.flip-card {
  width: 140px;
  height: 180px;
  perspective: 600px; /* gives the rotation its 3D depth */
  cursor: pointer;
  color: #f0f0f5;
}

.flip-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.flip-card:hover .flip-inner {
  transform: rotateY(180deg);
}

.flip-front,
.flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* hides the reversed side */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.flip-front {
  background: #222;
}

.flip-back {
  background: #7c5cff;
  transform: rotateY(180deg); /* pre-flipped so it reads correctly */
  color: #fff;
}`
  },

  // ── 5. Off-canvas ─────────────────────────────────────
  offcanvas: {
    html: `<button class="trigger-btn" id="menuBtn">Open Menu</button>

<div class="side-panel" id="sidePanel">
  <button class="close-panel">&times;</button>
  <h2>Menu</h2>
  <ul>
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</div>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: #12121a;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  color: #f0f0f5;
  z-index: 2001;
  padding: 2rem;
  transform: translateX(100%); /* parked off-screen */
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
}

.side-panel.open {
  transform: translateX(0);
}

.side-panel ul {
  list-style: none;
  padding: 0;
}

.side-panel li {
  margin: 1rem 0;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

.close-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}`,
    js: `var menuBtn = document.getElementById('menuBtn');
var sidePanel = document.getElementById('sidePanel');
var closePanel = document.querySelector('.close-panel');

menuBtn.addEventListener('click', function () {
  sidePanel.classList.add('open');
});
closePanel.addEventListener('click', function () {
  sidePanel.classList.remove('open');
});`
  },

  // ── 6. Toast ──────────────────────────────────────────
  toast: {
    html: `<button class="trigger-btn" id="toastBtn">Show Toast</button>

<div class="toast-container" id="toastContainer"></div>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* Toasts stack up from the bottom-right corner */
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toast {
  background: #12121a;
  border: 1px solid #7c5cff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  min-width: 200px;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
    js: `var toastBtn = document.getElementById('toastBtn');
var toastContainer = document.getElementById('toastContainer');
var LIFETIME = 3000; // ms before the toast fades out

toastBtn.addEventListener('click', function () {
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Notification Received';
  toastContainer.appendChild(toast);

  // Entry is handled by the CSS animation; exit is done inline
  setTimeout(function () {
    toast.style.transition = 'opacity 0.5s, transform 0.5s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(function () { toast.remove(); }, 500);
  }, LIFETIME);
});`
  },

  // ── 7. Grid to List ───────────────────────────────────
  gridList: {
    html: `<div class="view-controls">
  <button class="view-btn active" id="gridBtn">Grid</button>
  <button class="view-btn" id="listBtn">List</button>
</div>
<div class="layout-grid" id="layoutContainer">
  <div class="l-item"></div>
  <div class="l-item"></div>
  <div class="l-item"></div>
  <div class="l-item"></div>
</div>`,
    css: `.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
  transition: opacity 0.3s;
}

/* Single column = list layout */
.layout-grid.list-mode {
  grid-template-columns: 1fr;
}

.l-item {
  height: 60px;
  background: #333;
  border-radius: 6px;
}

.view-controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid #555;
  color: #888;
  border-radius: 4px;
  cursor: pointer;
}

.view-btn.active {
  border-color: #7c5cff;
  color: #7c5cff;
}`,
    js: `var gridBtn = document.getElementById('gridBtn');
var listBtn = document.getElementById('listBtn');
var container = document.getElementById('layoutContainer');
var FADE = 300; // ms — matches the CSS opacity transition

// Fade out, swap the grid template, fade back in
function switchTo(listMode) {
  container.style.opacity = '0';
  setTimeout(function () {
    container.classList.toggle('list-mode', listMode);
    container.style.opacity = '1';
  }, FADE);
}

gridBtn.addEventListener('click', function () {
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
  switchTo(false);
});

listBtn.addEventListener('click', function () {
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
  switchTo(true);
});`
  },

  // ── 8. Expandable Card ────────────────────────────────
  expandCard: {
    html: `<div class="expand-card">
  <div class="ec-header">
    <h3>Expand Me</h3>
    <span class="ec-icon">+</span>
  </div>
  <div class="ec-content">
    <p>Additional details revealed with a shared layout transition feel.</p>
  </div>
</div>`,
    css: `.expand-card {
  width: 100%;
  max-width: 320px;
  background: #222;
  color: #f0f0f5;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 60px; /* collapsed: only the header shows */
}

.expand-card.open {
  max-height: 200px;
  background: #2a2a30;
}

.ec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ec-header h3 {
  margin: 0;
}

/* The + rotates 45deg into an x */
.ec-icon {
  transition: transform 0.4s;
}

.expand-card.open .ec-icon {
  transform: rotate(45deg);
}

/* Content fades in slightly after the height expands */
.ec-content {
  margin-top: 1rem;
  opacity: 0;
  transition: opacity 0.3s 0.1s;
}

.expand-card.open .ec-content {
  opacity: 1;
}`,
    js: `var expandCard = document.querySelector('.expand-card');

expandCard.addEventListener('click', function () {
  expandCard.classList.toggle('open');
});`
  },

  // ── 9. Stagger Load ───────────────────────────────────
  staggerLoad: {
    html: `<button class="trigger-btn" id="staggerBtn">Reload List</button>
<ul class="stagger-list-ui" id="staggerList">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.stagger-list-ui {
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 320px;
}

.stagger-list-ui li {
  background: #333;
  color: #f0f0f5;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes staggerFade {
  to { opacity: 1; transform: translateX(0); }
}`,
    js: `var staggerBtn = document.getElementById('staggerBtn');
var staggerList = document.getElementById('staggerList');
var items = staggerList.querySelectorAll('li');
var STEP = 0.1; // s delay between items
var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function play() {
  // Clear any running animation, force a reflow so it can restart
  items.forEach(function (li) { li.style.animation = 'none'; });
  void staggerList.offsetWidth;
  items.forEach(function (li, i) {
    li.style.animation =
      'staggerFade 0.5s ' + EASE + ' forwards ' + (i * STEP) + 's';
  });
}

staggerBtn.addEventListener('click', play);
play(); // animate on load too`
  },

  // ── 10. Dropdown ──────────────────────────────────────
  dropdown: {
    html: `<div class="dropdown">
  <button class="trigger-btn" id="dropBtn">Options</button>
  <div class="dropdown-menu">
    <a href="#">Edit</a>
    <a href="#">Duplicate</a>
    <a href="#">Delete</a>
  </div>
</div>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #12121a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 120px;
  transform-origin: top left; /* grows out from the trigger corner */
  transform: scale(0.8);
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown.open .dropdown-menu {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

.dropdown-menu a {
  color: #6b6b80;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.dropdown-menu a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}`,
    js: `var dropBtn = document.getElementById('dropBtn');
var dropdown = document.querySelector('.dropdown');

dropBtn.addEventListener('click', function (e) {
  e.stopPropagation(); // keep the document click handler from firing
  dropdown.classList.toggle('open');
});

// Clicking anywhere else closes the menu
document.addEventListener('click', function () {
  dropdown.classList.remove('open');
});`
  },

  // ── 11. Skeleton Load (pure CSS) ──────────────────────
  skeleton: {
    html: `<div class="skeleton-card loading">
  <div class="sk-img"></div>
  <div class="sk-line w-80"></div>
  <div class="sk-line w-60"></div>
</div>`,
    css: `.skeleton-card {
  width: 100%;
  max-width: 320px;
}

.sk-img {
  width: 100%;
  height: 100px;
  background: #222;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.sk-line {
  height: 12px;
  background: #222;
  border-radius: 4px;
  margin-bottom: 0.4rem;
}

.w-80 { width: 80%; }
.w-60 { width: 60%; }

/* A moving gradient highlight creates the shimmer.
   Remove the .loading class when real content arrives. */
.skeleton-card.loading .sk-img,
.skeleton-card.loading .sk-line {
  background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
  },

  // ── 12. FAB Expand (pure CSS) ─────────────────────────
  fab: {
    html: `<div class="fab-container">
  <button class="fab-main">+</button>
  <div class="fab-actions">
    <button class="fab-mini">A</button>
    <button class="fab-mini">B</button>
  </div>
</div>`,
    css: `.fab-container {
  position: relative;
  width: 50px;
  height: 50px;
  /* Bottom-anchor the FAB so the expanded stack has room to grow upward. In a
     flex container use justify-content: flex-end on the parent instead. */
  margin-top: 120px;
}

.fab-main {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #7c5cff;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: transform 0.3s;
}

/* Actions stack directly above the button (bottom: 100%) instead of being pushed
   there by a fixed translateY(-100px). The old travel put the top mini button
   ~188px above the container, which overflowed a 240px demo box and clipped it.
   Stack height now: 2*40 + 8 gap + 8 offset + 50 button = 146px. */
.fab-actions {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
}

.fab-mini {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #444;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transform: translateY(12px) scale(0.4);
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hovering (or tabbing into) the container: + rotates into x, minis pop upward */
.fab-container:hover .fab-main,
.fab-container:focus-within .fab-main {
  transform: rotate(45deg);
}

.fab-container:hover .fab-mini,
.fab-container:focus-within .fab-mini {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Nearest button leads, so the stack unfurls upward */
.fab-container:hover .fab-mini:nth-child(2),
.fab-container:focus-within .fab-mini:nth-child(2) {
  transition-delay: 0.06s;
}`
  },

  // ── 13. Carousel Snap ─────────────────────────────────
  carousel: {
    html: `<div class="carousel-snap">
  <div class="c-item">1</div>
  <div class="c-item">2</div>
  <div class="c-item">3</div>
  <div class="c-item">4</div>
</div>`,
    css: `.carousel-snap {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  width: 100%;
  max-width: 400px;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory; /* native CSS snapping */
  cursor: grab;
  user-select: none;
  /* Windows/Chrome renders a white native scrollbar here otherwise */
  scrollbar-width: thin;
  scrollbar-color: #7c5cff rgba(255, 255, 255, 0.08);
}

.carousel-snap::-webkit-scrollbar {
  height: 6px;
}

.carousel-snap::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
}

.carousel-snap::-webkit-scrollbar-thumb {
  background: #7c5cff;
  border-radius: 3px;
}

.carousel-snap::-webkit-scrollbar-thumb:hover {
  background: #a78bfa;
}

.carousel-snap::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

.carousel-snap.dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}

.c-item {
  min-width: 80%;
  height: 120px;
  background: #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #555;
  scroll-snap-align: center;
}`,
    js: `// The CSS scroll-snap works on its own with touch / trackpad.
// This JS adds mouse-wheel paging and click-drag scrolling.
var carousel = document.querySelector('.carousel-snap');
var items = carousel.querySelectorAll('.c-item');
var carouselIndex = 0;

function snapTo(index) {
  carouselIndex = Math.max(0, Math.min(items.length - 1, index));
  var item = items[carouselIndex];
  var left = item.offsetLeft - (carousel.clientWidth - item.offsetWidth) / 2;
  carousel.scrollTo({ left: left, behavior: 'smooth' });
}

// Vertical wheel scrolls advance one card at a time
carousel.addEventListener('wheel', function (e) {
  e.preventDefault();
  snapTo(carouselIndex + ((e.deltaY || e.deltaX) > 0 ? 1 : -1));
}, { passive: false });

// Drag to scroll (mouse drag does nothing on overflow containers by default)
var dragStartX = 0;
var dragStartScroll = 0;
var isDragging = false;

carousel.addEventListener('pointerdown', function (e) {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartScroll = carousel.scrollLeft;
  carousel.setPointerCapture(e.pointerId);
  carousel.style.scrollSnapType = 'none'; // let the drag move freely
  carousel.style.scrollBehavior = 'auto';
  carousel.classList.add('dragging');
});

carousel.addEventListener('pointermove', function (e) {
  if (!isDragging) return;
  carousel.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
});

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  carousel.classList.remove('dragging');
  carousel.style.scrollBehavior = '';
  // Snap to whichever item is closest to the center
  var center = carousel.scrollLeft + carousel.clientWidth / 2;
  var best = 0;
  var bestDist = Infinity;
  items.forEach(function (item, i) {
    var d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  carousel.style.scrollSnapType = 'none'; // keep off so smooth scrollTo isn't hijacked
  snapTo(best);
}

carousel.addEventListener('pointerup', endDrag);
carousel.addEventListener('pointercancel', endDrag);`
  },

  // ── 14. Stepper ───────────────────────────────────────
  stepper: {
    html: `<div class="stepper">
  <div class="step active">1</div>
  <div class="step-line"></div>
  <div class="step">2</div>
  <div class="step-line"></div>
  <div class="step">3</div>
</div>`,
    css: `.stepper {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 320px;
  justify-content: space-between;
  cursor: pointer;
  color: #f0f0f5;
}

.step {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #222;
  border: 2px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.4s;
}

.step.active {
  border-color: #7c5cff;
  color: #7c5cff;
  background: rgba(124, 92, 255, 0.1);
}

/* Connector line fills left-to-right when the step before it activates */
.step-line {
  flex: 1;
  height: 2px;
  background: #333;
  margin: 0 0.5rem;
  position: relative;
  overflow: hidden;
}

.step-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #7c5cff;
  transform: translateX(-100%);
  transition: transform 0.5s ease-out;
}

.step.active + .step-line::after {
  transform: translateX(0);
}`,
    js: `// Click anywhere in the stepper to advance (wraps back to step 1)
var stepper = document.querySelector('.stepper');
var steps = stepper.querySelectorAll('.step');
var activeStep = 0;

stepper.addEventListener('click', function () {
  activeStep = (activeStep + 1) % steps.length;
  steps.forEach(function (s, i) {
    s.classList.toggle('active', i <= activeStep);
  });
});`
  },

  // ── 15. Toggle Switch (pure CSS) ──────────────────────
  toggle: {
    html: `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`,
    css: `.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

/* Hide the checkbox but keep it functional/accessible */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  /* Overshooting cubic-bezier makes the knob feel springy */
  transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #7c5cff;
}

input:checked + .slider:before {
  transform: translateX(22px);
}`
  },

  // ── 16. Floating Label (pure CSS) ─────────────────────
  floatLabel: {
    html: `<!-- placeholder=" " is required: :placeholder-shown is how CSS
     knows whether the input is empty -->
<div class="input-group">
  <input type="text" id="floatInput" placeholder=" ">
  <label for="floatInput">Email Address</label>
  <div class="input-border"></div>
</div>`,
    css: `.input-group {
  position: relative;
  width: 100%;
  max-width: 280px;
  margin-top: 1rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid #444;
  color: #fff;
  outline: none;
}

.input-group label {
  position: absolute;
  top: 0.5rem;
  left: 0;
  color: #666;
  pointer-events: none;
  transition: 0.3s ease;
  font-size: 1rem;
}

/* Float the label when focused OR when the input has text */
.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -12px;
  font-size: 0.75rem;
  color: #7c5cff;
}

/* Accent underline grows from the left on focus */
.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #7c5cff;
  transition: width 0.3s ease;
}

.input-group input:focus ~ .input-border {
  width: 100%;
}`
  },

  // ── 17. Search Expand (pure CSS) ──────────────────────
  searchExpand: {
    html: `<div class="search-box">
  <button class="search-btn">&#128269;</button>
  <input type="text" class="search-input" placeholder="Search...">
</div>`,
    css: `/* Collapsed width must equal padding + button, so the icon lands dead centre.
   An unshrinkable margin on the input would still take part in the flex line and
   push the button off-centre inside the 40px pill. */
.search-box {
  display: flex;
  align-items: center;
  background: #222;
  border-radius: 20px;
  padding: 4px;
  width: 40px; /* collapsed: just the icon */
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

/* :focus-within expands the box when the input (or button) has focus */
.search-box:focus-within {
  width: 240px;
}

.search-btn {
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.search-input {
  /* flex-basis 0 + min-width 0 lets it collapse fully; padding replaces the margin
     so nothing unshrinkable is left in the line when collapsed */
  flex: 1 1 0;
  min-width: 0;
  background: transparent;
  border: none;
  color: #fff;
  outline: none;
  padding: 0 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.search-box:focus-within .search-input {
  opacity: 1;
}`
  },

  // ── 18. Delete Wipe ───────────────────────────────────
  deleteWipe: {
    html: `<div class="delete-item" id="deleteItem">
  <span>Swipe to Delete</span>
  <button class="delete-btn">&times;</button>
</div>
<button class="reset-btn" id="resetDelete" style="display:none">Reset</button>`,
    css: `.delete-item {
  width: 100%;
  max-width: 320px;
  padding: 1rem;
  background: #333;
  color: #f0f0f5;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.delete-item.deleting {
  animation: deleteSwipe 0.5s forwards;
}

/* Phase 1 (0-50%): slide out to the right and fade.
   Phase 2 (50-100%): collapse the row height so the list closes up. */
@keyframes deleteSwipe {
  0% { transform: translateX(0); opacity: 1; max-height: 60px; padding: 1rem; }
  50% { transform: translateX(100%); opacity: 0; max-height: 60px; padding: 1rem; }
  100% { transform: translateX(100%); opacity: 0; max-height: 0; padding: 0; }
}

.delete-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
}

.reset-btn {
  margin-top: 1rem;
  background: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}`,
    js: `var deleteBtn = document.querySelector('.delete-btn');
var deleteItem = document.getElementById('deleteItem');
var resetDelete = document.getElementById('resetDelete');
var DURATION = 500; // ms — matches the CSS animation

deleteBtn.addEventListener('click', function () {
  deleteItem.classList.add('deleting');
  // Remove from the flow once the animation finishes
  setTimeout(function () {
    deleteItem.style.display = 'none';
    resetDelete.style.display = 'inline-block';
  }, DURATION);
});

resetDelete.addEventListener('click', function () {
  deleteItem.style.display = 'flex';
  deleteItem.classList.remove('deleting');
  resetDelete.style.display = 'none';
});`
  },

  // ── 19. Tooltip (pure CSS) ────────────────────────────
  tooltip: {
    html: `<button class="tooltip-trigger" data-tooltip="Detailed Information">Hover Me</button>`,
    css: `.tooltip-trigger {
  position: relative;
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* The tooltip is a ::after pseudo-element reading its text
   from the data-tooltip attribute — no extra markup needed */
.tooltip-trigger::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: #222;
  color: #f0f0f5;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid #444;
}

.tooltip-trigger:hover::after {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}`
  },

  // ── 20. Notification Badge ────────────────────────────
  badge: {
    html: `<div class="badge-container">
  <span>Cart</span>
  <span class="badge" id="cartBadge">0</span>
</div>
<button class="add-btn" id="addBtn">+1</button>`,
    css: `.badge-container {
  position: relative;
  display: inline-block;
  font-size: 1.2rem;
  color: #f0f0f5;
  margin-right: 1rem;
}

.badge {
  /* em units so the offsets track the label's font-size, keeping the badge clear
     of the cap height instead of overlapping the final glyph */
  position: absolute;
  top: -0.6em;
  right: -1.15em;
  background: #7c5cff;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
  min-width: 1.25rem;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  /* Ring reads as a floating badge lifted off the label */
  box-shadow: 0 0 0 2px #16161a;
  transform-origin: center;
}

.badge.bump {
  animation: badgeBump 0.3s;
}

@keyframes badgeBump {
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
}

.add-btn {
  padding: 0.25rem 0.75rem;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
    js: `var addBtn = document.getElementById('addBtn');
var badge = document.getElementById('cartBadge');
var count = 0;

addBtn.addEventListener('click', function () {
  count++;
  badge.textContent = count;
  // Remove + reflow + re-add restarts the bump animation every click
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
});`
  },

  // ── 21. Confetti Burst ────────────────────────────────
  confetti: {
    html: `<button class="trigger-btn" id="confettiBtn">Celebrate &#127881;</button>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.confetti-piece {
  position: fixed;
  width: 8px;
  height: 12px;
  /* Centre on the launch point via margin, not transform — the WAAPI keyframes
     own \`transform\` and would replace any base value set here */
  margin: -6px 0 0 -4px;
  border-radius: 1px;
  pointer-events: none;
  z-index: 5000;
  will-change: transform, opacity;
}`,
    js: `// Projectile motion with linear air drag, integrated into explicit keyframes and
// played back with easing:'linear' — so the sampled physics *is* the motion.
// (A single cubic-bezier can't express "decelerate horizontally while accelerating
// downward"; an ease-out curve front-loads everything and the burst reads as a blink.)
//
//   dv/dt = g - k*v   ->   v(t) = (v0 - g/k)e^(-kt) + g/k
//   x(t) = (v0x/k)(1 - e^(-kt))
//   y(t) = ((v0y - g/k)/k)(1 - e^(-kt)) + (g/k)t
//
var confettiBtn = document.getElementById('confettiBtn');
var COLORS = ['#7c5cff', '#a78bfa', '#ff006e', '#00f5d4', '#ffd60a'];
var COUNT = 60;

var G = 1600;      // px/s^2 — effective gravity
var K = 2.2;       // 1/s   — drag; terminal fall speed = G/K ~ 727 px/s
var K_ROT = 1.2;   // 1/s   — rotational drag
var VT = G / K;
var STEPS = 26;    // keyframes sampled per piece

confettiBtn.addEventListener('click', function () {
  var rect = confettiBtn.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;

  for (var i = 0; i < COUNT; i++) {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = cx + 'px';
    piece.style.top = cy + 'px';
    piece.style.background = COLORS[i % COLORS.length];
    document.body.appendChild(piece);

    // Launch in an upward cone: theta = -PI/2 + s, so v0y is always negative.
    var s = (Math.random() * 2 - 1) * 0.95;
    var v0 = 700 + Math.random() * 600;
    var v0x = v0 * Math.sin(s);
    var v0y = -v0 * Math.cos(s);

    var durS = 2.4 + Math.random() * 0.8;
    var w0 = (Math.random() < 0.5 ? -1 : 1) * (720 + Math.random() * 1440); // deg/s
    // ~2-6 edge-on flips over the piece's life; faster than this strobes
    var flutter0 = (Math.random() < 0.5 ? -1 : 1) * (300 + Math.random() * 500);
    var flutterPhase = Math.random() * Math.PI * 2;

    var frames = [];
    for (var n = 0; n < STEPS; n++) {
      var p = n / (STEPS - 1);
      var t = p * durS;
      var decay = 1 - Math.exp(-K * t);

      var x = (v0x / K) * decay;
      var y = ((v0y - VT) / K) * decay + VT * t;

      var rot = (w0 / K_ROT) * (1 - Math.exp(-K_ROT * t));
      // Edge-on flip, so pieces flash thin like real paper
      var flip = flutter0 * t + Math.sin(t * 6 + flutterPhase) * 30;

      frames.push({
        offset: p,
        transform: 'translate3d(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px, 0) ' +
                   'rotate(' + rot.toFixed(1) + 'deg) rotateY(' + flip.toFixed(1) + 'deg)',
        opacity: p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.3)
      });
    }

    piece.animate(frames, {
      duration: durS * 1000,
      easing: 'linear'   // the physics is already baked into the offsets
    }).onfinish = function () { this.effect.target.remove(); };
  }
});`
  },

  // ── 22. Odometer ──────────────────────────────────────
  odometer: {
    html: `<div class="odometer" id="odometer"></div>
<button class="trigger-btn" id="odometerBtn">Roll</button>`,
    css: `.trigger-btn {
  padding: 0.6rem 1.2rem;
  background: #7c5cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.odometer {
  display: flex;
  gap: 4px;
}

/* Each digit is a fixed-height window... */
.odo-digit {
  width: 36px;
  height: 52px;
  background: #222;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

/* ...and a 0-9 strip slides vertically inside it */
.odo-strip {
  display: flex;
  flex-direction: column;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.odo-strip span {
  height: 52px; /* must match .odo-digit height */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #7c5cff;
}`,
    js: `var odometer = document.getElementById('odometer');
var odometerBtn = document.getElementById('odometerBtn');
var DIGITS = 4;
var DIGIT_HEIGHT = 52; // px — must match the CSS

// Build one 0-9 strip per digit
var strips = [];
for (var i = 0; i < DIGITS; i++) {
  var digit = document.createElement('div');
  digit.className = 'odo-digit';
  var strip = document.createElement('div');
  strip.className = 'odo-strip';
  for (var n = 0; n <= 9; n++) {
    var s = document.createElement('span');
    s.textContent = n;
    strip.appendChild(s);
  }
  digit.appendChild(strip);
  odometer.appendChild(digit);
  strips.push(strip);
}

// Slide each strip so the right number shows through the window
function rollTo(value) {
  var str = String(value).padStart(DIGITS, '0');
  strips.forEach(function (strip, i) {
    strip.style.transform = 'translateY(-' + ((+str[i]) * DIGIT_HEIGHT) + 'px)';
  });
}

rollTo(0);
odometerBtn.addEventListener('click', function () {
  rollTo(Math.floor(Math.random() * 10000));
});`
  },

  // ── 23. Hamburger Morph ───────────────────────────────
  hamburgerMorph: {
    html: `<button class="hamburger" id="hamburgerBtn" aria-label="Menu">
  <span class="hb-line hb-top"></span>
  <span class="hb-line hb-mid"></span>
  <span class="hb-line hb-bot"></span>
</button>`,
    css: `.hamburger {
  width: 56px;
  height: 56px;
  background: #12121a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s;
}

.hamburger:hover {
  border-color: #7c5cff;
}

.hb-line {
  position: absolute;
  left: 14px;
  width: 28px;
  height: 2px;
  background: #f0f0f5;
  border-radius: 1px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s,
    top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hb-top { top: 19px; }
.hb-mid { top: 27px; }
.hb-bot { top: 35px; }

/* Open: outer lines move to the middle and rotate into an X,
   the middle line fades out to the left */
.hamburger.open .hb-top {
  top: 27px;
  transform: rotate(45deg);
  background: #7c5cff;
}

.hamburger.open .hb-mid {
  opacity: 0;
  transform: translateX(-10px);
}

.hamburger.open .hb-bot {
  top: 27px;
  transform: rotate(-45deg);
  background: #7c5cff;
}`,
    js: `var hamburgerBtn = document.getElementById('hamburgerBtn');

hamburgerBtn.addEventListener('click', function () {
  hamburgerBtn.classList.toggle('open');
});`
  }
};
