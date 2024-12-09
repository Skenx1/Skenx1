// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 13 High Quality",
        category: "PHONE",
        price: 999.00,
        image: "iphone.jpg",
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "WH-1000XM4 Wireless Headphones",
        category: "AUDIO",
        price: 349.00,
        image: "headphones.jpg",
        rating: 4.8,
        reviews: 256,
        discount: 50
    },
    // Add more products as needed
];

// Cart functionality
let cart = [];
let isCartOpen = false;

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const overlay = document.getElementById('overlay');
const featuredProducts = document.getElementById('featuredProducts');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    setupPromoBanner();
});

// Render products
function renderProducts() {
    featuredProducts.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    ${product.discount 
                        ? `<span class="original-price">$${product.price.toFixed(2)}</span>`
                        : ''
                    }
                    $${((product.price * (100 - (product.discount || 0))) / 100).toFixed(2)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    overlay.addEventListener('click', () => {
        if (isCartOpen) toggleCart();
        closeCheckoutModal();
    });
    checkoutBtn.addEventListener('click', openCheckoutModal);

    // Close modal button
    document.querySelector('.close-modal').addEventListener('click', closeCheckoutModal);

    // Checkout form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

// Toggle cart sidebar
function toggleCart() {
    isCartOpen = !isCartOpen;
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    if (!isCartOpen) toggleCart();
}

// Update cart
function updateCart() {
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">
                    $${((item.price * (100 - (item.discount || 0))) / 100).toFixed(2)}
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');

    // Update cart total
    const total = cart.reduce((sum, item) => 
        sum + (item.price * (100 - (item.discount || 0)) / 100) * item.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Update cart count
    document.querySelector('.cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Promotional banner rotation
function setupPromoBanner() {
    const slides = document.querySelectorAll('.promo-slide');
    let currentSlide = 0;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Checkout modal
function openCheckoutModal() {
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    if (!isCartOpen) overlay.classList.remove('active');
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();
    
    // Simulate checkout process
    const formData = new FormData(e.target);
    console.log('Processing order...', {
        name: formData.get('name'),
        email: formData.get('email'),
        address: formData.get('address'),
        card: formData.get('card'),
        items: cart
    });

    // Show success message
    alert('Order placed successfully!');
    
    // Clear cart and close modals
    cart = [];
    updateCart();
    closeCheckoutModal();
    toggleCart();
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});