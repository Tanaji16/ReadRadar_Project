

import * as State from '../state.js';
import { apiFetchBooks } from '../api.js'; 
import { updateCartOfferCarousel } from '../app.js';

let exploreBooks = State.books; 

function renderBookGrid() {
    const grid = document.getElementById('book-grid');
    if (!grid) return;
    
    if (State.isLoading) {
        grid.innerHTML = '<div class="text-center col-span-full py-12 text-lg text-primary-blue dark:text-blue-400">Loading books...</div>';
        return;
    }

    grid.innerHTML = exploreBooks.map(book => `
        <div class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center 
             transition duration-300 hover:shadow-2xl dark:hover:shadow-2xl hover:border-primary-blue/50 dark:hover:border-blue-400/50 
             transform hover:scale-[1.03] border-t-4 border-transparent relative">

            <div class="absolute top-0 left-0 right-0 p-2 text-center rounded-t-xl bg-primary-blue/90 dark:bg-primary-blue/90 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                ${book.title}
            </div>

            <img src="${book.img}" alt="${book.title}" 
                 class="w-full h-48 object-cover rounded-lg mb-4 shadow-xl group-hover:shadow-2xl transition duration-300"
                 style="aspect-ratio: 2/3;">

            <div class="flex flex-col items-center w-full">
                <h4 class="text-lg font-extrabold text-gray-900 dark:text-gray-100 text-center line-clamp-2 mt-[-10px]">${book.title}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center italic">${book.author}</p>

                <div class="flex items-center space-x-2 mb-4">
                    <span class="text-xl font-bold text-red-600 dark:text-red-400">\u20B9${book.price}</span>
                    <span class="text-sm strikethrough">\u20B9${book.originalPrice}</span>
                    <span class="text-xs font-semibold text-success-green">(50% OFF)</span>
                </div>

                <div class="flex space-x-2 w-full">
                    <button onclick="addItemToWishlist(${book.id})" 
                            class="flex-1 py-2 text-sm font-semibold rounded-lg transition duration-150 
                                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                   hover:bg-accent-orange/10 hover:text-accent-orange hover:shadow-md">
                        Wishlist
                    </button>
                    <button onclick="addItemToCart(${book.id})" 
                            class="flex-1 py-2 text-sm font-semibold rounded-lg transition duration-150 
                                   bg-accent-orange text-white hover:bg-orange-600 hover:shadow-lg 
                                   transform hover:scale-[1.05]">
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCarouselDisplay() {
    const slidesContainer = document.getElementById('carousel-slides');
    const dots = document.getElementById('carousel-dots').children;
    if (slidesContainer) slidesContainer.style.transform = `translateX(-${State.mainCarouselSlide * 100}%)`;

    Array.from(dots).forEach((dot, index) => {
        dot.classList.toggle('bg-primary-blue', index === State.mainCarouselSlide);
        dot.classList.toggle('dark:bg-blue-400', index === State.mainCarouselSlide);
        dot.classList.toggle('bg-gray-300', index !== State.mainCarouselSlide);
        dot.classList.toggle('dark:bg-gray-600', index !== State.mainCarouselSlide);
    });
}

function renderMainCarousel() {
    const slidesContainer = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!slidesContainer || !dotsContainer) return;
    
    slidesContainer.innerHTML = State.carouselImages.map((img, index) => `
        <div class="carousel-slide">
            <img src="${img.url}" alt="${img.alt}" class="w-full h-auto rounded-xl object-cover">
        </div>
    `).join('');

    dotsContainer.innerHTML = State.carouselImages.map((_, index) => `
        <button class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300" 
                onclick="goToSlide(${index})"></button>
    `).join('');

    updateCarouselDisplay();
}

function nextSlide() {
    const next = (State.mainCarouselSlide + 1) % State.carouselImages.length;
    State.updateCarouselSlide(next);
    updateCarouselDisplay();
}


export async function initializeExploreView() {
    renderMainCarousel();
    window.App.updateCartOfferCarousel();
    
    State.updateLoadingStatus(true);
    renderBookGrid();

    exploreBooks = await apiFetchBooks(); 
    
    State.updateLoadingStatus(false);
    renderBookGrid();

    window.mainCarouselInterval = setInterval(nextSlide, 5000); 
    window.cartOfferInterval = setInterval(window.App.nextCartOfferSlide, 7000);
}

export function getExploreHtml() {
    return `
        <div class="bg-black text-white text-center overflow-hidden py-2 text-sm marquee-container">
            <div id="marquee-text" class="marquee-content font-medium">
                <span class="text-accent-orange mr-16">🔥 LIMITED TIME: FREE RENEWAL PERIOD EXTENSION! 🔥</span>
                <span class="text-primary-blue">📚 COLLEGE LIBRARY NOTICE: New resources added daily! 📚</span>
            </div>
        </div>

        <div class="sticky top-0 z-30 p-4 md:p-6 flex items-center bg-white dark:bg-gray-800 shadow-md transition-colors duration-300 -mx-8 -mt-8 mb-8">
            <button onclick="navigate('dashboard')" class="p-2 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition mr-4 hover:scale-110">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div class="flex-grow max-w-xl">
                <div class="relative">
                    <input type="text" placeholder="Search for books, authors, or subjects..." class="w-full p-2 pl-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-700 dark:text-gray-100">
                    <button class="absolute right-0 top-0 mt-2 mr-3 text-gray-500 dark:text-gray-400">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>
            <button id="profile-button" onclick="toggleProfilePanel()" class="relative p-2 ml-4 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 hover:scale-110" aria-label="Toggle profile menu">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <button id="cart-button" onclick="toggleCartPanel()" class="relative p-2 ml-4 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 hover:scale-110">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span id="cart-count" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">${State.cartItems.length}</span>
            </button>
        </div>

        <div id="main-carousel" class="carousel-container rounded-xl shadow-xl mb-12">
            <div class="carousel-slides" id="carousel-slides"></div>
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" id="carousel-dots"></div>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Best Sellers: Limited Time 50% Offer!</h2>
        
        <div id="book-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"></div>
        
        <div class="text-center mt-12">
            <button class="px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg">
                Load More Books
            </button>
        </div>
    `;
}