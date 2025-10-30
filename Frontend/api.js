
import * as State from './state.js';

// Helper function to simulate network latency (200-500ms)
function simulateLatency(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), Math.floor(Math.random() * 300) + 200);
    });
}

// --- Auth Simulation ---

export async function apiAuthenticate(email, role) {
    return simulateLatency({
        success: true,
        user: { email, role }
    });
}

// --- Data Fetching ---

export async function apiFetchBooks() {
    return simulateLatency(State.books);
}

// --- Business Logic Simulation ---

export async function apiPlaceOrder(orderData) {
    const total = State.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return simulateLatency({
        success: true,
        orderId: `RR${Date.now().toString().slice(-6)}`,
        totalAmount: total,
        contact: orderData.fullName,
        delivery: orderData.pincode
    });
}

export async function apiSendOtp(mobile) {
    if (mobile.length === 10) {
        return simulateLatency({ success: true, message: `OTP sent to ${mobile}. (Simulated: 1234)` });
    } else {
        return simulateLatency({ success: false, message: "Invalid mobile number format." });
    }
}