// script.js - Main JavaScript for HARUNFIT website
// This script contains common functionality used across multiple pages

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Update cart count in the header
    updateCartCount();
    
    // Handle newsletter subscription
    initNewsletterForm();
});

// ==========================================
// Mobile Menu Functionality
// ==========================================
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // If mobile menu button exists, add click event listener
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle the 'active' class on nav-links to show/hide the mobile menu
            navLinks.classList.toggle('active');
            
            // Toggle the icon between bars and X
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navLinks && navLinks.classList.contains('active')) {
            // Check if click is outside the nav links and mobile menu button
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                
                // Reset icon to bars
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// ==========================================
// Cart Count Update
// ==========================================
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('harunfitCart')) || [];
        
        // Calculate total quantity of items in cart
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // Update the cart count display
        cartCountElement.textContent = totalQuantity;
        
        // If cart is empty, hide the count badge
        if (totalQuantity === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'inline-block';
        }
    }
}

// ==========================================
// Helper Functions 
// ==========================================

// Format price as currency (£XX.XX)
function formatPrice(price) {
    return `£${parseFloat(price).toFixed(2)}`;
}

// Generate a random order number (for demo purposes)
function generateOrderNumber() {
    const prefix = 'HF-';
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5 digit number
    return prefix + randomNumber;
}

// Get current date formatted as string
function getCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-GB', options);
}

// Format full address from form inputs
function formatAddress(formData) {
    let address = formData.address;
    
    // Add apartment/suite if provided
    if (formData.address2) {
        address += `, ${formData.address2}`;
    }
    
    // Add city, postcode, country
    address += `, ${formData.city}, ${formData.postcode}, ${formData.country}`;
    
    return address;
}

// ==========================================
// Newsletter Form Functionality
// ==========================================
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get the email input value
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Store the email in localStorage (in a real site, this would be sent to a server)
                const subscribers = JSON.parse(localStorage.getItem('harunfitSubscribers')) || [];
                
                // Check if email already exists
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('harunfitSubscribers', JSON.stringify(subscribers));
                    
                    // Show success message
                    alert('Thank you for subscribing to our newsletter!');
                    
                    // Clear the input field
                    emailInput.value = '';
                } else {
                    // Email already subscribed
                    alert('This email is already subscribed to our newsletter.');
                }
            }
        });
    }
}

// ==========================================
// Product Data - all 10 products as specified in the requirements
// ==========================================
// This data is used across multiple pages, so we define it in the main script
const productsData = [
    // Category 1: Clothing (4 products)
    {
        id: 1,
        name: "HARUNFIT T-shirt",
        price: 24.99,
        category: "clothing",
        image: "images/products/tshirt.png",
        description: "Comfortable, breathable fabric perfect for workouts or casual wear. Available in black.",
        sizes: ["S", "M", "L"],
        hasDetailView: true
    },
    {
        id: 2,
        name: "HARUNFIT Hoodie",
        price: 49.99,
        category: "clothing",
        image: "images/products/hoodie.png",
        description: "Stay warm before and after your workouts with our premium cotton-blend hoodie. Available in white.",
        sizes: ["S", "M", "L"],
        hasDetailView: true
    },
    {
        id: 3,
        name: "HARUNFIT Tracksuit Bottoms",
        price: 39.99,
        category: "clothing",
        image: "images/products/tracksuit.png",
        description: "Lightweight, flexible tracksuit bottoms with stylish design accents. Perfect for training or recovery.",
        sizes: ["S", "M", "L"],
        hasDetailView: true
    },
    {
        id: 4,
        name: "HARUNFIT Vest",
        price: 19.99,
        category: "clothing",
        image: "images/products/vest.png",
        description: "Sleeveless training vest made from moisture-wicking fabric to keep you cool during intense workouts.",
        sizes: ["S", "M", "L"],
        hasDetailView: true
    },
    
    // Category 2: Digital Products (3 products)
    {
        id: 5,
        name: "Complete Training Program",
        price: 29.99,
        category: "digital",
        image: "images/products/training-program.png",
        description: "12-week progressive training program for muscle building and strength. Includes detailed workout schedules and exercise guides. (PDF download)"
    },
    {
        id: 6,
        name: "Complete Nutrition eBook",
        price: 19.99,
        category: "digital",
        image: "images/products/nutrition-ebook.png",
        description: "Comprehensive nutrition guide for fat loss and muscle building, with meal plans and recipes. (PDF download)"
    },
    {
        id: 7,
        name: "Home Workout Plan",
        price: 14.99,
        category: "digital",
        image: "images/products/home-workout.png",
        description: "No-equipment home workout program with video demonstrations and progressive routines. (PDF download)"
    },
    
    // Category 3: Supplements (3 products)
    {
        id: 8,
        name: "Creatine Monohydrate",
        price: 24.99,
        category: "supplements",
        image: "images/products/creatine.png",
        description: "Premium quality creatine monohydrate to enhance strength and power. 500g container, 100 servings."
    },
    {
        id: 9,
        name: "Whey Protein Powder",
        price: 39.99,
        category: "supplements",
        image: "images/products/protein.png",
        description: "High-quality whey protein with 24g protein per serving. Available in chocolate and vanilla flavors. 1kg container."
    },
    {
        id: 10,
        name: "Protein Bars (Box of 12)",
        price: 29.99,
        category: "supplements",
        image: "images/products/protein-bars.png",
        description: "Delicious protein bars with 20g protein and only 2g sugar per bar. Perfect for on-the-go nutrition."
    }
];

// Make productsData available globally so it can be accessed by other scripts
window.productsData = productsData;