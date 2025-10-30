

export function getProfileHtml() {
    return `
        <div class="max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">User Profile</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">Access account settings, orders, and personalization features using the panel on the right.</p>

            <button onclick="toggleProfilePanel()" class="mb-6 px-4 py-2 bg-accent-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition duration-150 transform hover:scale-105 shadow-md">
                Open Profile Panel
            </button>
            <button onclick="navigate('dashboard')" class="mb-6 px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ml-4 transform hover:scale-105 shadow-md">
                < Back to Dashboard
            </button>
        </div>
    `;
}