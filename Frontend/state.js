

// Global Constants
export const LOGIN_PAGE = 'login.html'; 

// User State (Loaded from localStorage)
export let userRole = localStorage.getItem('userRole');
export let userEmail = localStorage.getItem('userEmail');
export let currentView = 'dashboard';

// Status Flags
export let isLoading = false; 

// Cart & Wishlist State
export let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
export let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');

// Carousel & Offer State
export let mainCarouselSlide = 0;
export let cartOfferSlide = 0;
export const cartOffers = 2;

// Mock Data
// This is our new, empty array, ready for REAL data
export let books = [];
export const carouselImages = [
    { url: 'https://placehold.co/1200x400/1e88e5/ffffff?text=STUDENT+BONANZA%3A+Get+1+Free+Rental+on+3+Books', alt: 'Student Bonanza Offer' },
    { url: 'https://placehold.co/1200x400/ff9800/000000?text=50%25+OFF+All+Fiction+for+Freshers', alt: 'Fiction Fresher Offer' },
    { url: 'https://placehold.co/1200x400/4CAF50/ffffff?text=WEEKLY+RAFFLE%3A+Win+a+Kindle%21', alt: 'Weekly Raffle Offer' },
];

// Mutators 
export function updateCart(newItems) {
    cartItems = newItems;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
export function updateWishlist(newItems) {
    wishlistItems = newItems;
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}
export function updateCurrentView(newView) {
    currentView = newView;
}
export function updateCarouselSlide(index) {
    mainCarouselSlide = index;
}
export function updateCartOffer(index) {
    cartOfferSlide = index;
}
export function updateLoadingStatus(status) { 
    isLoading = status;
}
// ADD THIS FUNCTION
export function updateBooks(newBooks) {
     books = newBooks;
}