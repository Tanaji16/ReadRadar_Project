import * as State from './state.js';
import { getDashboardHtml, initializeDashboardView } from './views/dashboard.js';
import { getExploreHtml, initializeExploreView } from './views/explore.js';
import { getOrdersHtml } from './views/orders.js';
import { getWishlistHtml } from './views/wishlist.js';
import { getProfileHtml } from './views/profile.js';
import { getHistoryHtml } from './views/history.js';
import { getHoldsHtml } from './views/holds.js';
import { renderProfilePanel } from './app.js'; 

export function renderView(viewName) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    
    let html = '';
    let initializer = null;
    let title = 'Dashboard | Read Radar';

    switch (viewName) {
        case 'dashboard':
            html = getDashboardHtml();
            initializer = initializeDashboardView;
            title = 'Dashboard | Read Radar';
            break;
        case 'explore':
            html = getExploreHtml();
            initializer = initializeExploreView;
            title = 'Explore Books | Read Radar';
            break;
        case 'orders':
            html = getOrdersHtml();
            title = 'Your Orders | Read Radar';
            break;
        case 'wishlist':
            html = getWishlistHtml();
            title = 'Your Wishlist | Read Radar';
            break;
        case 'profile':
            html = getProfileHtml();
            initializer = renderProfilePanel;
            title = 'User Profile | Read Radar';
            break;
        case 'history':
            html = getHistoryHtml();
            title = 'Borrowing History | Read Radar';
            break;
        case 'holds':
            html = getHoldsHtml();
            title = 'Book Holds | Read Radar';
            break;
        default:
            html = getDashboardHtml();
            initializer = initializeDashboardView;
            title = 'Dashboard | Read Radar';
            break;
    }

    pageTitle.innerText = title;
    mainContent.innerHTML = html;
    
    if (initializer) {
        if (viewName === 'profile') {
            window.App.toggleProfilePanel(); 
        } else {
            initializer();
        }
    }
}