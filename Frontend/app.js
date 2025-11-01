import * as State from './state.js';
import { renderView } from './router.js';
import { apiSendOtp, apiPlaceOrder } from './api.js';

const SPINNER_ICON = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

// --- 1. ALL FUNCTIONS ARE DEFINED FIRST ---

function init() {
    // This runs after the page loads
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    // Bind header buttons
    document.getElementById('nav-home').addEventListener('click', () => navigate('dashboard'));
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Fetch books from our secure backend
    fetchBooks(); 
    
    // Render the initial view
    renderView('dashboard'); 
}

export function navigate(viewName) {
    if (window.mainCarouselInterval) clearInterval(window.mainCarouselInterval);
    if (window.cartOfferInterval) clearInterval(window.cartOfferInterval);
    
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel && !cartPanel.classList.contains('translate-x-full')) toggleCartPanel();
    const profilePanel = document.getElementById('profile-panel');
    if (profilePanel && !profilePanel.classList.contains('translate-x-full')) toggleProfilePanel();
    
    State.updateCurrentView(viewName);
    renderView(viewName);
}

export function logout() {
    console.log("Logging out...");
    
    // This is the correct, secure logout
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('wishlistItems');

    try {
        window.location.assign(State.LOGIN_PAGE);
    } catch (e) {
        console.error("Logout redirect failed:", e);
        window.location.assign('/'); 
    }
}

export function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

export function showMessage(message) {
    document.getElementById('message-text').innerText = message;
    document.getElementById('message-box').classList.remove('hidden');
    document.getElementById('message-box').classList.add('flex');
}

export function hideMessage() {
    document.getElementById('message-box').classList.add('hidden');
    document.getElementById('message-box').classList.remove('flex');
}

export function toggleCartPanel() {
    const panel = document.getElementById('cart-panel');
    if (!panel) return;
    panel.classList.toggle('translate-x-full');
    
    if (!panel.classList.contains('translate-x-full')) {
        renderCart();
    }
}

export function openCartPanel() {
    const panel = document.getElementById('cart-panel');
    if (panel) {
        panel.classList.remove('translate-x-full');
        renderCart();
    }
}

export function toggleProfilePanel() {
    const panel = document.getElementById('profile-panel');
    if (!panel) return;
    panel.classList.toggle('translate-x-full');
    
    if (!panel.classList.contains('translate-x-full')) {
        renderProfilePanel();
    }
}

export function renderProfilePanel() {
    const container = document.getElementById('profile-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                <h3 class="text-2xl font-bold text-primary-blue dark:text-blue-400">My Account</h3>
                <button onclick="toggleProfilePanel()" class="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p class="text-xl font-bold text-gray-800 dark:text-gray-100">Hello, ${State.userEmail}!</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">${State.userRole}</p>
            </div>

            <nav class="space-y-2 text-gray-800 dark:text-gray-100">
                <a href="#" onclick="navigate('orders'); toggleProfilePanel();" class="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Orders</a>
                <a href="#" onclick="navigate('history'); toggleProfilePanel();" class="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Borrowing History</a>
                <a href="#" onclick="navigate('holds'); toggleProfilePanel();" class="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Book Holds</a>
                <a href="#" onclick="navigate('wishlist'); toggleProfilePanel();" class="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Wishlist</a>
                <a href="#" onclick="showMessage('Viewing Gift Cards...')" class="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Gift Cards</a>
                <a href="#" onclick="showMessage('Viewing Coupon Cards...')" class="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Coupon Cards</a>
                <a href="#" onclick="navigate('profile'); toggleProfilePanel();" class="block py-2 px-3 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Edit Profile</a>
                <a href="#" onclick="logout()" class="block py-2 px-3 text-red-500 hover:text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Logout</a>
            </nav>
        </div>
    `;
}

export function calculateSubtotal() {
    const total = State.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotalElement = document.getElementById('cart-subtotal');
    const countElement = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    const emptyMessage = document.getElementById('empty-cart-message');

    if (subtotalElement) subtotalElement.innerText = `\u20B9${total}`;
    if (countElement) countElement.innerText = State.cartItems.length;
    if (checkoutButton) checkoutButton.disabled = State.cartItems.length === 0 || State.isLoading; 
    if (emptyMessage) emptyMessage.classList.toggle('hidden', State.cartItems.length > 0);
}

export function renderCart() {
    const panelContainer = document.getElementById('cart-panel');
    if (!panelContainer) return; 

    const total = State.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    panelContainer.innerHTML = `
        <div class="flex flex-col h-full">
            <div class="p-6 pb-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Bag</h3>
                <button onclick="toggleCartPanel()" class="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition transform hover:scale-110">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div id="cart-offer-carousel" class="w-full h-24 bg-gray-100 dark:bg-gray-700 overflow-hidden mb-4 relative flex-shrink-0">
                <div class="flex h-full transition-transform duration-500 ease-in-out" id="cart-offer-slides">
                    <div class="flex-shrink-0 w-full p-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                        <svg class="w-6 h-6 mr-2 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 14v.01M15 14v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span class="font-semibold">Exciting brand offers on prepaid!</span>
                        <button class="px-3 py-1 bg-black text-white rounded-md text-xs hover:bg-gray-700 transition transform hover:scale-[1.02]">VIEW ></button>
                    </div>
                    <div class="flex-shrink-0 w-full p-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                        <svg class="w-6 h-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.228C11.371 1.77 12.01 1.77 12.332 2.228l.583.821c.21.296.545.497.915.553l.89.127c.48.068.748.6.438 1.03l-.68.91c-.19.255-.306.577-.306.915v.987c0 .415.166.81.438 1.135l.821.583c.458.322.458.961 0 1.283l-.821.583c-.272.193-.438.583-.438.998v.987c0 .338-.116.66-.306.915l-.68.91c-.31.438-.042.977.438 1.03l.89.127c.37.056.705.257.915.553l.583.821c.322.458.961.458 1.283 0l.583-.821c.21-.296.545-.497.915-.553l.89-.127c.48-.068.748-.6.438-1.03l-.68-.91c-.19-.255-.306-.577-.306-.915V13.04c0-.415.166-.81.438-1.135l.821-.583c.458-.322.458-.961 0-1.283l-.821-.583c-.272-.193-.438-.583-.438-.998V8.95c0-.338-.116.66-.306.915l-.68-.91c-.31-.438-.042-.977.438-1.03l.89-.127c-.37-.056-.705-.257-.915-.553l-.583-.821c-.322-.458-.322-.458 0 0z" /></svg>
                        <span class="font-semibold">Get brand gift cards up to $\text{\textcurrency}400$!</span>
                        <button class="px-3 py-1 bg-black text-white rounded-md text-xs hover:bg-gray-700 transition transform hover:scale-[1.02]">VIEW ></button>
                    </div>
                </div>
            </div>

            <div id="cart-items-container" class="flex-grow space-y-3 px-6 overflow-y-auto">
                <p id="empty-cart-message" class="text-center text-gray-500 dark:text-gray-400 mt-10 hidden">Your bag is empty. Start exploring!</p>
                ${State.cartItems.length === 0 ? '' : 
                    State.cartItems.map(item => `
                        <div class="flex items-center space-x-4 pt-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <img src="${item.img}" alt="${item.title}" class="w-16 h-20 object-cover rounded shadow-md">
                            <div class="flex-grow">
                                <h4 class="font-bold text-gray-800 dark:text-gray-100 truncate">${item.title}</h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">By ${item.author}</p>
                                
                                <div class="flex items-center space-x-3 mt-2">
                                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                        <button onclick="updateCartQuantity(${item.id}, -1)" class="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l transition transform hover:scale-110">-</button>
                                        <span class="px-3 text-sm text-gray-800 dark:text-gray-100">${item.quantity}</span>
                                        <button onclick="updateCartQuantity(${item.id}, 1)" class="p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r transition transform hover:scale-110">+</button>
                                    </div>
                                    
                                    <button onclick="removeItemFromCart(${item.id})" class="text-red-500 hover:text-red-700 transition transform hover:scale-110 ml-2" title="Remove Item">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="text-right flex-shrink-0">
                                <span class="text-lg font-bold text-primary-blue dark:text-blue-400">\u20B9${item.price * item.quantity}</span>
                                <p class="text-xs text-gray-500 dark:text-gray-400 line-through">\u20B9${item.originalPrice * item.quantity}</p>
                            </div>
                        </div>
                    `).join('')}
            </div>

            <div class="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <div class="flex justify-between font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">
                    <span>Subtotal</span>
                    <span id="cart-subtotal">\u20B9${total}</span>
                </div>
                <button 
                    onclick="openMobileOtpModal()"
                    id="checkout-button"
                    class="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-700 transition duration-300 disabled:opacity-50 transform hover:scale-[1.01]"
                    disabled
                >
                    Checkout
                </button>
                <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Or continue browsing</p>
            </div>
        </div>
    `;
    updateCartOfferCarousel();
    calculateSubtotal();
    
    // Ensure the empty message visibility is correctly set after innerHTML assignment
    const emptyMessage = document.getElementById('empty-cart-message');
    if (emptyMessage) emptyMessage.classList.toggle('hidden', State.cartItems.length > 0);
}

export function addItemToCart(bookId) {
    const book = State.books.find(b => b.id === bookId);
    if (!book) {
        console.error("Book not found:", bookId);
        return;
    }
    const existingItem = State.cartItems.find(item => item.id === bookId);
    let newCart;

    if (existingItem) {
        newCart = State.cartItems.map(item => item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
        newCart = [...State.cartItems, { ...book, quantity: 1 }];
    }
    State.updateCart(newCart);
    renderCart();
    openCartPanel();
}

export function updateCartQuantity(bookId, delta) {
    let newCart = State.cartItems.map(item => item.id === bookId ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0);
    State.updateCart(newCart);
    renderCart();
}

export function removeItemFromCart(bookId) {
    const newCart = State.cartItems.filter(item => item.id !== bookId);
    State.updateCart(newCart);
    renderCart();
}

export function addItemToWishlist(bookId) {
    const book = State.books.find(b => b.id === bookId);
     if (!book) {
        console.error("Book not found:", bookId);
        return;
    }
    const existingItem = State.wishlistItems.find(item => item.id === bookId);

    if (!existingItem) {
        const newWishlist = [...State.wishlistItems, book];
        State.updateWishlist(newWishlist);
        showMessage(`"${book.title}" added to your Wishlist!`);
    } else {
        showMessage(`"${book.title}" is already in your Wishlist.`);
    }
}

export function removeItemFromWishlist(bookId) {
    const bookTitle = State.wishlistItems.find(item => item.id === bookId)?.title || "Item";
    const newWishlist = State.wishlistItems.filter(item => item.id !== bookId);
    State.updateWishlist(newWishlist);
    showMessage(`${bookTitle} removed from Wishlist.`);
    if (State.currentView === 'wishlist') { navigate('wishlist'); }
}

export function addItemToCartFromWishlist(bookId) {
    const book = State.wishlistItems.find(item => item.id === bookId);
    if (book) {
        addItemToCart(bookId);
        removeItemFromWishlist(bookId);
    }
}

export function openMobileOtpModal() {
    if (State.cartItems.length === 0) return;
    window.App.toggleCartPanel();
    
    const total = State.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const summaryHtml = State.cartItems.map(item => `
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>${item.title} (x${item.quantity})</span>
            <span>\u20B9${item.price * item.quantity}.00</span>
        </div>
    `).join('');
    
    document.getElementById('order-summary-content').innerHTML = `
        <div class="border-b border-gray-100 dark:border-gray-700 pb-2 mb-2">
            ${summaryHtml}
        </div>
        <div class="flex justify-between font-bold text-lg text-gray-800 dark:text-gray-100">
            <span>Total</span>
            <span>\u20B9${total}.00</span>
        </div>
    `;
    document.getElementById('checkout-item-count').innerText = State.cartItems.length;

    document.getElementById('mobile-otp-modal').classList.add('flex');
    document.getElementById('mobile-otp-modal').classList.remove('hidden');
    
    document.getElementById('otp-input-area').classList.add('hidden');
    document.getElementById('otp-send-button').innerText = 'Next';
    document.getElementById('otp-send-button').disabled = false;
    document.getElementById('mobile-input').value = '';
}

export function closeMobileOtpModal() {
    document.getElementById('mobile-otp-modal').classList.add('hidden');
    document.getElementById('mobile-otp-modal').classList.remove('flex');
}

export async function simulateOtpSend() {
    if (State.isLoading) return;

    const mobileInput = document.getElementById('mobile-input');
    const sendButton = document.getElementById('otp-send-button');
    const mobile = mobileInput.value.trim();
    
    if (mobile.length !== 10 || isNaN(mobile)) {
        showMessage('Please enter a valid 10-digit mobile number.'); 
        return;
    }
    
    State.updateLoadingStatus(true);
    sendButton.innerHTML = `${SPINNER_ICON} Sending...`;
    sendButton.classList.add('flex', 'items-center', 'justify-center');
    sendButton.disabled = true;

    const response = await apiSendOtp(mobile);
    
    State.updateLoadingStatus(false);
    sendButton.innerHTML = 'Resend OTP';
    sendButton.classList.remove('flex', 'items-center', 'justify-center');
    sendButton.disabled = false;

    if (response.success) {
        document.getElementById('otp-target-mobile').innerText = mobile;
        document.getElementById('otp-input-area').classList.remove('hidden');
        showMessage(response.message);
    } else {
        showMessage(response.message);
    }
}

export async function verifyOtp() {
    if (State.isLoading) return;

    const otpInput = document.getElementById('otp-input');
    const mobileInput = document.getElementById('mobile-input');
    const verifyButton = document.querySelector('#otp-input-area button');

    if (otpInput.value !== '1234') { 
        showMessage('Invalid OTP. Please try again. (Hint: Use 1234)');
        return;
    }
    
    State.updateLoadingStatus(true);
    verifyButton.innerHTML = `${SPINNER_ICON} Verifying...`;
    verifyButton.classList.add('flex', 'items-center', 'justify-center');
    verifyButton.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 500)); 

    State.updateLoadingStatus(false);
    verifyButton.innerHTML = 'Verify';
    verifyButton.classList.remove('flex', 'items-center', 'justify-center');
    verifyButton.disabled = false;

    closeMobileOtpModal();
    openContactDetailsModal(mobileInput.value);
}

function openContactDetailsModal(mobile) {
    document.getElementById('checkout-mobile').value = `IN (+91) ${mobile}`;
    document.getElementById('contact-details-modal').classList.add('flex');
    document.getElementById('contact-details-modal').classList.remove('hidden');
}

export function closeContactDetailsModal() {
    document.getElementById('contact-details-modal').classList.add('hidden');
    document.getElementById('contact-details-modal').classList.remove('flex');
}

export async function submitOrder() {
    if (State.isLoading) return;

    const fullName = document.getElementById('full-name').value;
    const emailId = document.getElementById('email-id').value;
    const pincode = document.getElementById('pincode').value;
    const submitButton = document.querySelector('#contact-details-modal button.bg-yellow-400');

    if (!fullName || !emailId || !pincode || !emailId.includes('@')) {
        showMessage("Please fill in all contact details with a valid email.");
        return;
    }

    State.updateLoadingStatus(true);
    submitButton.innerHTML = `${SPINNER_ICON} Placing Order...`;
    submitButton.classList.add('flex', 'items-center', 'justify-center');
    submitButton.disabled = true;

    const orderData = { fullName, emailId, pincode, cart: State.cartItems };
    const response = await apiPlaceOrder(orderData);

    State.updateLoadingStatus(false);
    submitButton.innerHTML = 'SUBMIT';
    submitButton.classList.remove('flex', 'items-center', 'justify-center');
    submitButton.disabled = false;

    if (response.success) {
        closeContactDetailsModal();
        State.updateCart([]); 
        window.App.renderCart(); 
        showMessage(`Order ${response.orderId} placed successfully! Total: \u20B9${response.totalAmount}. Returning to Dashboard.`);
        navigate('dashboard');
    } else {
        showMessage("Order failed. Please try again.");
    }
}

export function updateCartOfferCarousel() {
    const slidesContainer = document.getElementById('cart-offer-slides');
    if (slidesContainer) slidesContainer.style.transform = `translateX(-${State.cartOfferSlide * 100}%)`;
}

export function nextCartOfferSlide() {
    const nextSlide = (State.cartOfferSlide + 1) % State.cartOffers;
    State.updateCartOffer(nextSlide);
    updateCartOfferCarousel();
}

export function goToSlide(index) {
    State.updateCarouselSlide(index);
}

// This is our new, correct function
async function fetchBooks() { 
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.error("No token found. Cannot fetch books.");
        return;
    }

    try {
        // 1. Call your new /api/books endpoint
        const response = await fetch('http://localhost:8080/api/books', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const bookData = await response.json();
        
        // 2. THIS IS THE NEW PART:
        // Save the real books into your central state
        State.updateBooks(bookData); // <-- THIS IS LINE 522
        console.log("Successfully fetched and stored books:", State.books);
        
        // 3. Re-render the current view just in case
        //    (this will update 'Explore Books' if you are on it)
        

    } catch (error) {
        console.error('Error fetching books:', error);
        showMessage('Could not get books from the library. Please try again.');
    }
}

// --- 2. THE `window.App` OBJECT IS CREATED *AFTER* FUNCTIONS ARE DEFINED ---
window.App = {
    navigate,
    logout,
    toggleTheme,
    showMessage,
    hideMessage,
    toggleCartPanel,
    openCartPanel,
    renderProfilePanel,
    toggleProfilePanel,
    addItemToCart,
    updateCartQuantity,
    removeItemFromCart,
    addItemToWishlist,
    removeItemFromWishlist,
    addItemToCartFromWishlist,
    openMobileOtpModal,
    closeMobileOtpModal,
    simulateOtpSend,
    verifyOtp,
    closeContactDetailsModal,
    submitOrder,
    updateCartOfferCarousel,
    nextCartOfferSlide,
    goToSlide,
    renderCart,
    fetchBooks, // <-- This is added
    updateBooks: State.updateBooks // <-- We must add updateBooks here
};

// --- 3. THE SCRIPT STARTS ---
document.addEventListener('DOMContentLoaded', init);
