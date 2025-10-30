    

export function getHistoryHtml() {
    const simulatedHistory = [
        { id: 'RRB-901', book: 'A Brief History of Time', borrowed: 'Sep 15, 2025', due: 'Oct 15, 2025', status: 'Borrowed' },
        { id: 'RRB-855', book: 'The Secret History', borrowed: 'Aug 20, 2025', returned: 'Sep 5, 2025', status: 'Returned' },
        { id: 'RRB-721', book: 'Introduction to Algorithms', borrowed: 'Jul 1, 2025', returned: 'Aug 1, 2025', status: 'Returned' },
        { id: 'RRB-600', book: 'Cosmos', borrowed: 'Jun 10, 2025', due: 'Oct 10, 2025', status: 'Overdue' },
    ];

    return `
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">My Borrowing History</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                View your current and past borrowing records with due dates.
            </p>
            
            <button onclick="navigate('dashboard')" class="mb-6 px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-150 transform hover:scale-105 shadow-md">
                < Back to Dashboard
            </button>

            ${simulatedHistory.length === 0 ? `
                <div class="text-center p-16 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-xl mt-10">
                    <svg class="w-20 h-20 mx-auto text-primary-blue/50 dark:text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.5 12.75l-4.5 4.5-2.25-2.25m4.5-2.25l-2.25 2.25m2.25-2.25L10.5 19.5"/></svg>
                    <p class="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-4">No Current or Past Records</p>
                    <p class="text-md text-gray-500 dark:text-gray-400 mt-2">Start exploring and borrowing books to see your history!</p>
                    <button onclick="navigate('explore')" class="mt-6 px-6 py-3 bg-accent-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition transform hover:scale-[1.02] shadow-lg">
                        Browse Catalog Now
                    </button>
                </div>
            ` : `
                <div class="space-y-4">
                    ${simulatedHistory.map(record => `
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center transition duration-200 hover:shadow-xl border-l-4 ${record.status === 'Overdue' ? 'border-red-500' : 'border-primary-blue'}">
                            <div>
                                <p class="font-bold text-gray-900 dark:text-gray-100">${record.book}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">ID: ${record.id}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Borrowed: ${record.borrowed}</p>
                                ${record.due ? `<p class="text-sm ${record.status === 'Overdue' ? 'text-red-600 font-bold' : 'text-primary-blue'} dark:text-red-400">Due Date: ${record.due}</p>` : ''}
                            </div>
                            <div class="text-right">
                                <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full 
                                    ${record.status === 'Borrowed' ? 'bg-blue-100 text-primary-blue dark:bg-blue-800 dark:text-blue-200' : 
                                      record.status === 'Returned' ? 'bg-green-100 text-success-green dark:bg-green-800 dark:text-green-200' :
                                      'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'}">
                                    ${record.status}
                                </span>
                                ${record.status === 'Borrowed' ? `
                                    <button onclick="showMessage('Simulating Book Return for ${record.book}...')" class="mt-2 text-sm text-accent-orange hover:underline transition transform hover:scale-[1.02]">Return Book</button>
                                ` : record.status === 'Overdue' ? `
                                    <button onclick="showMessage('Simulating Fine Payment for ${record.book}...')" class="mt-2 text-sm text-red-700 hover:underline font-bold transition transform hover:scale-[1.02]">Pay Fine</button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}