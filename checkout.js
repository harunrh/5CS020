// checkout.js - JavaScript for handling checkout functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize checkout page if we're on the checkout page
    if (document.querySelector('.checkout-section')) {
        initCheckoutPage();
    }
});

// ==========================================
// Checkout Page Initialization
// ==========================================
function initCheckoutPage() {
    // Display checkout items and totals
    displayCheckoutItems();
    
    // Initialize checkout form submission
    initCheckoutForm();
    
    // Add validation to form fields
    initFormValidation();
}

// Display checkout items from cart
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    
    if (!checkoutItemsContainer) return; // Not on checkout page
    
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    
    // Check if cart is empty, redirect to cart page if it is
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Clear existing items
    checkoutItemsContainer.innerHTML = '';
    
    // Add each cart item to the display
    cart.forEach(item => {
        const checkoutItemElement = createCheckoutItemElement(item);
        checkoutItemsContainer.appendChild(checkoutItemElement);
    });
    
    // Update checkout totals
    updateCheckoutTotals();
}

// Create checkout item element (simplified view of cart items)
function createCheckoutItemElement(item) {
    // Create checkout item container
    const checkoutItem = document.createElement('div');
    checkoutItem.className = 'checkout-item';
    
    // Create product image section with quantity badge
    const imageContainer = document.createElement('div');
    imageContainer.className = 'checkout-item-image';
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    
    const quantityBadge = document.createElement('span');
    quantityBadge.className = 'checkout-item-quantity';
    quantityBadge.textContent = item.quantity;
    
    imageContainer.appendChild(img);
    imageContainer.appendChild(quantityBadge);
    
    // Create product details section
    const details = document.createElement('div');
    details.className = 'checkout-item-details';
    
    const name = document.createElement('h4');
    name.textContent = item.name;
    
    const price = document.createElement('p');
    price.className = 'checkout-item-price';
    price.textContent = `${formatPrice(item.price)} × ${item.quantity}`;
    
    details.appendChild(name);
    details.appendChild(price);
    
    // Combine all sections into the checkout item
    checkoutItem.appendChild(imageContainer);
    checkoutItem.appendChild(details);
    
    return checkoutItem;
}

// Update checkout totals display
function updateCheckoutTotals() {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !shippingElement || !totalElement) return; // Not on checkout page
    
    // Calculate totals
    const { subtotal, shipping, total } = calculateCartTotals();
    
    // Update the display
    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
    totalElement.textContent = formatPrice(total);
}

// ==========================================
// Checkout Form Handling
// ==========================================
function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = collectFormData();
            
            // Store order information in localStorage for the confirmation page
            saveOrderToLocalStorage(formData);
            
            // Redirect to confirmation page
            window.location.href = 'confirmation.html';
        });
    }
}

// Collect data from the checkout form
function collectFormData() {
    return {
        // Personal Information
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        
        // Shipping Information
        address: document.getElementById('address').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        postcode: document.getElementById('postcode').value,
        country: document.getElementById('country').value,
        
        // Payment Information
        cardName: document.getElementById('card-name').value,
        cardNumber: document.getElementById('card-number').value,
        expiryDate: document.getElementById('expiry-date').value,
        cvv: document.getElementById('cvv').value,
        
        // Order Information
        orderDate: getCurrentDate(),
        orderNumber: generateOrderNumber()
    };
}

// Save order information to localStorage
function saveOrderToLocalStorage(formData) {
    // Get cart items and totals
    const cart = JSON.parse(localStorage.getItem('harunfitCart')) || [];
    const { subtotal, shipping, total } = calculateCartTotals();
    
    // Create order object
    const order = {
        customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
        },
        shipping: {
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country
        },
        payment: {
            cardName: formData.cardName,
            cardNumberLast4: formData.cardNumber.slice(-4), // Store only last 4 digits for security
            expiryDate: formData.expiryDate
        },
        items: cart,
        totals: {
            subtotal,
            shipping,
            total
        },
        orderDate: formData.orderDate,
        orderNumber: formData.orderNumber
    };
    
    // Save to localStorage
    localStorage.setItem('harunfitLastOrder', JSON.stringify(order));
    
    // Clear the cart (order is now placed)
    localStorage.setItem('harunfitCart', JSON.stringify([]));
}

// ==========================================
// Form Validation
// ==========================================
function initFormValidation() {
    // Card number formatting and validation
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            // Remove non-digits
            let value = e.target.value.replace(/\D/g, '');
            
            // Add spaces every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Update the input value
            e.target.value = value;
        });
    }
    
    // Expiry date formatting (MM/YY)
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            // Remove non-digits
            let value = e.target.value.replace(/\D/g, '');
            
            // Add slash after 2 digits
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            // Limit to MM/YY format
            e.target.value = value.substring(0, 5);
        });
    }
    
    // CVV must be 3 digits
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            // Remove non-digits
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
}