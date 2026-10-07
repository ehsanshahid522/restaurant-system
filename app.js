/**
 * CRAVEX BITES - MODERN POS & RESTAURANT SYSTEM
 * Complete Offline-First POS Engine & UI Controller (3-Zone Redesign)
 */

// Check for Electron IPC
let isElectron = false;
let ipcRenderer = null;
try {
  if (typeof window !== 'undefined' && window.require) {
    const electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
    isElectron = !!ipcRenderer;
  }
} catch (e) {
  isElectron = false;
}

// App State
const state = {
  menu: [],
  orders: [],
  settings: {
    shopName: 'CRAVE BITES',
    tagline: 'Bigger Bites X Better Cravings',
    phone: '03714439700',
    address: 'Near Majadadia Masjid, Imam Bargah Road, Toba Tek Singh',
    owner: 'Sakander Sagheer',
    currency: 'Rs.',
    deliveryFee: 150
  },
  currentCategory: 'All',
  currentTag: 'all',
  searchQuery: '',
  cart: [],
  orderType: 'Dine-in',
  selectedTable: 'Table 4',
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  discountPct: 0,
  paymentMethod: 'Cash',
  cashTendered: 0,
  activeOrderId: 'CXB-' + Math.floor(1000 + Math.random() * 9000),
  activeView: 'pos'
};

// Pleasant Audio Feedback using Web Audio API
const audioCtx = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ? new (window.AudioContext || window.webkitAudioContext)() : null;
function playSound(type) {
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'add') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'checkout') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    }
  } catch (err) {}
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  initClock();
  initNavigation();
  initQuickTags();
  initOrderTypeTabs();
  initDiscountChips();
  initPaymentMethods();
  initSearch();
  initCartListeners();
  initSettingsListeners();
  initMenuManagement();
  
  await loadInitialData();
  renderCategorySidebar();
  renderCatalog();
  renderCart();
  updateAnalytics();
  renderMenuManagementTable();

  // Fullscreen button
  const fsBtn = document.getElementById('btn-toggle-fullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Keyboard shortcut '/' to search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const s = document.getElementById('catalog-search');
      if (s) { s.focus(); s.select(); }
    }
  });
});

// Live Digital Clock
function initClock() {
  const clockEl = document.getElementById('live-clock');
  const update = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    if (clockEl) clockEl.textContent = `${dateStr}  |  ${timeStr}`;
  };
  update();
  setInterval(update, 1000);
}

// Navigation Tabs
function initNavigation() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById(`view-${targetView}`);
      if (targetSec) {
        targetSec.classList.add('active');
        targetSec.scrollTop = 0;
      }

      state.activeView = targetView;
      if (targetView === 'menu') renderMenuManagementTable();
      if (targetView === 'sales') updateAnalytics();
    });
  });
}

// Dynamic Category Sidebar with Icons and Live Badges
const CATEGORY_META = {
  'All': { icon: '⭐', label: 'All Items' },
  'Deals': { icon: '🎁', label: 'Combos & Deals' },
  'Platters': { icon: '🍱', label: 'Platters' },
  'Pizza': { icon: '🍕', label: 'Stone Pizzas' },
  'Burgers': { icon: '🍔', label: 'Burgers' },
  'Wraps & Shawarma': { icon: '🌯', label: 'Wraps & Shawarma' },
  'Spin Rolls': { icon: '🌯', label: 'Spin Rolls' },
  'Sandwiches': { icon: '🥪', label: 'Sandwiches' },
  'Pasta': { icon: '🍝', label: 'Baked Pasta' },
  'Starters & Fries': { icon: '🍟', label: 'Starters & Fries' },
  'Donner': { icon: '🥙', label: 'Donner' },
  'Dip Sauces': { icon: '🥣', label: 'Dip Sauces' },
  'Beverages': { icon: '🥤', label: 'Drinks & Shakes' }
};

function renderCategorySidebar() {
  const catBar = document.getElementById('category-filter-bar');
  if (!catBar) return;

  const categoriesInMenu = [];
  state.menu.forEach(it => {
    if (it.category && !categoriesInMenu.includes(it.category)) {
      categoriesInMenu.push(it.category);
    }
  });

  const preferredOrder = [
    'Deals', 'Platters', 'Pizza', 'Burgers', 'Wraps & Shawarma',
    'Spin Rolls', 'Sandwiches', 'Pasta', 'Starters & Fries', 'Donner',
    'Dip Sauces', 'Beverages'
  ];
  categoriesInMenu.sort((a, b) => {
    const idxA = preferredOrder.indexOf(a);
    const idxB = preferredOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  const allCategories = ['All', ...categoriesInMenu];

  catBar.innerHTML = '';
  allCategories.forEach(cat => {
    const meta = CATEGORY_META[cat] || { icon: '🍽️', label: cat };
    const count = (cat === 'All') 
      ? state.menu.length 
      : state.menu.filter(it => it.category.toLowerCase() === cat.toLowerCase()).length;
    
    const isActive = state.currentCategory.toLowerCase() === cat.toLowerCase();

    const btn = document.createElement('button');
    btn.className = `cat-item-btn ${isActive ? 'active' : ''}`;
    btn.dataset.category = cat;
    btn.innerHTML = `
      <span class="cat-icon">${meta.icon}</span>
      <span class="cat-label">${meta.label}</span>
      <span class="cat-count-badge">${count}</span>
    `;

    btn.addEventListener('click', () => {
      catBar.querySelectorAll('.cat-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = cat;
      renderCatalog();
    });

    catBar.appendChild(btn);
  });

  const sidebarOrderEl = document.getElementById('sidebar-order-count');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = state.orders.filter(o => o.date === todayStr).length;
  if (sidebarOrderEl) sidebarOrderEl.textContent = `${todayOrders} Today`;
}

function updateCategoryCounts() {
  renderCategorySidebar();
}

// Quick Tags Filter (Bestsellers, Spicy, Veg)
function initQuickTags() {
  const tagWrap = document.getElementById('quick-tags-wrap');
  if (tagWrap) {
    tagWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-filter-btn');
      if (!btn) return;
      tagWrap.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTag = btn.dataset.tag;
      renderCatalog();
    });
  }
}

// Discount Chips in Cart
function initDiscountChips() {
  const discBtns = document.querySelectorAll('.disc-btn');
  discBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      discBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.discountPct = parseFloat(btn.dataset.disc) || 0;
      updateBillCalculations(state.currentSubtotal || 0);
    });
  });
}

// Load Initial Data
async function loadInitialData() {
  // 1. Settings
  try {
    if (isElectron) {
      const s = await ipcRenderer.invoke('read-json', 'settings.json');
      if (s) state.settings = { ...state.settings, ...s };
    } else {
      const storedS = localStorage.getItem('cravex_settings');
      if (storedS) state.settings = { ...state.settings, ...JSON.parse(storedS) };
    }
  } catch (e) {}

  // 2. Menu
  try {
    if (isElectron) {
      const m = await ipcRenderer.invoke('read-json', 'menu.json');
      if (m && m.length) state.menu = m;
    } else {
      const storedM = localStorage.getItem('cravex_menu');
      let needsRefresh = true;
      if (storedM) {
        try {
          const parsed = JSON.parse(storedM);
          if (Array.isArray(parsed) && parsed.length >= 35) {
            const hasNewAssets = parsed.some(it => it.image && (it.image.includes('wrap_shawarma') || it.image.includes('pasta_baked')));
            if (hasNewAssets) {
              state.menu = parsed;
              needsRefresh = false;
            }
          }
        } catch (e) {}
      }
      if (needsRefresh) {
        try {
          const res = await fetch('database/menu.json');
          if (res.ok) {
            state.menu = await res.json();
            localStorage.setItem('cravex_menu', JSON.stringify(state.menu));
          }
        } catch (e) {}
      }
    }
  } catch (e) {
    console.warn('Error loading menu:', e);
  }

  if (!state.menu || state.menu.length === 0) {
    state.menu = getDefaultMenu();
  }

  // 3. Orders
  try {
    if (isElectron) {
      const o = await ipcRenderer.invoke('read-json', 'orders.json');
      if (o && o.length) state.orders = o;
    } else {
      const storedO = localStorage.getItem('cravex_orders');
      if (storedO) {
        state.orders = JSON.parse(storedO);
      } else {
        const res = await fetch('database/orders.json');
        if (res.ok) state.orders = await res.json();
      }
    }
  } catch (e) {}

  if (!state.orders) state.orders = [];

  // Update Settings View Inputs & Header
  const sName = document.getElementById('setting-shop-name');
  if (sName) sName.value = state.settings.shopName;
  const sTag = document.getElementById('setting-tagline');
  if (sTag) sTag.value = state.settings.tagline;
  const sPhone = document.getElementById('setting-phone');
  if (sPhone) sPhone.value = state.settings.phone;
  const sAddr = document.getElementById('setting-address');
  if (sAddr) sAddr.value = state.settings.address;
  const sFee = document.getElementById('setting-delivery-fee');
  if (sFee) sFee.value = state.settings.deliveryFee || 150;

  const headerTagline = document.getElementById('header-brand-tagline');
  if (headerTagline && state.settings.tagline) {
    headerTagline.textContent = state.settings.tagline;
  }
}

function updateCategoryCounts() {
  const catBtns = document.querySelectorAll('.cat-item-btn');
  catBtns.forEach(btn => {
    const cat = btn.dataset.category;
    const badge = btn.querySelector('.cat-count-badge');
    if (badge) {
      if (cat === 'All') {
        badge.textContent = state.menu.length;
      } else {
        const cnt = state.menu.filter(it => it.category.toLowerCase() === cat.toLowerCase()).length;
        badge.textContent = cnt;
      }
    }
  });

  const sidebarOrderEl = document.getElementById('sidebar-order-count');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = state.orders.filter(o => o.date === todayStr).length;
  if (sidebarOrderEl) sidebarOrderEl.textContent = `${todayOrders} Today`;
}

// Fallback Default Menu
function getDefaultMenu() {
  return [
    { id: 'b-1', name: 'CraveX Monster Beef Burger', category: 'Burgers', description: 'Double juicy smashed beef patties, cheddar, caramelized onions & secret sauce', price: 850, badge: 'Bestseller 🔥', image: 'assets/food/burger_monster.jpg', emoji: '🍔' },
    { id: 'b-2', name: 'Zinger Crunch Burger', category: 'Burgers', description: 'Ultra crispy chicken fillet, fresh iceberg lettuce & spicy garlic mayo', price: 590, badge: 'Popular', image: 'assets/food/burger_zinger.jpg', emoji: '🍔' },
    { id: 'p-1', name: 'Chicken Tikka Pizza', category: 'Pizza', description: 'Tandoori chicken tikka cubes, onions, pure mozzarella cheese & herbs', sizes: { Small: 550, Medium: 1150, Large: 1650, Family: 2150 }, badge: 'Bestseller', image: 'assets/food/pizza_tikka.jpg', emoji: '🍕' },
    { id: 's-1', name: 'CraveX Loaded Cheese Fries', category: 'Sides', description: 'Golden crispy fries drenched in melted cheddar, chicken & peri mayo', price: 490, badge: 'Must Try', image: 'assets/food/sides_loaded_fries.jpg', emoji: '🍟' },
    { id: 'd-1', name: 'Soft Drink (Can 345ml)', category: 'Beverages', description: 'Chilled Pepsi, 7Up, Mirinda, Coke, or Sprite', price: 120, badge: 'Chilled', image: 'assets/food/drink_can.jpg', emoji: '🥤' }
  ];
}

// ==========================================================================
// CATALOG & PRODUCTS GRID (ZONE 2)
// ==========================================================================
function renderCatalog() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('catalog-item-count');
  if (!grid) return;

  const filtered = state.menu.filter(item => {
    // Category match
    const matchCat = (state.currentCategory === 'All') || (item.category.toLowerCase() === state.currentCategory.toLowerCase());
    
    // Tag match
    let matchTag = true;
    if (state.currentTag === 'bestseller') {
      matchTag = item.badge && (item.badge.includes('Bestseller') || item.badge.includes('Popular') || item.badge.includes('Signature'));
    } else if (state.currentTag === 'spicy') {
      matchTag = (item.badge && item.badge.includes('Spicy')) || item.name.toLowerCase().includes('jalapeno') || item.name.toLowerCase().includes('wings') || item.name.toLowerCase().includes('hot');
    } else if (state.currentTag === 'veg') {
      matchTag = (item.badge && item.badge.includes('Veg')) || item.category === 'Beverages' || item.name.toLowerCase().includes('margherita') || item.name.toLowerCase().includes('garlic bread') || item.name.toLowerCase().includes('fries');
    }

    // Search query match
    const query = state.searchQuery.toLowerCase().trim();
    const matchSearch = !query || item.name.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query)) || item.category.toLowerCase().includes(query);
    
    return matchCat && matchTag && matchSearch;
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  }

  grid.innerHTML = '';

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'food-card';

    // Badge styling
    let badgeHtml = '';
    if (item.badge) {
      let bClass = 'badge-bestseller';
      if (item.badge.includes('Special') || item.badge.includes('Signature')) bClass = 'badge-special';
      if (item.badge.includes('Popular') || item.badge.includes('Save') || item.badge.includes('Best Value')) bClass = 'badge-popular';
      badgeHtml = `<span class="card-floating-badge ${bClass}">${item.badge}</span>`;
    }

    // Size selection for Pizza, Wings, Fries & multi-portion items
    let sizeSelectorHtml = '';
    let initialPrice = item.price || 0;
    let selectedSize = '-';

    if (item.sizes && typeof item.sizes === 'object') {
      const sizeKeys = Object.keys(item.sizes);
      if (sizeKeys.length > 0) {
        const defaultKey = sizeKeys.includes('Medium') ? 'Medium' : sizeKeys.includes('Small') ? 'Small' : sizeKeys.includes('Regular') ? 'Regular' : sizeKeys[0];
        initialPrice = item.sizes[defaultKey];
        selectedSize = defaultKey;
        sizeSelectorHtml = `
          <div class="pizza-size-pills">
            ${sizeKeys.map(k => `
              <button class="size-pill-btn ${k === defaultKey ? 'active' : ''}" data-size="${k}" data-price="${item.sizes[k]}">
                ${k}: ${item.sizes[k]}
              </button>
            `).join('')}
          </div>
        `;
      }
    }

    // Food image with fallback
    const imgSrc = item.image || 'assets/logo.png';

    card.innerHTML = `
      <div class="card-media-wrap">
        <img src="${imgSrc}" alt="${item.name}" class="card-img" onerror="this.src='assets/logo.png'">
        <div class="card-img-gradient"></div>
        ${badgeHtml}
        <button class="card-quick-edit-btn" title="Edit ${item.name}" onclick="openEditItemModal('${item.id}', event)">✏️</button>
      </div>

      <div class="card-body">
        <div class="card-title-row">
          <h3>${item.name}</h3>
          <p class="card-desc">${item.description || ''}</p>
        </div>

        ${sizeSelectorHtml}

        <div class="card-footer">
          <div class="price-box">
            <span class="price-currency">${state.settings.currency}</span>
            <span class="price-amount" id="price-display-${item.id}">${initialPrice}</span>
          </div>
          <button class="btn-add-cart" id="btn-add-${item.id}">
            <span>+</span> Add
          </button>
        </div>
      </div>
    `;

    // Size pill listener
    if (item.sizes && typeof item.sizes === 'object') {
      const sizeBtns = card.querySelectorAll('.size-pill-btn');
      sizeBtns.forEach(sb => {
        sb.addEventListener('click', (e) => {
          e.stopPropagation();
          sizeBtns.forEach(b => b.classList.remove('active'));
          sb.classList.add('active');
          selectedSize = sb.dataset.size;
          const p = sb.dataset.price;
          const pDisplay = card.querySelector(`#price-display-${item.id}`);
          if (pDisplay) pDisplay.textContent = p;
        });
      });
    }

    // Add to cart click
    const addBtn = card.querySelector(`#btn-add-${item.id}`);
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let price = item.price;
      let size = '-';
      if (item.sizes && typeof item.sizes === 'object') {
        price = item.sizes[selectedSize] || Object.values(item.sizes)[0];
        size = selectedSize;
      }
      addToCart({
        id: item.id,
        name: item.name,
        price: Number(price),
        size: size,
        image: item.image || 'assets/logo.png'
      });
      playSound('add');
    });

    grid.appendChild(card);
  });
}

// Search Handler with Clear
function initSearch() {
  const searchInput = document.getElementById('catalog-search');
  const clearBtn = document.getElementById('search-clear-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = state.searchQuery ? 'block' : 'none';
      }
      renderCatalog();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearBtn.style.display = 'none';
      renderCatalog();
    });
  }
}

// ==========================================================================
// CART & ORDER LOGIC (ZONE 3)
// ==========================================================================
function addToCart(product) {
  const cartKey = `${product.id}_${product.size}`;
  const existing = state.cart.find(it => it.key === cartKey);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      key: cartKey,
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.size,
      quantity: 1,
      image: product.image
    });
  }
  renderCart();
}

function removeFromCart(key) {
  state.cart = state.cart.filter(it => it.key !== key);
  renderCart();
}

function updateCartQty(key, delta) {
  const it = state.cart.find(i => i.key === key);
  if (!it) return;
  it.quantity += delta;
  if (it.quantity <= 0) {
    removeFromCart(key);
  } else {
    renderCart();
  }
}

function renderCart() {
  const scrollContainer = document.getElementById('cart-items-scroll');
  const emptyState = document.getElementById('empty-cart-state');
  const checkoutBtn = document.getElementById('btn-place-order');
  const badgeEl = document.getElementById('order-id-badge');
  const cartTotalQtyEl = document.getElementById('cart-total-qty');

  if (badgeEl) badgeEl.textContent = `#${state.activeOrderId}`;

  if (!scrollContainer) return;

  const totalItemCount = state.cart.reduce((sum, it) => sum + it.quantity, 0);
  if (cartTotalQtyEl) cartTotalQtyEl.textContent = `${totalItemCount} item${totalItemCount === 1 ? '' : 's'}`;

  if (state.cart.length === 0) {
    scrollContainer.innerHTML = '';
    scrollContainer.appendChild(emptyState);
    if (checkoutBtn) checkoutBtn.disabled = true;
    updateBillCalculations(0);
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;
  scrollContainer.innerHTML = '';

  let subtotal = 0;

  state.cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item-card';
    const thumbSrc = item.image || 'assets/logo.png';

    row.innerHTML = `
      <div class="cart-item-meta">
        <img src="${thumbSrc}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='assets/logo.png'">
        <div class="cart-item-title-box">
          <div class="cart-item-name">${item.name}</div>
          ${item.size && item.size !== '-' ? `<span class="cart-item-sub">${item.size} • ${state.settings.currency} ${item.price}</span>` : `<span class="cart-item-sub">${state.settings.currency} ${item.price}</span>`}
        </div>
      </div>

      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="btn-qty" data-action="minus" data-key="${item.key}">−</button>
          <span class="qty-number">${item.quantity}</span>
          <button class="btn-qty" data-action="plus" data-key="${item.key}">+</button>
        </div>
        <div class="item-total-price">${state.settings.currency} ${itemTotal.toFixed(0)}</div>
        <button class="btn-remove-item" data-key="${item.key}" title="Remove item">✕</button>
      </div>
    `;

    row.querySelector('[data-action="minus"]').addEventListener('click', () => updateCartQty(item.key, -1));
    row.querySelector('[data-action="plus"]').addEventListener('click', () => updateCartQty(item.key, 1));
    row.querySelector('.btn-remove-item').addEventListener('click', () => removeFromCart(item.key));

    scrollContainer.appendChild(row);
  });

  updateBillCalculations(subtotal);
}

function updateBillCalculations(subtotal) {
  const subtotalEl = document.getElementById('bill-subtotal');
  const discountEl = document.getElementById('bill-discount');
  const discountRow = document.getElementById('discount-row-display');
  const discountPctLabel = document.getElementById('discount-pct-label');
  const deliveryRow = document.getElementById('delivery-fee-row');
  const grandTotalEl = document.getElementById('bill-grand-total');
  const changePill = document.getElementById('change-display-pill');

  let discount = subtotal * (state.discountPct / 100);
  let delivery = (state.orderType === 'Delivery' && state.cart.length > 0) ? (Number(state.settings.deliveryFee) || 150) : 0;
  let grandTotal = Math.max(0, subtotal - discount + delivery);

  if (discountRow) {
    discountRow.style.display = discount > 0 ? 'flex' : 'none';
  }
  if (discountPctLabel) discountPctLabel.textContent = `${state.discountPct}%`;

  if (deliveryRow) {
    deliveryRow.style.display = (state.orderType === 'Delivery' && state.cart.length > 0) ? 'flex' : 'none';
  }

  if (subtotalEl) subtotalEl.textContent = `${state.settings.currency} ${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `- ${state.settings.currency} ${discount.toFixed(2)}`;
  if (grandTotalEl) grandTotalEl.textContent = `${state.settings.currency} ${grandTotal.toFixed(2)}`;

  // Change calculation
  let change = state.cashTendered - grandTotal;
  if (changePill) {
    if (state.cashTendered > 0) {
      if (change >= 0) {
        changePill.textContent = `Change: ${state.settings.currency} ${change.toFixed(2)}`;
        changePill.style.color = 'var(--accent-emerald)';
      } else {
        changePill.textContent = `Due: ${state.settings.currency} ${Math.abs(change).toFixed(2)}`;
        changePill.style.color = 'var(--crave-red)';
      }
    } else {
      changePill.textContent = `Change: ${state.settings.currency} 0.00`;
      changePill.style.color = 'var(--accent-emerald)';
    }
  }

  state.currentSubtotal = subtotal;
  state.currentDiscount = discount;
  state.currentDelivery = delivery;
  state.currentGrandTotal = grandTotal;
}

// Order Type Switcher
function initOrderTypeTabs() {
  const tabs = document.querySelectorAll('.order-type-btn');
  const dineinRow = document.getElementById('dinein-info-row');
  const delivRow = document.getElementById('delivery-info-row');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.orderType = btn.dataset.type;

      if (state.orderType === 'Dine-in') {
        if (dineinRow) dineinRow.style.display = 'flex';
        if (delivRow) delivRow.style.display = 'none';
      } else if (state.orderType === 'Takeaway') {
        if (dineinRow) dineinRow.style.display = 'flex';
        if (delivRow) delivRow.style.display = 'none';
      } else if (state.orderType === 'Delivery') {
        if (dineinRow) dineinRow.style.display = 'none';
        if (delivRow) delivRow.style.display = 'flex';
      }
      renderCart();
    });
  });
}

// Payment Methods & Quick Cash
function initPaymentMethods() {
  const payBtns = document.querySelectorAll('.pay-btn');
  const cashInput = document.getElementById('cash-given-input');

  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.paymentMethod = btn.dataset.method;
    });
  });

  if (cashInput) {
    cashInput.addEventListener('input', (e) => {
      state.cashTendered = parseFloat(e.target.value) || 0;
      updateBillCalculations(state.currentSubtotal || 0);
    });
  }

  // Quick cash chips
  const chipBtns = document.querySelectorAll('.chip-btn');
  chipBtns.forEach(cb => {
    cb.addEventListener('click', () => {
      const val = cb.dataset.cash;
      if (val === 'exact') {
        state.cashTendered = state.currentGrandTotal || 0;
      } else {
        state.cashTendered = parseFloat(val) || 0;
      }
      if (cashInput) cashInput.value = state.cashTendered ? state.cashTendered : '';
      updateBillCalculations(state.currentSubtotal || 0);
    });
  });
}

// Cart Action Listeners
function initCartListeners() {
  const clearBtn = document.getElementById('btn-clear-cart');
  const checkoutBtn = document.getElementById('btn-place-order');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (state.cart.length > 0 && confirm('Are you sure you want to clear current order?')) {
        state.cart = [];
        state.pendingOrder = null;
        state.cashTendered = 0;
        const cashInput = document.getElementById('cash-given-input');
        if (cashInput) cashInput.value = '';
        renderCart();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) return;
      openBillPreview();
    });
  }

  // Receipt Modal Action Buttons
  const editRecBtn = document.getElementById('btn-edit-receipt');
  const cancelRecBtn = document.getElementById('btn-cancel-receipt');
  const printRecBtn = document.getElementById('btn-print-receipt');
  const closeRecBtn = document.getElementById('btn-close-receipt');
  const recModal = document.getElementById('receipt-modal');

  // 1. Edit Order: Return to cart to modify items/quantities
  if (editRecBtn && recModal) {
    editRecBtn.addEventListener('click', () => {
      recModal.classList.remove('active');
      showToast('✏️ Returned to order. You can modify items in the cart.', 'info');
    });
  }

  // 2. Cancel Order: Discard pending bill without adding to records
  if (cancelRecBtn && recModal) {
    cancelRecBtn.addEventListener('click', () => {
      if (state.isReprinting) {
        recModal.classList.remove('active');
        state.isReprinting = false;
        return;
      }
      if (confirm('Cancel this bill? This order will NOT be saved to records.')) {
        state.pendingOrder = null;
        recModal.classList.remove('active');
        showToast('❌ Order cancelled. Nothing saved to sales records.', 'info');
      }
    });
  }

  // 3. Print & Confirm Bill: ONLY HERE is the order saved to sales records & printed!
  if (printRecBtn) {
    printRecBtn.addEventListener('click', async () => {
      if (state.isReprinting) {
        window.print();
        if (recModal) recModal.classList.remove('active');
        state.isReprinting = false;
        return;
      }
      await confirmAndPrintOrder();
    });
  }

  // Top close button
  if (closeRecBtn && recModal) {
    closeRecBtn.addEventListener('click', () => {
      recModal.classList.remove('active');
      if (!state.isReprinting) {
        showToast('Bill preview closed. Order was NOT saved.', 'info');
      }
      state.isReprinting = false;
    });
  }

  // Clicking overlay backdrop closes preview without saving
  if (recModal) {
    recModal.addEventListener('click', (e) => {
      if (e.target === recModal) {
        recModal.classList.remove('active');
        if (!state.isReprinting) {
          showToast('Bill preview closed. Order was NOT saved.', 'info');
        }
        state.isReprinting = false;
      }
    });
  }
}

// ==========================================================================
// CHECKOUT & RECEIPT PREVIEW (COMMITTED ONLY UPON PRINT)
// ==========================================================================
function openBillPreview() {
  if (state.cart.length === 0) {
    showToast('Cart is empty! Add items before checkout.', 'error');
    return;
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

  const customerName = document.getElementById('cart-customer-name')?.value || (state.orderType === 'Dine-in' ? 'Walk-in Guest' : 'Customer');
  const customerPhone = document.getElementById('cart-customer-phone')?.value || '';
  const customerAddress = document.getElementById('cart-customer-address')?.value || '';
  const tableVal = document.getElementById('cart-table-select')?.value || 'Table 4';

  const pending = {
    orderId: state.activeOrderId,
    date: dateStr,
    time: timeStr,
    timestamp: now.getTime(),
    orderType: state.orderType,
    customer: {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      table: state.orderType === 'Dine-in' ? tableVal : ''
    },
    items: state.cart.map(i => ({
      id: i.id,
      name: i.name,
      size: i.size,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.price * i.quantity
    })),
    subtotal: state.currentSubtotal,
    discount: state.currentDiscount,
    delivery: state.currentDelivery,
    total: state.currentGrandTotal,
    amountPaid: state.cashTendered || state.currentGrandTotal,
    change: Math.max(0, (state.cashTendered || state.currentGrandTotal) - state.currentGrandTotal),
    paymentMethod: state.paymentMethod,
    status: 'Completed'
  };

  state.pendingOrder = pending;
  state.isReprinting = false;
  showReceiptModal(pending, false);
}

// Confirm order, commit to sales records and print
async function confirmAndPrintOrder() {
  if (!state.pendingOrder) {
    showToast('No active bill to print.', 'error');
    return;
  }

  const finalizedOrder = { ...state.pendingOrder };
  state.orders.unshift(finalizedOrder);
  await persistOrders();

  playSound('checkout');
  showToast(`✅ Order #${finalizedOrder.orderId} Confirmed & Saved to Records!`, 'success');

  // Trigger print dialog
  window.print();

  // Reset cart for next order
  state.cart = [];
  state.pendingOrder = null;
  state.cashTendered = 0;
  state.activeOrderId = 'CXB-' + Math.floor(1000 + Math.random() * 9000);
  const cashInput = document.getElementById('cash-given-input');
  if (cashInput) cashInput.value = '';
  renderCart();
  updateCategoryCounts();
  updateAnalytics();

  const recModal = document.getElementById('receipt-modal');
  if (recModal) recModal.classList.remove('active');
}

// Backward-compatibility alias
const placeOrder = openBillPreview;

async function persistOrders() {
  if (isElectron) {
    try {
      await ipcRenderer.invoke('write-json', 'orders.json', state.orders);
    } catch (e) {
      console.error(e);
    }
  }
  try {
    localStorage.setItem('cravex_orders', JSON.stringify(state.orders));
  } catch (e) {}
}

function showReceiptModal(order, isReprint = false) {
  const modal = document.getElementById('receipt-modal');
  if (!modal) return;

  state.isReprinting = isReprint;

  document.getElementById('rec-order-id').textContent = `#${order.orderId}`;
  document.getElementById('rec-date-time').textContent = `${order.date} ${order.time}`;
  document.getElementById('rec-order-type').textContent = order.orderType + (order.customer.table ? ` (${order.customer.table})` : '');
  document.getElementById('rec-customer').textContent = order.customer.name + (order.customer.phone ? ` - ${order.customer.phone}` : '');

  document.getElementById('rec-address').textContent = state.settings.address;
  document.getElementById('rec-phone').textContent = `Tel: ${state.settings.phone}`;

  const tbody = document.getElementById('rec-items-body');
  tbody.innerHTML = '';

  order.items.forEach(it => {
    const tr = document.createElement('tr');
    const nameWithSpec = it.size && it.size !== '-' ? `${it.name} (${it.size})` : it.name;
    tr.innerHTML = `
      <td>${nameWithSpec}</td>
      <td style="text-align: center;">${it.quantity}</td>
      <td style="text-align: right;">${it.price}</td>
      <td style="text-align: right;">${it.subtotal.toFixed(0)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('rec-subtotal').textContent = `${state.settings.currency} ${order.subtotal.toFixed(2)}`;
  
  const discRow = document.getElementById('rec-discount-row');
  if (order.discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('rec-discount').textContent = `- ${state.settings.currency} ${order.discount.toFixed(2)}`;
  } else {
    discRow.style.display = 'none';
  }

  const delivRow = document.getElementById('rec-delivery-row');
  if (order.delivery > 0) {
    delivRow.style.display = 'flex';
    document.getElementById('rec-delivery').textContent = `+ ${state.settings.currency} ${order.delivery.toFixed(2)}`;
  } else {
    delivRow.style.display = 'none';
  }

  document.getElementById('rec-grand-total').textContent = `${state.settings.currency} ${order.total.toFixed(2)}`;
  document.getElementById('rec-pay-mode').textContent = order.paymentMethod;

  const tenderRow = document.getElementById('rec-cash-tender-row');
  const changeRow = document.getElementById('rec-change-row');

  if (order.paymentMethod === 'Cash') {
    tenderRow.style.display = 'flex';
    changeRow.style.display = 'flex';
    document.getElementById('rec-cash-tendered').textContent = `${state.settings.currency} ${(order.amountPaid || order.total).toFixed(2)}`;
    document.getElementById('rec-change-returned').textContent = `${state.settings.currency} ${(order.change || 0).toFixed(2)}`;
  } else {
    tenderRow.style.display = 'none';
    changeRow.style.display = 'none';
  }

  // Adjust modal actions based on reprint vs pending order
  const editBtn = document.getElementById('btn-edit-receipt');
  const cancelBtn = document.getElementById('btn-cancel-receipt');
  const printBtn = document.getElementById('btn-print-receipt');

  if (editBtn) {
    editBtn.style.display = isReprint ? 'none' : 'inline-block';
  }
  if (cancelBtn) {
    cancelBtn.textContent = isReprint ? '✕ Close Slip' : '❌ Cancel Order';
  }
  if (printBtn) {
    printBtn.textContent = isReprint ? '🖨️ Print Slip' : '🖨️ Print & Confirm Bill';
  }

  modal.classList.add('active');
}

// ==========================================================================
// ANALYTICS & REPORTS SCREEN
// ==========================================================================
function updateAnalytics() {
  const totalSalesEl = document.getElementById('kpi-total-sales');
  const todaySalesEl = document.getElementById('kpi-today-sales');
  const totalOrdersEl = document.getElementById('kpi-total-orders');
  const avgOrderEl = document.getElementById('kpi-avg-order');
  const tbody = document.getElementById('sales-table-body');

  const todayStr = new Date().toISOString().split('T')[0];

  let totalRevenue = 0;
  let todayRevenue = 0;
  let todayOrdersCount = 0;

  state.orders.forEach(o => {
    const val = Number(o.total) || 0;
    totalRevenue += val;
    if (o.date === todayStr) {
      todayRevenue += val;
      todayOrdersCount += 1;
    }
  });

  const ordersCount = state.orders.length;
  const avgTicket = ordersCount > 0 ? (totalRevenue / ordersCount) : 0;

  if (totalSalesEl) totalSalesEl.textContent = `${state.settings.currency} ${totalRevenue.toLocaleString()}`;
  if (todaySalesEl) todaySalesEl.textContent = `${state.settings.currency} ${todayRevenue.toLocaleString()}`;
  if (totalOrdersEl) totalOrdersEl.textContent = `${ordersCount} (${todayOrdersCount} today)`;
  if (avgOrderEl) avgOrderEl.textContent = `${state.settings.currency} ${avgTicket.toFixed(0)}`;

  if (!tbody) return;
  tbody.innerHTML = '';

  const filter = document.getElementById('sales-filter-select')?.value || 'all';
  const query = (document.getElementById('sales-search-input')?.value || '').toLowerCase().trim();

  const filteredOrders = state.orders.filter(o => {
    if (filter === 'today' && o.date !== todayStr) return false;
    if (query) {
      const matchId = (o.orderId || '').toLowerCase().includes(query);
      const matchCust = (o.customer?.name || '').toLowerCase().includes(query);
      const matchPhone = (o.customer?.phone || '').toLowerCase().includes(query);
      return matchId || matchCust || matchPhone;
    }
    return true;
  });

  filteredOrders.forEach(o => {
    const tr = document.createElement('tr');
    const itemsSummary = o.items ? o.items.map(it => `${it.quantity}x ${it.name}`).join(', ') : '-';
    const custDisplay = o.customer ? `${o.customer.name} ${o.customer.table ? `(${o.customer.table})` : ''}` : '-';

    tr.innerHTML = `
      <td><strong>#${o.orderId}</strong></td>
      <td>${o.date} ${o.time}</td>
      <td>${custDisplay}</td>
      <td><span class="badge-tag">${o.orderType}</span></td>
      <td style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsSummary}">${itemsSummary}</td>
      <td style="color: var(--crave-yellow); font-weight: 700;">${state.settings.currency} ${Number(o.total).toFixed(2)}</td>
      <td><span class="status-badge status-paid">${o.paymentMethod}</span></td>
      <td>
        <button class="btn-secondary-action" style="padding: 4px 10px; font-size: 11px;" onclick="reprintOrderSlip('${o.orderId}')">
          🖨️ Slip
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.reprintOrderSlip = function(orderId) {
  const o = state.orders.find(item => item.orderId === orderId);
  if (o) showReceiptModal(o, true);
};

const salesFilterSel = document.getElementById('sales-filter-select');
const salesSearchInput = document.getElementById('sales-search-input');
if (salesFilterSel) salesFilterSel.addEventListener('change', updateAnalytics);
if (salesSearchInput) salesSearchInput.addEventListener('input', updateAnalytics);

const exportCsvBtn = document.getElementById('btn-export-csv');
if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', () => {
    if (state.orders.length === 0) {
      alert('No orders to export!');
      return;
    }
    let csv = 'OrderID,Date,Time,OrderType,Customer,Phone,Total,PaymentMethod,Status\n';
    state.orders.forEach(o => {
      const cust = (o.customer?.name || '').replace(/,/g, ' ');
      const phone = (o.customer?.phone || '').replace(/,/g, ' ');
      csv += `${o.orderId},${o.date},${o.time},${o.orderType},${cust},${phone},${o.total},${o.paymentMethod},${o.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cravex_sales_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Kitchen Display System (Disabled as requested)
function renderKDS() {}
window.renderKDS = renderKDS;
window.updateOrderStatus = async function(orderId, newStatus) {
  const o = state.orders.find(item => item.orderId === orderId);
  if (o) {
    o.status = newStatus;
    await persistOrders();
    updateAnalytics();
  }
};

// ==========================================================================
// SETTINGS & STORE PROFILE LISTENERS
// ==========================================================================
function initSettingsListeners() {
  const saveBtn = document.getElementById('btn-save-settings');
  const addItemBtn = document.getElementById('btn-add-menu-item');
  const gotoMenuBtn = document.getElementById('btn-goto-menu-mgmt');

  if (gotoMenuBtn) {
    gotoMenuBtn.addEventListener('click', () => {
      const menuTab = document.querySelector('.nav-tab-btn[data-view="menu"]');
      if (menuTab) menuTab.click();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      state.settings.shopName = document.getElementById('setting-shop-name')?.value || 'CRAVE BITES';
      state.settings.tagline = document.getElementById('setting-tagline')?.value || 'Bigger Bites X Better Cravings';
      state.settings.phone = document.getElementById('setting-phone')?.value || '';
      state.settings.address = document.getElementById('setting-address')?.value || '';
      state.settings.deliveryFee = parseFloat(document.getElementById('setting-delivery-fee')?.value) || 150;

      const headerTagline = document.getElementById('header-brand-tagline');
      if (headerTagline) headerTagline.textContent = state.settings.tagline;

      if (isElectron) {
        await ipcRenderer.invoke('write-json', 'settings.json', state.settings);
      }
      localStorage.setItem('cravex_settings', JSON.stringify(state.settings));
      showToast('✅ Store profile & settings saved successfully!');
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', async () => {
      const name = document.getElementById('new-item-name')?.value.trim();
      const category = document.getElementById('new-item-category')?.value;
      const price = parseFloat(document.getElementById('new-item-price')?.value);
      const desc = document.getElementById('new-item-desc')?.value.trim();

      if (!name || isNaN(price) || price <= 0) {
        showToast('Please enter valid item name and price!', 'error');
        return;
      }

      let img = 'assets/food/burger_monster.jpg';
      let emoji = '🍔';
      if (category === 'Pizza') { img = 'assets/food/pizza_tikka.jpg'; emoji = '🍕'; }
      else if (category === 'Sides' || category === 'Starters & Fries') { img = 'assets/food/sides_loaded_fries.jpg'; emoji = '🍟'; }
      else if (category === 'Beverages') { img = 'assets/food/drink_can.jpg'; emoji = '🥤'; }
      else if (category === 'Deals') { img = 'assets/food/deal_solo.jpg'; emoji = '🎁'; }
      else if (category === 'Platters') { img = 'assets/food/sides_wings.jpg'; emoji = '🍱'; }
      else if (category === 'Pasta') { img = 'assets/food/pizza_crown.jpg'; emoji = '🍝'; }
      else if (category === 'Sandwiches') { img = 'assets/food/sides_garlic_bread.jpg'; emoji = '🥪'; }
      else if (category === 'Wraps & Shawarma' || category === 'Spin Rolls') { img = 'assets/food/sides_loaded_fries.jpg'; emoji = '🌯'; }

      const newItem = {
        id: 'cxb-' + Date.now(),
        name: name,
        category: category,
        description: desc || 'Freshly prepared specialty dish',
        price: price,
        image: img,
        emoji: emoji,
        badge: 'New ✨'
      };

      state.menu.unshift(newItem);
      await persistMenu();

      document.getElementById('new-item-name').value = '';
      document.getElementById('new-item-price').value = '';
      document.getElementById('new-item-desc').value = '';

      renderCategorySidebar();
      renderCatalog();
      renderMenuManagementTable();
      showToast(`✅ "${name}" added to menu successfully!`);
    });
  }
}

// ==========================================================================
// MENU MANAGEMENT (FULL CRUD SYSTEM: ADD, EDIT, DELETE, RESTORE)
// ==========================================================================
function initMenuManagement() {
  const searchInput = document.getElementById('menu-mgmt-search');
  const catFilter = document.getElementById('menu-mgmt-category-filter');
  const openAddBtn = document.getElementById('btn-open-add-modal');
  const closeBtn = document.getElementById('btn-close-menu-modal');
  const cancelBtn = document.getElementById('btn-cancel-modal');
  const form = document.getElementById('menu-item-form');
  const modeSingle = document.getElementById('mode-single');
  const modeMulti = document.getElementById('mode-multi');
  const catSelect = document.getElementById('modal-cat-select');
  const customCatInput = document.getElementById('modal-custom-cat-input');
  const badgeSelect = document.getElementById('modal-badge-select');
  const customBadgeInput = document.getElementById('modal-custom-badge-input');
  const addSizeBtn = document.getElementById('btn-add-size-row');
  const presetPizza = document.getElementById('btn-preset-pizza');
  const presetPieces = document.getElementById('btn-preset-pieces');
  const presetFries = document.getElementById('btn-preset-fries');
  const exportBtn = document.getElementById('btn-export-menu');
  const importInput = document.getElementById('input-import-menu');
  const resetBtn = document.getElementById('btn-reset-default-menu');

  if (searchInput) {
    searchInput.addEventListener('input', () => renderMenuManagementTable());
  }

  if (catFilter) {
    catFilter.addEventListener('change', () => renderMenuManagementTable());
  }

  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => openAddItemModal());
  }

  if (closeBtn) closeBtn.addEventListener('click', () => closeMenuItemModal());
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeMenuItemModal());

  // Pricing mode radio switch
  if (modeSingle && modeMulti) {
    modeSingle.addEventListener('change', () => {
      document.getElementById('single-price-container').style.display = 'block';
      document.getElementById('multi-size-container').style.display = 'none';
    });
    modeMulti.addEventListener('change', () => {
      document.getElementById('single-price-container').style.display = 'none';
      document.getElementById('multi-size-container').style.display = 'block';
      const list = document.getElementById('size-rows-list');
      if (list && list.children.length === 0) {
        applySizePreset('pizza');
      }
    });
  }

  // Category select toggle custom input
  if (catSelect && customCatInput) {
    catSelect.addEventListener('change', () => {
      if (catSelect.value === '__NEW__') {
        customCatInput.style.display = 'block';
        customCatInput.focus();
      } else {
        customCatInput.style.display = 'none';
      }
    });
  }

  // Badge select toggle custom input
  if (badgeSelect && customBadgeInput) {
    badgeSelect.addEventListener('change', () => {
      if (badgeSelect.value === '__CUSTOM__') {
        customBadgeInput.style.display = 'block';
        customBadgeInput.focus();
      } else {
        customBadgeInput.style.display = 'none';
      }
    });
  }

  // Size variation actions
  if (addSizeBtn) {
    addSizeBtn.addEventListener('click', () => addSizeRow('', ''));
  }
  if (presetPizza) presetPizza.addEventListener('click', () => applySizePreset('pizza'));
  if (presetPieces) presetPieces.addEventListener('click', () => applySizePreset('pieces'));
  if (presetFries) presetFries.addEventListener('click', () => applySizePreset('fries'));

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveMenuItemModal();
    });
  }

  // Food Photo Upload & Library Handlers
  const fileInput = document.getElementById('modal-image-file-input');
  const browseFileBtn = document.getElementById('btn-browse-file');
  const imageSelect = document.getElementById('modal-image-select');
  const clearPhotoBtn = document.getElementById('btn-clear-photo');

  if (browseFileBtn && fileInput) {
    browseFileBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        compressAndSetItemImage(e.target.files[0]);
      }
    });
  }

  if (imageSelect) {
    imageSelect.addEventListener('change', () => {
      const preview = document.getElementById('modal-image-preview');
      const hiddenData = document.getElementById('modal-custom-image-data');
      const tag = document.getElementById('photo-preview-tag');
      if (preview) preview.src = imageSelect.value;
      if (hiddenData) hiddenData.value = '';
      if (tag) {
        tag.textContent = 'Preset';
        tag.style.background = 'rgba(255, 190, 11, 0.15)';
        tag.style.color = 'var(--crave-yellow)';
      }
    });
  }

  if (clearPhotoBtn) {
    clearPhotoBtn.addEventListener('click', () => {
      const preview = document.getElementById('modal-image-preview');
      const hiddenData = document.getElementById('modal-custom-image-data');
      const fileInp = document.getElementById('modal-image-file-input');
      const imageSel = document.getElementById('modal-image-select');
      const urlInput = document.getElementById('modal-image-url-input');
      const tag = document.getElementById('photo-preview-tag');
      if (preview) preview.src = 'assets/logo.png';
      if (hiddenData) hiddenData.value = '';
      if (fileInp) fileInp.value = '';
      if (urlInput) urlInput.value = '';
      if (imageSel) imageSel.value = 'assets/logo.png';
      if (tag) {
        tag.textContent = 'Default';
        tag.style.background = 'rgba(255, 255, 255, 0.1)';
        tag.style.color = 'var(--text-muted)';
      }
      showToast('Photo reset to default logo', 'info');
    });
  }

  // Web Image URL Apply Handler
  const applyUrlBtn = document.getElementById('btn-apply-image-url');
  const urlInput = document.getElementById('modal-image-url-input');
  if (applyUrlBtn && urlInput) {
    applyUrlBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (!url) {
        showToast('Please paste a valid web image URL!', 'error');
        urlInput.focus();
        return;
      }
      const preview = document.getElementById('modal-image-preview');
      const hiddenData = document.getElementById('modal-custom-image-data');
      const tag = document.getElementById('photo-preview-tag');

      const testImg = new Image();
      testImg.onload = () => {
        if (preview) preview.src = url;
        if (hiddenData) hiddenData.value = url;
        if (tag) {
          tag.textContent = 'Web URL';
          tag.style.background = 'rgba(59, 130, 246, 0.2)';
          tag.style.color = '#60a5fa';
        }
        showToast('🌐 Web image loaded successfully!', 'success');
      };
      testImg.onerror = () => {
        showToast('Could not load image from this URL. Please verify link!', 'error');
      };
      testImg.src = url;
    });

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyUrlBtn.click();
      }
    });
  }

  // Export / Import / Reset Menu
  if (exportBtn) exportBtn.addEventListener('click', exportMenuBackup);
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importMenuBackup(e.target.files[0]);
        e.target.value = '';
      }
    });
  }
  if (resetBtn) resetBtn.addEventListener('click', resetDefaultMenu);
}

// Client-side image compression & optimization helper (Supports PNG & JPG)
function compressAndSetItemImage(file) {
  if (!file) return;
  const isPng = file.type === 'image/png' || (file.name && file.name.toLowerCase().endsWith('.png'));
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      const maxDim = 500;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      
      let dataUrl;
      if (isPng) {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        dataUrl = canvas.toDataURL('image/png');
      } else {
        ctx.fillStyle = '#141722';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }

      const preview = document.getElementById('modal-image-preview');
      if (preview) preview.src = dataUrl;

      const hiddenData = document.getElementById('modal-custom-image-data');
      if (hiddenData) hiddenData.value = dataUrl;

      const tag = document.getElementById('photo-preview-tag');
      if (tag) {
        tag.textContent = 'Uploaded (' + (isPng ? 'PNG' : 'JPG') + ')';
        tag.style.background = 'rgba(16, 185, 129, 0.2)';
        tag.style.color = '#10b981';
      }

      showToast(`📸 Photo uploaded & updated! Click "Save to Menu" to apply.`, 'success');
    };
    img.onerror = () => {
      showToast('Invalid image file format! Please select a valid PNG or JPG.', 'error');
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

// Render Menu Management Table
function renderMenuManagementTable() {
  const tbody = document.getElementById('menu-mgmt-table-body');
  const countBadge = document.getElementById('menu-mgmt-count-badge');
  const catFilter = document.getElementById('menu-mgmt-category-filter');
  const searchInput = document.getElementById('menu-mgmt-search');

  if (!tbody) return;

  // Sync category filter dropdown options
  if (catFilter) {
    const currentVal = catFilter.value;
    const categories = Array.from(new Set(state.menu.map(it => it.category).filter(Boolean)));
    categories.sort();
    catFilter.innerHTML = '<option value="All">All Categories</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    if (categories.includes(currentVal)) {
      catFilter.value = currentVal;
    }
  }

  const query = (searchInput?.value || '').toLowerCase().trim();
  const selectedCat = catFilter?.value || 'All';

  const filtered = state.menu.filter(it => {
    const matchCat = (selectedCat === 'All') || (it.category.toLowerCase() === selectedCat.toLowerCase());
    const matchQuery = !query ||
      it.name.toLowerCase().includes(query) ||
      (it.description && it.description.toLowerCase().includes(query)) ||
      it.category.toLowerCase().includes(query) ||
      (it.price && String(it.price).includes(query));
    return matchCat && matchQuery;
  });

  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} of ${state.menu.length} Items`;
  }

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">No menu items found matching "${query}".</td></tr>`;
    return;
  }

  filtered.forEach(it => {
    const tr = document.createElement('tr');
    
    // Pricing presentation
    let priceHtml = '';
    if (it.sizes && typeof it.sizes === 'object') {
      priceHtml = `<div class="menu-size-pills-wrap">` + 
        Object.entries(it.sizes).map(([sz, pr]) => `<span class="size-tag-badge">${sz}: ${state.settings.currency} ${pr}</span>`).join('') +
        `</div>`;
    } else {
      priceHtml = `<strong style="color: var(--crave-yellow); font-family: 'JetBrains Mono', monospace; font-size: 13.5px;">${state.settings.currency} ${it.price || 0}</strong>`;
    }

    // Badge pill
    let badgeHtml = '';
    if (it.badge) {
      badgeHtml = `<span class="badge-tag badge-bestseller" style="font-size: 10px; margin-left: 6px;">${it.badge}</span>`;
    }

    const imgSrc = it.image || 'assets/logo.png';

    tr.innerHTML = `
      <td>
        <img src="${imgSrc}" alt="${it.name}" class="menu-item-thumb-img" onerror="this.src='assets/logo.png'">
      </td>
      <td>
        <div style="font-weight: 700; color: var(--text-pure); font-size: 13px; display: flex; align-items: center; gap: 4px;">
          <span>${it.emoji || '🍽️'}</span>
          <span>${it.name}</span>
          ${badgeHtml}
        </div>
      </td>
      <td>
        <span class="status-badge" style="background: rgba(255, 190, 11, 0.12); color: var(--crave-yellow);">${it.category}</span>
      </td>
      <td>
        ${priceHtml}
      </td>
      <td style="color: var(--text-muted); font-size: 12px; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${it.description || ''}">
        ${it.description || '-'}
      </td>
      <td style="text-align: center;">
        <div class="table-action-btns">
          <button type="button" class="btn-action-edit" onclick="openEditItemModal('${it.id}')" title="Edit this item">
            ✏️ Edit
          </button>
          <button type="button" class="btn-action-delete" onclick="deleteMenuItem('${it.id}')" title="Delete from menu">
            🗑️ Delete
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Open Modal to Add New Item
function openAddItemModal() {
  document.getElementById('modal-item-id').value = '';
  document.getElementById('modal-item-title').textContent = 'Add New Menu Item';
  document.getElementById('modal-title-icon').textContent = '➕';
  document.getElementById('modal-name-input').value = '';
  document.getElementById('modal-cat-select').value = 'Burgers';
  document.getElementById('modal-custom-cat-input').style.display = 'none';
  document.getElementById('modal-custom-cat-input').value = '';
  document.getElementById('modal-desc-input').value = '';
  document.getElementById('modal-badge-select').value = 'New ✨';
  document.getElementById('modal-custom-badge-input').style.display = 'none';
  document.getElementById('modal-custom-badge-input').value = '';
  document.getElementById('modal-emoji-input').value = '🍔';
  document.getElementById('modal-image-select').value = 'assets/food/burger_zinger.jpg';
  const imgPrev = document.getElementById('modal-image-preview');
  if (imgPrev) imgPrev.src = 'assets/food/burger_zinger.jpg';
  const customImgInp = document.getElementById('modal-custom-image-data');
  if (customImgInp) customImgInp.value = '';
  const fileInpAdd = document.getElementById('modal-image-file-input');
  if (fileInpAdd) fileInpAdd.value = '';
  const urlInpAdd = document.getElementById('modal-image-url-input');
  if (urlInpAdd) urlInpAdd.value = '';
  const photoTagAdd = document.getElementById('photo-preview-tag');
  if (photoTagAdd) {
    photoTagAdd.textContent = 'Preset';
    photoTagAdd.style.background = 'rgba(255, 190, 11, 0.15)';
    photoTagAdd.style.color = 'var(--crave-yellow)';
  }

  document.getElementById('mode-single').checked = true;
  document.getElementById('single-price-container').style.display = 'block';
  document.getElementById('multi-size-container').style.display = 'none';
  document.getElementById('modal-single-price').value = '';
  document.getElementById('size-rows-list').innerHTML = '';

  document.getElementById('menu-item-modal').classList.add('active');
  document.getElementById('modal-name-input').focus();
}

// Open Modal to Edit Existing Item
function openEditItemModal(itemId, e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const item = state.menu.find(it => it.id === itemId);
  if (!item) return;

  document.getElementById('modal-item-id').value = item.id;
  document.getElementById('modal-item-title').textContent = `Edit Menu Item: "${item.name}"`;
  document.getElementById('modal-title-icon').textContent = item.emoji || '✏️';
  document.getElementById('modal-name-input').value = item.name;

  // Category
  const catSelect = document.getElementById('modal-cat-select');
  const customCatInput = document.getElementById('modal-custom-cat-input');
  let optionFound = false;
  for (let i = 0; i < catSelect.options.length; i++) {
    if (catSelect.options[i].value.toLowerCase() === (item.category || '').toLowerCase()) {
      catSelect.selectedIndex = i;
      optionFound = true;
      break;
    }
  }
  if (!optionFound && item.category) {
    const newOpt = new Option(item.category, item.category);
    catSelect.add(newOpt, catSelect.options[catSelect.options.length - 1]);
    catSelect.value = item.category;
  }
  customCatInput.style.display = 'none';
  customCatInput.value = '';

  // Description
  document.getElementById('modal-desc-input').value = item.description || '';

  // Badge
  const badgeSelect = document.getElementById('modal-badge-select');
  const customBadgeInput = document.getElementById('modal-custom-badge-input');
  let badgeFound = false;
  for (let i = 0; i < badgeSelect.options.length; i++) {
    if (badgeSelect.options[i].value === item.badge) {
      badgeSelect.selectedIndex = i;
      badgeFound = true;
      break;
    }
  }
  if (!badgeFound && item.badge) {
    badgeSelect.value = '__CUSTOM__';
    customBadgeInput.value = item.badge;
    customBadgeInput.style.display = 'block';
  } else {
    customBadgeInput.style.display = 'none';
    customBadgeInput.value = '';
  }

  // Emoji & Image (Preset, Web URL, or Uploaded)
  document.getElementById('modal-emoji-input').value = item.emoji || '🍔';
  const imgSelect = document.getElementById('modal-image-select');
  const imgPreview = document.getElementById('modal-image-preview');
  const customImgHidden = document.getElementById('modal-custom-image-data');
  const fileInpEdit = document.getElementById('modal-image-file-input');
  if (fileInpEdit) fileInpEdit.value = '';
  const urlInpEdit = document.getElementById('modal-image-url-input');
  if (urlInpEdit) urlInpEdit.value = '';
  const photoTagEdit = document.getElementById('photo-preview-tag');

  const itemImg = item.image || 'assets/food/burger_zinger.jpg';
  if (itemImg.startsWith('http://') || itemImg.startsWith('https://')) {
    if (customImgHidden) customImgHidden.value = itemImg;
    if (imgPreview) imgPreview.src = itemImg;
    if (urlInpEdit) urlInpEdit.value = itemImg;
    if (photoTagEdit) {
      photoTagEdit.textContent = 'Web URL';
      photoTagEdit.style.background = 'rgba(59, 130, 246, 0.2)';
      photoTagEdit.style.color = '#60a5fa';
    }
  } else if (itemImg.startsWith('data:image/')) {
    if (customImgHidden) customImgHidden.value = itemImg;
    if (imgPreview) imgPreview.src = itemImg;
    if (photoTagEdit) {
      photoTagEdit.textContent = 'Uploaded';
      photoTagEdit.style.background = 'rgba(16, 185, 129, 0.2)';
      photoTagEdit.style.color = '#10b981';
    }
  } else {
    if (customImgHidden) customImgHidden.value = '';
    let optExists = false;
    if (imgSelect) {
      for (let i = 0; i < imgSelect.options.length; i++) {
        if (imgSelect.options[i].value === itemImg) {
          imgSelect.selectedIndex = i;
          optExists = true;
          break;
        }
      }
      if (!optExists) {
        const opt = new Option(itemImg, itemImg);
        imgSelect.add(opt);
        imgSelect.value = itemImg;
      }
    }
    if (imgPreview) imgPreview.src = itemImg;
    if (photoTagEdit) {
      photoTagEdit.textContent = 'Preset';
      photoTagEdit.style.background = 'rgba(255, 190, 11, 0.15)';
      photoTagEdit.style.color = 'var(--crave-yellow)';
    }
  }

  // Pricing
  const modeSingle = document.getElementById('mode-single');
  const modeMulti = document.getElementById('mode-multi');
  const singleContainer = document.getElementById('single-price-container');
  const multiContainer = document.getElementById('multi-size-container');
  const sizeRowsList = document.getElementById('size-rows-list');
  sizeRowsList.innerHTML = '';

  if (item.sizes && typeof item.sizes === 'object' && Object.keys(item.sizes).length > 0) {
    modeMulti.checked = true;
    singleContainer.style.display = 'none';
    multiContainer.style.display = 'block';
    Object.entries(item.sizes).forEach(([sz, pr]) => {
      addSizeRow(sz, pr);
    });
  } else {
    modeSingle.checked = true;
    singleContainer.style.display = 'block';
    multiContainer.style.display = 'none';
    document.getElementById('modal-single-price').value = item.price || 0;
  }

  document.getElementById('menu-item-modal').classList.add('active');
  document.getElementById('modal-name-input').focus();
}

function closeMenuItemModal() {
  const modal = document.getElementById('menu-item-modal');
  if (modal) modal.classList.remove('active');
}

// Add Size Row to Multi-Size List
function addSizeRow(name = '', price = '') {
  const list = document.getElementById('size-rows-list');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'size-row-item';
  row.innerHTML = `
    <input type="text" class="form-input size-name-input" placeholder="Size Name (e.g. Small, 5 Pcs)" value="${name}" style="flex: 1.2;">
    <input type="number" class="form-input size-price-input" placeholder="Price (Rs.)" value="${price}" style="flex: 1;" min="0" step="10">
    <button type="button" class="btn-remove-size-row" title="Remove size">✕</button>
  `;
  row.querySelector('.btn-remove-size-row').addEventListener('click', () => {
    row.remove();
  });
  list.appendChild(row);
}

// Preset Size Loader
function applySizePreset(preset) {
  const list = document.getElementById('size-rows-list');
  if (!list) return;
  list.innerHTML = '';
  if (preset === 'pizza') {
    addSizeRow('Small', 600);
    addSizeRow('Medium', 1000);
    addSizeRow('Large', 1400);
    addSizeRow('XL', 2000);
  } else if (preset === 'pieces') {
    addSizeRow('5 Pcs', 330);
    addSizeRow('10 Pcs', 650);
  } else if (preset === 'fries') {
    addSizeRow('Regular', 250);
    addSizeRow('Large', 350);
  }
}

// Save Modal Item (Add or Update)
async function saveMenuItemModal() {
  const id = document.getElementById('modal-item-id').value;
  const name = document.getElementById('modal-name-input').value.trim();
  if (!name) {
    showToast('Please enter an item name!', 'error');
    document.getElementById('modal-name-input').focus();
    return;
  }

  let category = document.getElementById('modal-cat-select').value;
  if (category === '__NEW__') {
    const custom = document.getElementById('modal-custom-cat-input').value.trim();
    if (!custom) {
      showToast('Please enter custom category name!', 'error');
      document.getElementById('modal-custom-cat-input').focus();
      return;
    }
    category = custom;
  }

  let badge = document.getElementById('modal-badge-select').value;
  if (badge === '__CUSTOM__') {
    badge = document.getElementById('modal-custom-badge-input').value.trim();
  }

  const desc = document.getElementById('modal-desc-input').value.trim();
  const emoji = document.getElementById('modal-emoji-input').value.trim() || '🍔';
  const customImg = document.getElementById('modal-custom-image-data')?.value;
  const presetImg = document.getElementById('modal-image-select')?.value || 'assets/logo.png';
  const image = customImg || presetImg;
  const isMulti = document.getElementById('mode-multi').checked;

  let singlePrice = 0;
  let sizesObj = {};

  if (!isMulti) {
    singlePrice = parseFloat(document.getElementById('modal-single-price').value);
    if (isNaN(singlePrice) || singlePrice < 0) {
      showToast('Please enter a valid price!', 'error');
      document.getElementById('modal-single-price').focus();
      return;
    }
  } else {
    const rows = document.querySelectorAll('#size-rows-list .size-row-item');
    if (rows.length === 0) {
      showToast('Please add at least one size variation or switch to single price!', 'error');
      return;
    }
    let validRows = 0;
    rows.forEach(r => {
      const sName = r.querySelector('.size-name-input')?.value.trim();
      const sPrice = parseFloat(r.querySelector('.size-price-input')?.value);
      if (sName && !isNaN(sPrice) && sPrice >= 0) {
        sizesObj[sName] = sPrice;
        validRows++;
      }
    });
    if (validRows === 0) {
      showToast('Please specify valid size names and prices!', 'error');
      return;
    }
  }

  if (!id) {
    // Add New Item to Menu
    const newItem = {
      id: 'cxb-' + Date.now(),
      name,
      category,
      description: desc || 'Freshly prepared specialty dish',
      badge: badge || undefined,
      image,
      emoji
    };
    if (isMulti) {
      newItem.sizes = sizesObj;
    } else {
      newItem.price = singlePrice;
    }
    state.menu.unshift(newItem); // Place at top for immediate visibility
    showToast(`✅ "${name}" added to menu successfully!`);
  } else {
    // Edit Existing Item
    const item = state.menu.find(it => it.id === id);
    if (item) {
      item.name = name;
      item.category = category;
      item.description = desc;
      item.badge = badge || undefined;
      item.image = image;
      item.emoji = emoji;
      if (isMulti) {
        item.sizes = sizesObj;
        delete item.price;
      } else {
        item.price = singlePrice;
        delete item.sizes;
      }
      showToast(`✅ "${name}" updated successfully!`);
    }
  }

  await persistMenu();
  closeMenuItemModal();
  renderCategorySidebar();
  renderCatalog();
  renderMenuManagementTable();
}

// Delete Item from Menu
async function deleteMenuItem(itemId) {
  const item = state.menu.find(it => it.id === itemId);
  if (!item) return;
  if (!confirm(`Are you sure you want to remove "${item.name}" from the menu?`)) return;

  state.menu = state.menu.filter(it => it.id !== itemId);
  await persistMenu();
  showToast(`🗑️ "${item.name}" deleted from menu.`, 'info');
  renderCategorySidebar();
  renderCatalog();
  renderMenuManagementTable();
}

// Disk and LocalStorage Persistence Helper
async function persistMenu() {
  try {
    if (isElectron) {
      await ipcRenderer.invoke('write-json', 'menu.json', state.menu);
    }
    localStorage.setItem('cravex_menu', JSON.stringify(state.menu));
    return true;
  } catch (err) {
    console.error('Error persisting menu:', err);
    return false;
  }
}

// Toast Notification Engine
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '✅'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Export Menu as JSON File
function exportMenuBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.menu, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `cravex_menu_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  showToast('💾 Menu backup JSON exported successfully!');
}

// Import Menu from JSON File
function importMenuBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported) && imported.length > 0 && imported[0].name) {
        state.menu = imported;
        await persistMenu();
        renderCategorySidebar();
        renderCatalog();
        renderMenuManagementTable();
        showToast(`📥 Successfully imported ${imported.length} menu items!`);
      } else {
        showToast('Invalid menu file format!', 'error');
      }
    } catch (err) {
      showToast('Error parsing JSON backup file!', 'error');
    }
  };
  reader.readAsText(file);
}

// Reset Menu to Crave Bites Flyer Default
async function resetDefaultMenu() {
  if (!confirm('Are you sure you want to restore the default CraveX Bites flyer menu? Any unsaved custom items will be replaced.')) return;
  try {
    const res = await fetch('database/menu.json');
    if (res.ok) {
      state.menu = await res.json();
      await persistMenu();
      renderCategorySidebar();
      renderCatalog();
      renderMenuManagementTable();
      showToast('🔄 Restored default CRAVE Bites menu successfully!');
    }
  } catch (e) {
    showToast('Failed to reload default menu.', 'error');
  }
}

// Expose CRUD Handlers to Global Window Scope for Inline HTML onclicks
window.openEditItemModal = openEditItemModal;
window.openAddItemModal = openAddItemModal;
window.closeMenuItemModal = closeMenuItemModal;
window.deleteMenuItem = deleteMenuItem;
window.showToast = showToast;

