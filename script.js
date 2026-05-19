// ==================== DATA & STATE ====================
const appState = {
    cart: [],
    products: [
        { id: 1, name: 'Kopi Arabika', price: 35000, stock: 50, emoji: '☕' },
        { id: 2, name: 'Teh Hijau', price: 28000, stock: 40, emoji: '🍵' },
        { id: 3, name: 'Donat Coklat', price: 15000, stock: 35, emoji: '🍩' },
        { id: 4, name: 'Roti Tawar', price: 22000, stock: 25, emoji: '🍞' },
        { id: 5, name: 'Pisang Goreng', price: 18000, stock: 30, emoji: '🍌' },
        { id: 6, name: 'Cokelat Panas', price: 25000, stock: 45, emoji: '🍫' },
        { id: 7, name: 'Jus Jeruk', price: 20000, stock: 50, emoji: '🧡' },
        { id: 8, name: 'Pastry', price: 30000, stock: 20, emoji: '🥐' },
        { id: 9, name: 'Bolu Kukus', price: 12000, stock: 40, emoji: '🎂' },
        { id: 10, name: 'Sandwich', price: 32000, stock: 35, emoji: '🥪' },
        { id: 11, name: 'Muffin Blueberry', price: 28000, stock: 25, emoji: '🧁' },
        { id: 12, name: 'Iced Tea', price: 18000, stock: 60, emoji: '🥤' }
    ],
    transactions: [],
    paymentMethod: 'cash',
    settings: {
        storeName: 'NexusCash Store',
        storeAddress: 'Jl. Modern No. 123',
        storePhone: '0812-3456-7890'
    }
};

// ==================== DOM ELEMENTS ====================
const elements = {
    sidebar: document.querySelector('.sidebar'),
    navItems: document.querySelectorAll('.nav-item'),
    contentSections: document.querySelectorAll('.content-section'),
    productsGrid: document.getElementById('productsGrid'),
    productCount: document.getElementById('productCount'),
    cartItems: document.getElementById('cartItems'),
    subtotal: document.getElementById('subtotal'),
    discountInput: document.getElementById('discountInput'),
    discountAmount: document.getElementById('discountAmount'),
    taxAmount: document.getElementById('taxAmount'),
    totalAmount: document.getElementById('totalAmount'),
    paymentAmount: document.getElementById('paymentAmount'),
    changeDisplay: document.getElementById('changeDisplay'),
    clearCartBtn: document.getElementById('clearCartBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    printBtn: document.getElementById('printBtn'),
    paymentBtns: document.querySelectorAll('.payment-btn'),
    checkoutModal: document.getElementById('checkoutModal'),
    receiptPreview: document.getElementById('receiptPreview'),
    modalClose: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    confirmBtn: document.getElementById('confirmBtn'),
    toast: document.getElementById('toast'),
    searchInput: document.getElementById('searchInput'),
    addProductBtn: document.getElementById('addProductBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    productsTableBody: document.getElementById('productsTableBody'),
    historyContainer: document.getElementById('historyContainer'),
    timeDisplay: document.getElementById('timeDisplay'),
    storeName: document.getElementById('storeName'),
    storeAddress: document.getElementById('storeAddress'),
    storePhone: document.getElementById('storePhone')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderProducts();
    setupEventListeners();
    updateTime();
    loadSettings();
    setInterval(updateTime, 1000);
}

// ==================== TIME UPDATE ====================
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    elements.timeDisplay.textContent = `${hours}:${minutes}`;
}

// ==================== EVENT LISTENERS SETUP ====================
function setupEventListeners() {
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Cart actions
    elements.clearCartBtn.addEventListener('click', clearCart);
    elements.checkoutBtn.addEventListener('click', openCheckoutModal);
    elements.printBtn.addEventListener('click', printReceipt);

    // Payment method selection
    elements.paymentBtns.forEach(btn => {
        btn.addEventListener('click', handlePaymentMethod);
    });

    // Discount calculation
    elements.discountInput.addEventListener('input', calculateTotals);

    // Payment amount input
    elements.paymentAmount.addEventListener('input', handlePaymentInput);

    // Modal actions
    elements.modalClose.addEventListener('click', closeCheckoutModal);
    elements.cancelBtn.addEventListener('click', closeCheckoutModal);
    elements.confirmBtn.addEventListener('click', confirmCheckout);

    // Search
    elements.searchInput.addEventListener('input', handleSearch);

    // Settings
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
}

// ==================== NAVIGATION ====================
function handleNavigation(e) {
    const targetMenu = e.currentTarget.getAttribute('data-menu');

    // Update active nav item
    elements.navItems.forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Update active content section
    elements.contentSections.forEach(section => section.classList.remove('active'));
    document.getElementById(targetMenu).classList.add('active');

    // Special handling for specific sections
    if (targetMenu === 'products') {
        renderProductsTable();
    } else if (targetMenu === 'history') {
        renderHistory();
    }
}

// ==================== PRODUCT RENDERING ====================
function renderProducts() {
    elements.productsGrid.innerHTML = '';
    appState.products.forEach(product => {
        const card = createProductCard(product);
        elements.productsGrid.appendChild(card);
    });
    elements.productCount.textContent = appState.products.length;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-emoji">${product.emoji}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <div class="product-stock">Stok: ${product.stock}</div>
        <button class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}" 
                ${product.stock === 0 ? 'disabled' : ''}>
            Tambah
        </button>
    `;

    const btn = card.querySelector('.add-to-cart-btn');
    btn.addEventListener('click', () => addToCart(product));

    return card;
}

// ==================== SEARCH FUNCTIONALITY ====================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== CART MANAGEMENT ====================
function addToCart(product) {
    if (product.stock <= 0) {
        showToast('Stok produk habis!', 'warning');
        return;
    }

    const existingItem = appState.cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();
    showToast(`${product.name} ditambahkan ke keranjang`, 'success');
}

function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartQuantity(productId, change) {
    const item = appState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    if (appState.cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="empty-icon">📭</span>
                <p>Keranjang kosong</p>
            </div>
        `;
    } else {
        elements.cartItems.innerHTML = '';
        appState.cart.forEach(item => {
            const cartItem = createCartItem(item);
            elements.cartItems.appendChild(cartItem);
        });
    }

    calculateTotals();
}

function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
        </div>
        <div class="cart-item-quantity">
            <button>−</button>
            <span>${item.quantity}</span>
            <button>+</button>
        </div>
        <button class="cart-item-remove">🗑️</button>
    `;

    const decreaseBtn = div.querySelector('.cart-item-quantity button:first-child');
    const increaseBtn = div.querySelector('.cart-item-quantity button:last-of-type');
    const removeBtn = div.querySelector('.cart-item-remove');

    decreaseBtn.addEventListener('click', () => updateCartQuantity(item.id, -1));
    increaseBtn.addEventListener('click', () => updateCartQuantity(item.id, 1));
    removeBtn.addEventListener('click', () => removeFromCart(item.id));

    return div;
}

function clearCart() {
    if (appState.cart.length === 0) {
        showToast('Keranjang sudah kosong', 'warning');
        return;
    }

    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
        appState.cart = [];
        updateCartDisplay();
        showToast('Keranjang telah dikosongkan', 'success');
    }
}

// ==================== CALCULATION ====================
function calculateTotals() {
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const discountPercent = parseInt(elements.discountInput.value) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * 10) / 100;
    const total = afterDiscount + taxAmount;

    // Update display
    elements.subtotal.textContent = formatCurrency(subtotal);
    elements.discountAmount.textContent = formatCurrency(discountAmount);
    elements.taxAmount.textContent = formatCurrency(taxAmount);
    elements.totalAmount.textContent = formatCurrency(total);

    // Store for checkout
    appState.currentSubtotal = subtotal;
    appState.currentDiscount = discountAmount;
    appState.currentTax = taxAmount;
    appState.currentTotal = total;

    handlePaymentInput();
}

function handlePaymentInput() {
    const paymentAmount = parseInt(elements.paymentAmount.value) || 0;
    const total = appState.currentTotal || 0;
    const change = paymentAmount - total;

    const changeDisplay = elements.changeDisplay.querySelector('.change-amount');
    if (change >= 0) {
        changeDisplay.textContent = formatCurrency(change);
        changeDisplay.style.color = 'var(--success)';
    } else {
        changeDisplay.textContent = formatCurrency(Math.abs(change));
        changeDisplay.style.color = 'var(--danger)';
    }
}

// ==================== PAYMENT METHOD ====================
function handlePaymentMethod(e) {
    elements.paymentBtns.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    appState.paymentMethod = e.currentTarget.getAttribute('data-method');
}

// ==================== CHECKOUT MODAL ====================
function openCheckoutModal() {
    if (appState.cart.length === 0) {
        showToast('Keranjang kosong, tambahkan produk terlebih dahulu', 'warning');
        return;
    }

    const paymentAmount = parseInt(elements.paymentAmount.value) || 0;
    const total = appState.currentTotal || 0;

    if (paymentAmount < total) {
        showToast('Jumlah pembayaran kurang!', 'warning');
        return;
    }

    generateReceipt();
    elements.checkoutModal.classList.add('active');
}

function closeCheckoutModal() {
    elements.checkoutModal.classList.remove('active');
}

function generateReceipt() {
    const discount = parseInt(elements.discountInput.value) || 0;
    const paymentMethod = {
        'cash': 'Tunai',
        'card': 'Kartu Kredit',
        'digital': 'Dompet Digital'
    }[appState.paymentMethod];

    let receiptHTML = `
        <div class="receipt-header">
            <div class="receipt-store-name">${appState.settings.storeName}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${appState.settings.storeAddress}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${appState.settings.storePhone}</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 5px;">
                ${new Date().toLocaleString('id-ID')}
            </div>
        </div>
    `;

    receiptHTML += '<div style="margin-bottom: 10px;">';
    appState.cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        receiptHTML += `
            <div class="receipt-line">
                <span>${item.quantity}x ${item.name}</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
        `;
    });
    receiptHTML += '</div>';

    receiptHTML += `
        <div class="receipt-line">
            <span class="receipt-label">Subtotal</span>
            <span class="receipt-value">${formatCurrency(appState.currentSubtotal)}</span>
        </div>
    `;

    if (discount > 0) {
        receiptHTML += `
            <div class="receipt-line">
                <span class="receipt-label">Diskon (${discount}%)</span>
                <span class="receipt-value">-${formatCurrency(appState.currentDiscount)}</span>
            </div>
        `;
    }

    receiptHTML += `
        <div class="receipt-line">
            <span class="receipt-label">Pajak (10%)</span>
            <span class="receipt-value">${formatCurrency(appState.currentTax)}</span>
        </div>
        <div class="receipt-line">
            <span class="receipt-label">Total</span>
            <span class="receipt-value receipt-total">${formatCurrency(appState.currentTotal)}</span>
        </div>
        <div class="receipt-line">
            <span class="receipt-label">Pembayaran</span>
            <span class="receipt-value">${formatCurrency(parseInt(elements.paymentAmount.value))}</span>
        </div>
        <div class="receipt-line">
            <span class="receipt-label">Kembalian</span>
            <span class="receipt-value">${formatCurrency(parseInt(elements.paymentAmount.value) - appState.currentTotal)}</span>
        </div>
        <div class="receipt-footer">
            <p>Metode Pembayaran: ${paymentMethod}</p>
            <p style="margin-top: 8px;">Terima Kasih atas Pembelian Anda</p>
            <p>Semoga Puas dengan Layanan Kami</p>
        </div>
    `;

    elements.receiptPreview.innerHTML = receiptHTML;
}

function confirmCheckout() {
    const transaction = {
        id: Date.now(),
        items: appState.cart.length,
        amount: appState.currentTotal,
        method: appState.paymentMethod,
        timestamp: new Date().toLocaleString('id-ID'),
        details: [...appState.cart]
    };

    appState.transactions.push(transaction);

    // Reset form
    appState.cart = [];
    elements.paymentAmount.value = '';
    elements.discountInput.value = '';
    updateCartDisplay();

    closeCheckoutModal();
    showToast('Transaksi berhasil diproses!', 'success');

    // Update stock
    transaction.details.forEach(item => {
        const product = appState.products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    renderProducts();
}

// ==================== PRINT RECEIPT ====================
function printReceipt() {
    if (appState.cart.length === 0) {
        showToast('Tidak ada data untuk dicetak', 'warning');
        return;
    }

    const printWindow = window.open('', '', 'height=500,width=400');
    const receiptHTML = elements.receiptPreview.innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Struk Pembelian</title>
            <style>
                body {
                    font-family: monospace;
                    margin: 20px;
                    color: #000;
                }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .receipt-store-name { font-weight: bold; font-size: 14px; }
                .receipt-line { display: flex; justify-content: space-between; margin: 8px 0; }
                .receipt-footer { text-align: center; margin-top: 20px; font-size: 12px; }
                hr { border: 1px dashed #000; }
            </style>
        </head>
        <body>
            ${receiptHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

// ==================== PRODUCTS TABLE ====================
function renderProductsTable() {
    elements.productsTableBody.innerHTML = '';
    appState.products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.emoji} ${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-small btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">Hapus</button>
                </div>
            </td>
        `;
        elements.productsTableBody.appendChild(row);
    });
}

function editProduct(productId) {
    alert('Fitur edit akan segera tersedia');
}

function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        appState.products = appState.products.filter(p => p.id !== productId);
        renderProductsTable();
        renderProducts();
        showToast('Produk berhasil dihapus', 'success');
    }
}

// ==================== HISTORY ====================
function renderHistory() {
    if (appState.transactions.length === 0) {
        elements.historyContainer.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>Belum ada transaksi</p>
            </div>
        `;
        return;
    }

    elements.historyContainer.innerHTML = '';
    appState.transactions.forEach(transaction => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-meta">
                    <div class="history-time">${transaction.timestamp}</div>
                    <div class="history-items">${transaction.items} item(s)</div>
                    <div class="history-amount">${formatCurrency(transaction.amount)}</div>
                </div>
            </div>
            <div class="history-status">✓ Berhasil</div>
        `;
        elements.historyContainer.appendChild(historyItem);
    });
}

// ==================== SETTINGS ====================
function loadSettings() {
    elements.storeName.value = appState.settings.storeName;
    elements.storeAddress.value = appState.settings.storeAddress;
    elements.storePhone.value = appState.settings.storePhone;
}

function saveSettings() {
    appState.settings.storeName = elements.storeName.value;
    appState.settings.storeAddress = elements.storeAddress.value;
    appState.settings.storePhone = elements.storePhone.value;

    localStorage.setItem('nexuscash_settings', JSON.stringify(appState.settings));
    showToast('Pengaturan berhasil disimpan', 'success');
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.className = `toast active ${type}`;

    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCheckoutModal();
    }
});

// Save settings on page unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('nexuscash_cart', JSON.stringify(appState.cart));
});

// Load cart from localStorage
window.addEventListener('load', () => {
    const savedCart = localStorage.getItem('nexuscash_cart');
    if (savedCart) {
        try {
            appState.cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (e) {
            console.log('Tidak ada data keranjang yang tersimpan');
        }
    }
});
