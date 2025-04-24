// products.js - JavaScript for handling product display, filtering and sorting

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize products page if we're on the products page
    if (document.querySelector('.products-grid')) {
        initProductsPage();
    }
    
    // Initialize featured products on homepage if they exist
    if (document.querySelector('.products-slider')) {
        initFeaturedProducts();
    }
});

// ==========================================
// Products Page Initialization
// ==========================================
function initProductsPage() {
    // Get reference to product container
    const productsContainer = document.getElementById('products-container');
    
    // Check URL parameters for pre-selected category
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Display all products initially (or filtered by URL parameter)
    displayProducts(categoryParam || 'all');
    
    // Initialize category filter buttons
    initCategoryFilters(categoryParam);
    
    // Initialize sorting functionality
    initSorting();
}

// ==========================================
// Display Products Functions
// ==========================================
function displayProducts(category = 'all', sortOption = 'default') {
    // Get reference to product container
    const productsContainer = document.getElementById('products-container');
    const noProductsMessage = document.getElementById('no-products-message');
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    // Filter products by category (if not 'all')
    let filteredProducts = [...window.productsData];
    if (category !== 'all') {
        filteredProducts = window.productsData.filter(product => product.category === category);
    }
    
    // Sort products based on selected option
    sortProducts(filteredProducts, sortOption);
    
    // Show or hide "no products" message
    if (filteredProducts.length === 0) {
        if (noProductsMessage) {
            noProductsMessage.style.display = 'block';
        }
        return;
    } else if (noProductsMessage) {
        noProductsMessage.style.display = 'none';
    }
    
    // Create and append product cards
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Initialize "Add to Cart" buttons
    initAddToCartButtons();
}

// Create a product card element
function createProductCard(product) {
    // Create product card container
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    productCard.setAttribute('data-id', product.id);
    
    // Add has-detail attribute if the product has detail view
    if (product.hasDetailView) {
        productCard.setAttribute('data-has-detail', 'true');
    }
    
    // Create product image section
    const productImage = document.createElement('div');
    productImage.className = 'product-image';
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    
    productImage.appendChild(img);
    
    // Create product details section
    const productDetails = document.createElement('div');
    productDetails.className = 'product-details';
    
    // Product name
    const productName = document.createElement('h3');
    productName.textContent = product.name;
    
    // Product category
    const productCategory = document.createElement('p');
    productCategory.className = 'product-category';
    productCategory.textContent = capitalizeFirstLetter(product.category);
    
    // Product description
    const productDescription = document.createElement('p');
    productDescription.className = 'product-description';
    productDescription.textContent = product.description;
    
    // Product price
    const productPrice = document.createElement('p');
    productPrice.className = 'product-price';
    productPrice.textContent = formatPrice(product.price);
    
    // Add to cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn btn-add-cart';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.setAttribute('data-id', product.id);
    
    // Append all elements to the product details
    productDetails.appendChild(productName);
    productDetails.appendChild(productCategory);
    productDetails.appendChild(productDescription);
    productDetails.appendChild(productPrice);
    productDetails.appendChild(addToCartBtn);
    
    // Combine all sections into the product card
    productCard.appendChild(productImage);
    productCard.appendChild(productDetails);
    
    // Add click event to view product detail (if applicable)
    if (product.hasDetailView) {
        // Make the entire card clickable except the add to cart button
        productCard.addEventListener('click', (e) => {
            // Don't trigger if clicking on the add to cart button
            if (!e.target.classList.contains('btn-add-cart')) {
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
    }
    
    return productCard;
}

// ==========================================
// Category Filtering
// ==========================================
function initCategoryFilters(preSelectedCategory = null) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Set pre-selected category button as active if provided
    if (preSelectedCategory) {
        filterButtons.forEach(button => {
            if (button.getAttribute('data-category') === preSelectedCategory) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Add click event listeners to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get selected category
            const selectedCategory = button.getAttribute('data-category');
            
            // Update URL parameter without page refresh
            const url = new URL(window.location.href);
            if (selectedCategory === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', selectedCategory);
            }
            window.history.replaceState({}, '', url);
            
            // Display products for selected category
            const sortOption = document.getElementById('sort-select').value;
            displayProducts(selectedCategory, sortOption);
        });
    });
    
    // Initialize reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            // Set 'All Products' button as active
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-category') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Reset sorting to default
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) {
                sortSelect.value = 'default';
            }
            
            // Remove URL parameters
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, '', url);
            
            // Display all products
            displayProducts('all', 'default');
        });
    }
}

// ==========================================
// Sorting Functions
// ==========================================
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            // Get current active category
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
            
            // Get selected sort option
            const sortOption = sortSelect.value;
            
            // Display products with current filters and new sorting
            displayProducts(activeCategory, sortOption);
        });
    }
}

// Sort products based on selected option
function sortProducts(products, sortOption) {
    switch (sortOption) {
        case 'price-low':
            // Sort by price low to high
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            // Sort by price high to low
            products.sort((a, b) => b.price - a.price);
            break;
        default:
            // Default sorting (by ID/featured status)
            products.sort((a, b) => a.id - b.id);
            break;
    }
    
    return products;
}

// ==========================================
// Featured Products on Homepage
// ==========================================
function initFeaturedProducts() {
    const productsSlider = document.querySelector('.products-slider');
    
    if (productsSlider) {
        // Clear existing content
        productsSlider.innerHTML = '';
        
        // Select 4 featured products (for example, the first product from each category and one more)
        const featuredProductIds = [1, 2, 5, 9]; // You can change these IDs as needed
        
        const featuredProducts = window.productsData.filter(product => 
            featuredProductIds.includes(product.id)
        );
        
        // Create and append product cards for featured products
        featuredProducts.forEach(product => {
            const productCard = createSimpleProductCard(product);
            productsSlider.appendChild(productCard);
        });
        
        // Initialize "Add to Cart" buttons
        initAddToCartButtons();
    }
}

// Create a simplified product card for homepage
function createSimpleProductCard(product) {
    // Create product card container
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-id', product.id);
    
    // Create product image section
    const productImage = document.createElement('div');
    productImage.className = 'product-image';
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    
    productImage.appendChild(img);
    
    // Create product details section (simplified for homepage)
    const productDetails = document.createElement('div');
    productDetails.className = 'product-details';
    
    // Product name
    const productName = document.createElement('h3');
    productName.textContent = product.name;
    
    // Product price
    const productPrice = document.createElement('p');
    productPrice.className = 'product-price';
    productPrice.textContent = formatPrice(product.price);
    
    // Add to cart button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn btn-add-cart';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.setAttribute('data-id', product.id);
    
    // Append all elements to the product details
    productDetails.appendChild(productName);
    productDetails.appendChild(productPrice);
    productDetails.appendChild(addToCartBtn);
    
    // Combine all sections into the product card
    productCard.appendChild(productImage);
    productCard.appendChild(productDetails);
    
    return productCard;
}

// ==========================================
// Add to Cart Functionality
// ==========================================
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the product ID from the button attribute
            const productId = parseInt(button.getAttribute('data-id'));
            
            // Find the product in the products data
            const product = window.productsData.find(p => p.id === productId);
            
            if (product) {
                // Add to cart (function from cart.js)
                addToCart(product);
                
                // Show feedback to user
                showAddToCartFeedback(button);
                
                // Update cart count in header
                updateCartCount();
            }
        });
    });
}

// Show feedback when product is added to cart
function showAddToCartFeedback(button) {
    // Store original button text
    const originalText = button.textContent;
    
    // Change button text and add a success class
    button.textContent = 'Added to Cart!';
    button.classList.add('added');
    
    // Reset button after 2 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('added');
    }, 2000);
}

// ==========================================
// Helper Functions
// ==========================================
// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}