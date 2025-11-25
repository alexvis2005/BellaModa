// Sample product data with real image URLs
const products = [
    {
        id: 1,
        name: "Nike Air Max 270",
        brand: "nike",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        description: "Premium running shoes with advanced Air Max cushioning technology for all-day comfort."
    },
    {
        id: 2,
        name: "Adidas Ultraboost 22",
        brand: "adidas",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
        description: "High-performance running shoes with responsive Boost technology and adaptive fit."
    },
    {
        id: 3,
        name: "Gucci GG Marmont Bag",
        brand: "gucci",
        price: 1200.00,
        description: "Luxury leather handbag with iconic GG hardware and chain strap."
    },
    {
        id: 4,
        name: "Prada Re-Nylon Jacket",
        brand: "prada",
        price: 950.00,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
        description: "Sustainable nylon jacket from Prada's Re-Nylon collection, featuring clean lines and premium construction."
    },
    {
        id: 5,
        name: "Balenciaga Triple S Sneakers",
        brand: "balenciaga",
        price: 895.00,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop",
        description: "Chunky sole designer sneakers with multi-layer sole and distressed details."
    },
    {
        id: 6,
        name: "Nike Dunk Low Retro",
        brand: "nike",
        price: 110.00,
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&h=500&fit=crop",
        description: "Classic basketball sneakers reimagined for modern streetwear style."
    },
    {
        id: 7,
        name: "Adidas Yeezy Boost 350",
        brand: "adidas",
        price: 220.00,
        image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=500&fit=crop",
        description: "Limited edition sneakers with Primeknit upper and responsive Boost cushioning."
    },
    {
        id: 8,
        name: "Gucci Dionysus Bag",
        brand: "gucci",
        price: 2300.00,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
        description: "Embroidered GG Supreme bag with tiger head closure and chain strap."
    },
    {
        id: 9,
        name: "Prada Saffiano Wallet",
        brand: "prada",
        price: 450.00,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
        description: "Premium Saffiano leather wallet with multiple compartments and iconic logo."
    },
    {
        id: 10,
        name: "Balenciaga Hourglass Bag",
        brand: "balenciaga",
        price: 1750.00,
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=500&fit=crop",
        description: "Structured hourglass bag with sharp angles and luxury hardware."
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let currentProductView = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    checkAuthState();
});

// Product loading and filtering
function loadProducts(filteredProducts = products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card">
                <div class="product-image" onclick="viewProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'">
                    <button class="quick-view-btn" onclick="event.stopPropagation(); viewProduct(${product.id})">
                        👁️
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand.toUpperCase()}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += productCard;
    });
}

function filterProducts() {
    const brandFilter = document.getElementById('brandFilter').value;
    let filtered = products;
    
    if (brandFilter !== 'all') {
        filtered = products.filter(product => product.brand === brandFilter);
    }
    
    loadProducts(filtered);
}

function sortProducts() {
    const sortFilter = document.getElementById('sortFilter').value;
    let sorted = [...products];
    
    switch(sortFilter) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    loadProducts(sorted);
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    saveCart();
    showNotification('Item removed from cart');
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
            saveCart();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <p>Add some items to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = `
            <div class="cart-item">
                <div class="cart-item-header">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                         onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <p>$${item.price.toFixed(2)} each</p>
                        <div class="cart-item-controls">
                            <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                            <span class="cart-quantity-display">${item.quantity}</span>
                            <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
                <div class="cart-item-total">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
        cartItems.innerHTML += cartItem;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Product View Modal
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProductView = product;
    
    const modalContent = document.getElementById('productModalContent');
    modalContent.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'">
            </div>
            <div class="product-detail-info">
                <div class="product-detail-brand">${product.brand.toUpperCase()}</div>
                <h2 class="product-detail-name">${product.name}</h2>
                <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                <p class="product-detail-description">${product.description}</p>
                
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateProductQuantity(-1)">-</button>
                    <span class="quantity-display" id="productQuantity">1</span>
                    <button class="quantity-btn" onclick="updateProductQuantity(1)">+</button>
                </div>
                
                <button class="btn-primary" onclick="addCurrentProductToCart()" style="margin-bottom: 1rem;">
                    Add to Cart - $<span id="productTotalPrice">${product.price.toFixed(2)}</span>
                </button>
                
                <button class="btn-add-cart" onclick="addCurrentProductToCartAndClose()" style="background: var(--secondary-bg);">
                    Add to Cart and Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('productModal').style.display = 'block';
}

function updateProductQuantity(change) {
    const quantityElement = document.getElementById('productQuantity');
    const totalPriceElement = document.getElementById('productTotalPrice');
    
    let quantity = parseInt(quantityElement.textContent) + change;
    if (quantity < 1) quantity = 1;
    
    quantityElement.textContent = quantity;
    const totalPrice = (currentProductView.price * quantity).toFixed(2);
    totalPriceElement.textContent = totalPrice;
}

function addCurrentProductToCart() {
    if (!currentProductView) return;
    
    const quantity = parseInt(document.getElementById('productQuantity').textContent);
    
    const existingItem = cart.find(item => item.id === currentProductView.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...currentProductView,
            quantity: quantity
        });
    }
    
    updateCartCount();
    saveCart();
    showNotification(`${quantity} ${currentProductView.name} added to cart!`);
}

function addCurrentProductToCartAndClose() {
    addCurrentProductToCart();
    closeProductModal();
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    currentProductView = null;
}

// Modal controls
function toggleAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function switchTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected form and activate tab
    document.getElementById(tabName + 'Form').classList.add('active');
    event.target.classList.add('active');
}

// Auth functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Simulate login
    currentUser = { email, name: email.split('@')[0] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    toggleAuthModal();
    showNotification('Successfully logged in!');
    updateAuthState();
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelectorAll('input[type="password"]')[0].value;
    
    // Simulate registration
    currentUser = { email, name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    toggleAuthModal();
    showNotification('Account created successfully!');
    updateAuthState();
});

document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    // Basic admin check
    if (email === 'admin@marketmax.com' && password === 'admin123') {
        toggleAuthModal();
        toggleAdminPanel();
        showNotification('Admin access granted');
    } else {
        showNotification('Invalid admin credentials', 'error');
    }
});

function checkAuthState() {
    if (currentUser) {
        updateAuthState();
    }
}

function updateAuthState() {
    const authBtn = document.querySelector('.btn-auth');
    if (currentUser) {
        authBtn.textContent = currentUser.name;
        authBtn.onclick = function() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthState();
            showNotification('Logged out successfully');
        };
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = toggleAuthModal;
    }
}

// Admin panel
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    
    if (panel.style.display === 'block') {
        loadAdminProducts();
    }
}

function loadAdminProducts() {
    const adminList = document.getElementById('adminProductsList');
    adminList.innerHTML = '<div class="products-grid">';
    
    products.forEach(product => {
        adminList.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>Brand: ${product.brand}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="deleteProduct(${product.id})" class="btn-primary" style="background: #dc3545;">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    adminList.innerHTML += '</div>';
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            loadAdminProducts();
            loadProducts();
            showNotification('Product deleted');
        }
    }
}

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const inputs = this.querySelectorAll('input, select, textarea');
    const newProduct = {
        id: Date.now(),
        name: inputs[0].value,
        price: parseFloat(inputs[1].value),
        brand: inputs[2].value,
        image: inputs[3].value || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop',
        description: inputs[4].value
    };
    
    products.push(newProduct);
    this.reset();
    loadAdminProducts();
    loadProducts();
    showNotification('Product added successfully');
});

// Payment functionality
function showPaymentModal() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const modal = document.getElementById('paymentModal');
    const orderSummary = document.getElementById('orderSummary');
    
    let summaryHTML = '';
    cart.forEach(item => {
        summaryHTML += `
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
        `;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summaryHTML += `<h4>Total: $${total.toFixed(2)}</h4>`;
    
    orderSummary.innerHTML = summaryHTML;
    modal.style.display = 'block';
    toggleCart(); // Close cart sidebar
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Utility functions
function scrollToCatalog() {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : 'var(--accent-color)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const authModal = document.getElementById('authModal');
    const paymentModal = document.getElementById('paymentModal');
    const productModal = document.getElementById('productModal');
    
    if (event.target === authModal) {
        authModal.style.display = 'none';
    }
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
    if (event.target === productModal) {
        closeProductModal();
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);