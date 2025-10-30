import * as State from '../state.js';

export function getDashboardHtml() {
    const role = State.userRole; 
    const isAdmin = role && (role.includes('Admin') || role.includes('Educator') || role.includes('Spoc'));

    // NOTE: 'data-view' attributes are used instead of onclick for robust binding
    return `
        <div id="dashboard-content" class="max-w-7xl mx-auto">
            <div class="mb-10 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                    Welcome, <span id="user-email-display">${State.userEmail || 'Guest'}</span>!
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400">
                    You are logged in as a <span id="user-role-display" class="font-semibold text-accent-orange">${role || 'Unknown Role'}</span>.
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                
                <div id="explore-card" data-view="explore" class="dashboard-card bg-explore-bg text-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v.01M12 14v.01M16 14v.01M18 10H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2zM4 7V4a2 2 0 012-2h12a2 2 0 012 2v3" />
                    </svg>
                    <h3 class="text-xl font-bold mb-2">Explore Books</h3>
                    <p class="text-sm opacity-90">Search and discover all available titles in the library catalog.</p>
                </div>

                <div id="history-card" data-view="history" class="dashboard-card bg-history-bg text-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ${!isAdmin ? '' : 'hidden'}">
                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v4a1 1 0 001 1h5m-5 0h.01M12 12l.01-.01M12 12L8 8m4 4l4-4m3 8v-1.01M18 17h-.01" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    <h3 class="text-xl font-bold mb-2">My Borrowing History</h3>
                    <p class="text-sm opacity-90">View current borrowed books, renewal periods, and past records.</p>
                </div>

                <div id="profile-card" data-view="profile-panel" class="dashboard-card bg-profile-bg text-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 class="text-xl font-bold mb-2">My Profile</h3>
                    <p class="text-sm opacity-90">View and update your personal account and communication preferences.</p>
                </div>

                <div id="holds-card" data-view="holds" class="dashboard-card bg-holds-bg text-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 class="text-xl font-bold mb-2">Book Holds/Requests</h3>
                    <p class="text-sm opacity-90">Manage pending requests and check your place in the borrowing queue.</p>
                </div>

                ${isAdmin ? `
                <div id="management-card" class="dashboard-card bg-green-500 text-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300" data-view="management">
                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 class="text-xl font-bold mb-2">Library Management</h3>
                    <p class="text-sm opacity-90">Manage book inventory, track borrower records, and handle overdue alerts.</p>
                </div>
                
                <div id="reporting-card" class="dashboard-card bg-indigo-500 text-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.03] transition-all duration-300" data-view="reporting">
                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 class="text-xl font-bold mb-2">System Reporting</h3>
                    <p class="text-sm opacity-90">Generate usage statistics, overdue reports, and system audits.</p>
                </div>
                ` : ``}

            </div>
            
            <div class="max-w-7xl mx-auto mt-12 text-center">
                <button 
                    onclick="logout()"
                    class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-600 transform hover:scale-105"
                >
                    Log Out
                </button>
            </div>
        </div>
    `;
}

export function initializeDashboardView() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    // 1. Bind all event listeners explicitly
    cards.forEach(card => {
        const view = card.getAttribute('data-view');
        
        if (view === 'management') {
            card.addEventListener('click', () => {
                window.location.assign('library_management_dashboard.html');
            });
        } else if (view === 'reporting') {
            card.addEventListener('click', () => {
                window.App.showMessage('Navigating to System Reporting...');
            });
        } else if (view === 'profile-panel') {
            // Bind profile card to open the side panel
            card.addEventListener('click', () => {
                window.App.toggleProfilePanel();
            });
        } 
        else if (view) {
            // Bind all other view navigation actions (explore, history, holds)
            card.addEventListener('click', () => {
                window.App.navigate(view);
            });
        }
    });

    // 2. Update the dashboard display placeholders
    const emailDisplay = document.getElementById('user-email-display');
    const roleDisplay = document.getElementById('user-role-display');
    
    // We access State through the global App object, which should be available here
    if (emailDisplay) emailDisplay.innerText = window.App.State.userEmail;
    if (roleDisplay) roleDisplay.innerText = window.App.State.userRole;
}