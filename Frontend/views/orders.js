

export function getOrdersHtml() {
    const simulatedOrders = [
        { id: 'RR1001', date: 'Oct 1, 2025', status: 'Delivered', total: 150, items: 3 },
        { id: 'RR1002', date: 'Sep 25, 2025', status: 'Returned', total: 50, items: 1 },
        { id: 'RR1003', date: 'Sep 10, 2025', status: 'Delivered', total: 200, items: 4 },
    ];

    return `
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your Recent Orders</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                View your complete order history (Simulated College Borrowing Records).
            </p>
            
            <button onclick="navigate('dashboard')" class="mb-6 px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-150 transform hover:scale-105 shadow-md">
                < Back to Dashboard
            </button>

            <div class="space-y-4">
                ${simulatedOrders.map(order => `
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center transition duration-200 hover:shadow-xl border-l-4 ${order.status === 'Delivered' ? 'border-success-green' : 'border-accent-orange'}">
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-100">Order ID: ${order.id}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Date: ${order.date}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Total Items: ${order.items}</p>
                        </div>
                        <div class="text-right">
                            <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full 
                                ${order.status === 'Delivered' ? 'bg-green-100 text-success-green dark:bg-green-800 dark:text-green-200' : 
                                  'bg-yellow-100 text-accent-orange dark:bg-yellow-800 dark:text-yellow-200'}">
                                ${order.status}
                            </span>
                            <p class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">\u20B9${order.total}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
        </div>
    `;
}