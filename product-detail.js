// product-detail.js - JavaScript for handling product detail page functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // If no product ID or invalid, redirect to products page
    if (!productId || isNaN(productId)) {
        window.location.href = 'products.html';
        return;
    }
    
    // Find the product in product data
    const product = window.productsData.find(p => p.id === productId);
    
    // If product not found, redirect to products page
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    // Display product details
    displayProductDetails(product);
    
    // Initialize size selection (for clothing)
    if (product.category === 'clothing' && product.sizes) {
        initSizeSelection(product.sizes);
    } else {
        // Hide size container for non-clothing products
        document.getElementById('product-size-container').style.display = 'none';
    }
    
    // Initialize add to cart button
    initAddToCartButton(product);
});

// Display product details on the page
function displayProductDetails(product) {
    // Set page title
    document.title = `${product.name} - HARUNFIT`;
    
    // Update breadcrumb
    document.getElementById('product-category-breadcrumb').textContent = capitalizeFirstLetter(product.category);
    document.getElementById('product-name-breadcrumb').textContent = product.name;
    
    // Update product image
    const productImage = document.getElementById('product-detail-img');
    productImage.src = product.image;
    productImage.alt = product.name;
    
    // Update product info
    document.getElementById('product-detail-name').textContent = product.name;
    document.getElementById('product-detail-category').textContent = capitalizeFirstLetter(product.category);
    document.getElementById('product-detail-price').textContent = formatPrice(product.price);
    document.getElementById('product-detail-description').textContent = product.description;
    
    // Update meta info
    document.getElementById('product-sku').textContent = `HF-${product.id < 10 ? '0' + product.id : product.id}`;
    document.getElementById('product-category-meta').textContent = capitalizeFirstLetter(product.category);
}

// Initialize size selection for clothing products
function initSizeSelection(sizes) {
    const sizeOptionsContainer = document.getElementById('size-options');
    sizeOptionsContainer.innerHTML = '';
    
    // Create size options
    sizes.forEach(size => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'size-option';
        sizeOption.textContent = size;
        sizeOption.setAttribute('data-size', size);
        
        // Add click event to select size
        sizeOption.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.size-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            sizeOption.classList.add('selected');
        });
        
        sizeOptionsContainer.appendChild(sizeOption);
    });
    
    // Select the first size by default
    if (sizes.length > 0) {
        sizeOptionsContainer.querySelector('.size-option').classList.add('selected');
    }
}

// Initialize add to cart button
function initAddToCartButton(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', () => {
        // For clothing products, get selected size
        let selectedSize = null;
        if (product.category === 'clothing' && product.sizes) {
            const selectedSizeElement = document.querySelector('.size-option.selected');
            if (selectedSizeElement) {
                selectedSize = selectedSizeElement.getAttribute('data-size');
            } else {
                alert('Please select a size');
                return;
            }
        }
        
        // Create product object to add to cart
        const productToAdd = {
            ...product,
            quantity: 1
        };
        
        // Add selected size for clothing
        if (selectedSize) {
            productToAdd.selectedSize = selectedSize;
        }
        
        // Add to cart
        addToCart(productToAdd);
        
        // Show feedback
        addToCartBtn.textContent = 'Added to Cart!';
        addToCartBtn.classList.add('added');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.classList.remove('added');
        }, 2000);
        
        // Update cart count
        updateCartCount();
    });
}

// Helper function to capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}