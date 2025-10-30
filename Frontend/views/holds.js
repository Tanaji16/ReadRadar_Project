

export function getHoldsHtml() {
    const simulatedHolds = [
        { id: 'RH-201', book: 'Dune', date: 'Oct 3, 2025', position: 1, status: 'Active' },
        { id: 'RH-202', book: 'Foundation', date: 'Sep 20, 2025', position: 4, status: 'Queued' },
    ];

    return `
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Book Holds & Requests</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Manage your requested books and check your place in the waiting list.
            </p>
            
            <button onclick="navigate('dashboard')" class="mb-6 px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-150 transform hover:scale-105 shadow-md">
                < Back to Dashboard
            </button>

            ${simulatedHolds.length === 0 ? `
                <div class="text-center p-16 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-xl mt-10">
                    <svg class="w-20 h-20 mx-auto text-yellow-500/50 dark:text-yellow-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    <p class="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-4">No Active Holds</p>
                    <p class="text-md text-gray-500 dark:text-gray-400 mt-2">You can request new titles below or check the Explore page.</p>
                </div>
            ` : `
                <div class="space-y-4">
                    ${simulatedHolds.map(hold => `
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center transition duration-200 hover:shadow-xl border-l-4 ${hold.status === 'Active' ? 'border-success-green' : 'border-yellow-500'}">
                            <div>
                                <p class="font-bold text-gray-900 dark:text-gray-100">${hold.book}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Request Date: ${hold.date}</p>
                                <p class="text-md font-semibold text-accent-orange dark:text-yellow-300">Queue Position: ${hold.position}</p>
                            </div>
                            <div class="text-right">
                                <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full 
                                    ${hold.status === 'Active' ? 'bg-green-100 text-success-green dark:bg-green-800 dark:text-green-200' : 
                                      'bg-yellow-100 text-accent-orange dark:bg-yellow-800 dark:text-yellow-200'}">
                                    ${hold.status}
                                </span>
                                <button onclick="showMessage('Simulating Cancellation for ${hold.book}...')" class="mt-2 text-sm text-red-500 hover:underline transition transform hover:scale-[1.02]">Cancel Hold</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
            
            <div class="mt-10 p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner">
                <h4 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Suggest a New Book</h4>
                <input type="text" placeholder="Enter Book Title or Subject" class="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-600 dark:text-gray-100 mb-3">
                <button onclick="showMessage('Simulating new book request sent to Admin.')" class="w-full py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md">
                    Submit Request
                </button>
            </div>
        </div>
    `;
}