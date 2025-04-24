// confirmation.js - JavaScript for handling order confirmation page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize confirmation page if we're on the confirmation page
    if (document.querySelector('.confirmation-section')) {
        initConfirmationPage();
    }
});

// ==========================================
// Confirmation Page Initialization
// ==========================================
function initConfirmationPage() {
    // Get last order from localStorage
    const order = JSON.parse(localStorage.getItem('harunfitLastOrder'));
    
    // If no order, redirect to homepage
    if (!order) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display order details
    displayOrderDetails(order);
    
    // Handle digital downloads if applicable
    handleDigitalDownloads(order);
    
    // Initialize print receipt button
    initPrintButton();
}

// Display order details on confirmation page
function displayOrderDetails(order) {
    // Set order number and date
    const orderNumberElement = document.getElementById('order-number');
    const orderDateElement = document.getElementById('order-date');
    const shippingAddressElement = document.getElementById('shipping-address');
    
    if (orderNumberElement) orderNumberElement.textContent = order.orderNumber;
    if (orderDateElement) orderDateElement.textContent = order.orderDate;
    
    // Format and set shipping address
    if (shippingAddressElement) {
        const address = formatShippingAddress(order.shipping);
        shippingAddressElement.textContent = address;
    }
    
    // Display order items
    displayOrderItems(order.items);
    
    // Display order totals
    displayOrderTotals(order.totals);
}

// Format shipping address for display
function formatShippingAddress(shipping) {
    let address = `${shipping.address}`;
    
    if (shipping.address2) {
        address += `, ${shipping.address2}`;
    }
    
    address += `, ${shipping.city}, ${shipping.postcode}, ${shipping.country}`;
    
    return address;
}

// Display order items
function displayOrderItems(items) {
    const orderItemsContainer = document.getElementById('order-items');
    
    if (!orderItemsContainer) return;
    
    // Clear container
    orderItemsContainer.innerHTML = '';
    
    // Add each item to the display
    items.forEach(item => {
        const orderItemElement = createOrderItemElement(item);
        orderItemsContainer.appendChild(orderItemElement);
    });
}

// Create order item element
function createOrderItemElement(item) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    // Item details (name and quantity)
    const itemDetails = document.createElement('div');
    itemDetails.className = 'order-item-details';
    
    const quantity = document.createElement('span');
    quantity.className = 'order-item-quantity';
    quantity.textContent = `${item.quantity} x`;
    
    const name = document.createElement('span');
    name.className = 'order-item-name';
    name.textContent = item.name;
    
    itemDetails.appendChild(quantity);
    itemDetails.appendChild(name);
    
    // Item price
    const price = document.createElement('span');
    price.className = 'order-item-price';
    price.textContent = formatPrice(item.price * item.quantity);
    
    // Combine elements
    orderItem.appendChild(itemDetails);
    orderItem.appendChild(price);
    
    return orderItem;
}

// Display order totals
function displayOrderTotals(totals) {
    const subtotalElement = document.getElementById('order-subtotal');
    const shippingElement = document.getElementById('order-shipping');
    const totalElement = document.getElementById('order-total');
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(totals.subtotal);
    if (shippingElement) shippingElement.textContent = totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping);
    if (totalElement) totalElement.textContent = formatPrice(totals.total);
}

// ==========================================
// Digital Downloads Handling
// ==========================================
function handleDigitalDownloads(order) {
    // Check if order contains digital products
    const digitalProducts = order.items.filter(item => item.category === 'digital');
    
    // If no digital products, return
    if (digitalProducts.length === 0) return;
    
    // Get the digital downloads section and list
    const digitalSection = document.getElementById('digital-downloads-section');
    const digitalList = document.getElementById('digital-downloads-list');
    
    if (!digitalSection || !digitalList) return;
    
    // Show the digital downloads section
    digitalSection.style.display = 'block';
    
    // Create download links for each digital product
    digitalProducts.forEach(product => {
        const downloadItem = createDigitalDownloadItem(product);
        digitalList.appendChild(downloadItem);
    });
}

// Create digital download item element
function createDigitalDownloadItem(product) {
    const downloadItem = document.createElement('div');
    downloadItem.className = 'download-item';
    
    // Product icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-file-pdf';
    
    // Product name
    const name = document.createElement('span');
    name.className = 'download-item-name';
    name.textContent = product.name;
    
    // Download button (in a real app, this would link to actual files)
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'btn btn-secondary btn-sm';
    downloadBtn.textContent = 'Download PDF';
    downloadBtn.href = '#'; // In a real app, this would be the file URL
    downloadBtn.setAttribute('download', ''); // Make it download instead of navigate
    
    // For this mock site, make download buttons just show an alert
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Download started for ${product.name}`);
    });
    
    // Combine elements
    downloadItem.appendChild(icon);
    downloadItem.appendChild(name);
    downloadItem.appendChild(downloadBtn);
    
    return downloadItem;
}

// ==========================================
// Print Receipt Functionality
// ==========================================
function initPrintButton() {
    const printButton = document.getElementById('print-receipt');
    
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }
}