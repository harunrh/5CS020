// cart.js - JavaScript for handling shopping cart functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count in header
    updateCartCount();
    
    // Initialize cart page if we're on the cart page
    if (document.querySelector('.cart-section')) {
        initCartPage();
    }
});

// ==========================================
// Cart Management Functions
// ==========================================

// Add a product to the cart
function addToCart(product) {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    
    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Product already in cart, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Product not in cart, add it with quantity 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('harunfitCart', JSON.stringify(cart));
}

// Remove a product from the cart
function removeFromCart(productId) {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    
    // Remove the product with the given ID
    cart = cart.filter(item => item.id !== productId);
    
    // Save updated cart to localStorage
    localStorage.setItem('harunfitCart', JSON.stringify(cart));
    
    // Update cart display and count
    updateCartDisplay();
    updateCartCount();
}

// Update quantity of a product in the cart
function updateCartItemQuantity(productId, newQuantity) {
    // Ensure quantity is at least 1
    newQuantity = Math.max(1, newQuantity);
    
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    
    // Find the product in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity = newQuantity;
        
        // Save updated cart to localStorage
        localStorage.setItem('harunfitCart', JSON.stringify(cart));
        
        // Update cart display and count
        updateCartDisplay();
        updateCartCount();
    }
}

// Clear the entire cart
function clearCart() {
    // Clear cart in localStorage
    localStorage.setItem('harunfitCart', JSON.stringify([]));
    
    // Update cart display and count
    updateCartDisplay();
    updateCartCount();
}

// Calculate cart totals
function calculateCartTotals() {
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Set shipping cost (free if subtotal exceeds £50)
    const shipping = subtotal > 50 ? 0 : 3.99;
    
    // Calculate total
    const total = subtotal + shipping;
    
    return {
        subtotal,
        shipping,
        total,
        itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
}

// ==========================================
// Cart Page Initialization
// ==========================================
function initCartPage() {
    // Display cart items
    updateCartDisplay();
    
    // Initialize quantity buttons
    initQuantityButtons();
    
    // Initialize remove buttons
    initRemoveButtons();
    
    // Initialize clear cart button
    initClearCartButton();
}

// Update the cart display on cart page
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartContent = document.getElementById('cart-content');
    
    if (!cartItemsContainer) return; // Not on cart page
    
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    
    // Check if cart is empty
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';
    }
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    // Add each cart item to the display
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update totals
    updateCartTotals();
    
    // Re-initialize buttons after updating display
    initQuantityButtons();
    initRemoveButtons();
}

// Create cart item element
function createCartItemElement(item) {
    // Create cart item container
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    // Create product info section
    const productInfo = document.createElement('div');
    productInfo.className = 'cart-item-product';
    
    // Product image
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    
    // Product details
    const details = document.createElement('div');
    details.className = 'cart-item-details';
    
    const name = document.createElement('h3');
    name.textContent = item.name;
    
    const category = document.createElement('p');
    category.className = 'cart-item-category';
    category.textContent = capitalizeFirstLetter(item.category);
    
    details.appendChild(name);
    details.appendChild(category);
    
    productInfo.appendChild(img);
    productInfo.appendChild(details);
    
    // Price cell
    const priceCell = document.createElement('div');
    priceCell.className = 'cart-item-price';
    priceCell.textContent = formatPrice(item.price);
    
    // Quantity controls
    const quantityCell = document.createElement('div');
    quantityCell.className = 'cart-item-quantity';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn decrease';
    decreaseBtn.textContent = '-';
    
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = item.quantity;
    quantityInput.min = 1;
    quantityInput.max = 10;
    quantityInput.readOnly = true;
    
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn increase';
    increaseBtn.textContent = '+';
    
    quantityCell.appendChild(decreaseBtn);
    quantityCell.appendChild(quantityInput);
    quantityCell.appendChild(increaseBtn);
    
    // Item total
    const totalCell = document.createElement('div');
    totalCell.className = 'cart-item-total';
    totalCell.textContent = formatPrice(item.price * item.quantity);
    
    // Remove button
    const actionCell = document.createElement('div');
    actionCell.className = 'cart-item-action';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    
    actionCell.appendChild(removeBtn);
    
    // Combine all cells into the cart item
    cartItem.appendChild(productInfo);
    cartItem.appendChild(priceCell);
    cartItem.appendChild(quantityCell);
    cartItem.appendChild(totalCell);
    cartItem.appendChild(actionCell);
    
    return cartItem;
}

// Update cart totals display
function updateCartTotals() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const totalElement = document.getElementById('cart-total');
    
    if (!subtotalElement || !shippingElement || !totalElement) return; // Not on cart page
    
    // Calculate totals
    const { subtotal, shipping, total } = calculateCartTotals();
    
    // Update the display
    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    totalElement.textContent = formatPrice(total);
}

// ==========================================
// Button Event Handlers
// ==========================================

// Initialize quantity adjustment buttons
function initQuantityButtons() {
    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the cart item
            const cartItem = button.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-id'));
            
            // Get current quantity
            const quantityInput = cartItem.querySelector('input');
            const currentQuantity = parseInt(quantityInput.value);
            
            // Update quantity (max 10)
            const newQuantity = Math.min(currentQuantity + 1, 10);
            updateCartItemQuantity(productId, newQuantity);
        });
    });
    
    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the cart item
            const cartItem = button.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-id'));
            
            // Get current quantity
            const quantityInput = cartItem.querySelector('input');
            const currentQuantity = parseInt(quantityInput.value);
            
            // Update quantity (min 1)
            const newQuantity = Math.max(currentQuantity - 1, 1);
            updateCartItemQuantity(productId, newQuantity);
        });
    });
}

// Initialize remove item buttons
function initRemoveButtons() {
    const removeButtons = document.querySelectorAll('.btn-remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the cart item
            const cartItem = button.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-id'));
            
            // Remove from cart
            removeFromCart(productId);
        });
    });
}

// Initialize clear cart button
function initClearCartButton() {
    const clearCartButton = document.getElementById('clear-cart');
    
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            // Ask for confirmation before clearing
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        });
    }
}

// Helper function for first letter capitalization
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}