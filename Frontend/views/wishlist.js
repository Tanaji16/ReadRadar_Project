

import * as State from '../state.js';

export function getWishlistHtml() {
    return `
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your Wishlist (${State.wishlistItems.length} Items)</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Books you've saved for later. Click 'Add to Bag' to borrow or purchase.
            </p>

            <button onclick="navigate('explore')" class="mb-6 px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-150 transform hover:scale-105 shadow-md">
                < Back to Explore
            </button>
            
            ${State.wishlistItems.length === 0 ? `
                <div class="text-center p-16 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-xl mt-10">
                    <svg class="w-20 h-20 mx-auto text-red-500/50 dark:text-red-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <p class="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-4">Your Wishlist is Empty!</p>
                    <p class="text-md text-gray-500 dark:text-gray-400 mt-2">Start exploring books to add them here.</p>
                    <button onclick="navigate('explore')" class="mt-6 px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-lg">
                        Browse Catalog Now
                    </button>
                </div>
            ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    ${State.wishlistItems.map(book => `
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex space-x-4 transition duration-200 hover:shadow-xl border-l-4 border-purple-500">
                            <img src="${book.img}" alt="${book.title}" class="w-16 h-24 object-cover rounded shadow">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-gray-800 dark:text-gray-100">${book.title}</h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">By ${book.author}</p>
                                <div class="flex space-x-2 items-center">
                                    <span class="text-lg font-bold text-red-600 dark:text-red-400">\u20B9${book.price}</span>
                                    <span class="text-sm strikethrough">\u20B9${book.originalPrice}</span>
                                </div>
                            </div>
                            <div class="flex flex-col space-y-2 justify-between">
                                <button onclick="removeItemFromWishlist(${book.id})" class="text-red-500 hover:text-red-700 p-1 transition transform hover:scale-110">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <button onclick="addItemToCartFromWishlist(${book.id})" class="text-sm py-1 px-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md">
                                    Add to Bag
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}