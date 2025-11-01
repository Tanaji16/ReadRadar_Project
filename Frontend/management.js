// This function runs as soon as the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get user role and token from Local Storage
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('userToken');

    // 2. Check for Admin privileges
    const isAdmin = userRole && (userRole.includes('Admin') || userRole.includes('Educator') || userRole.includes('Spoc'));
    
    const adminContent = document.getElementById('admin-content');
    const deniedContent = document.getElementById('denied-content');
    const form = document.getElementById('add-book-form');
    const tableBody = document.getElementById('inventory-table-body');

    if (isAdmin && token) {
        // User is an Admin, show the main content
        adminContent.style.display = 'block';
        deniedContent.style.display = 'none';

        // --- NEW ---
        // Load the book inventory table
        loadBooks(token);

        // Add event listener for the "Add Book" form
        form.addEventListener('submit', (e) => handleBookSubmit(e, token));

        // --- NEW ---
        // Add one smart event listener to the table body to catch all delete clicks
        tableBody.addEventListener('click', (e) => handleDeleteClick(e, token));

    } else {
        // User is not an Admin, show the "Access Denied" message
        adminContent.style.display = 'none';
        deniedContent.style.display = 'block';
    }
});

// --- NEW FUNCTION ---
// Fetches all books and calls renderTable
async function loadBooks(token) {
    try {
        const response = await fetch('http://localhost:8080/api/books', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status}`);
        }

        const books = await response.json();
        renderBookTable(books);
    } catch (error) {
        console.error("Error loading books:", error);
        alert("Could not load book inventory.");
    }
}

// --- NEW FUNCTION ---
// Renders the list of books into the table
function renderBookTable(books) {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    // Clear the table first (this removes your 2 static "The Martian" rows)
    tableBody.innerHTML = '';

    if (books.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-gray-500 dark:text-gray-400">No books in inventory.</td></tr>';
        return;
    }

    // Create a new row for each book
    books.forEach(book => {
        // Use the quantity from the database
        const available = book.quantity > 0 ? book.quantity : 0; 
        const statusClass = book.quantity > 0 ? 'text-success-green' : 'text-red-500';

        const row = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${book.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${book.author}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${book.quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${statusClass}">${available}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="text-primary-blue hover:text-blue-700 edit-btn" data-book-id="${book.id}">Edit</button>
                    <button class="text-red-500 hover:text-red-700 delete-btn ml-4" data-book-id="${book.id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// --- NEW FUNCTION ---
// Handles the click on any "Delete" button
async function handleDeleteClick(event, token) {
    // Check if the clicked element is NOT a delete button
    if (!event.target.classList.contains('delete-btn')) {
        return; // Do nothing
    }

    const button = event.target;
    const bookId = button.dataset.bookId;
    // Find the book title from the first cell (td) in the same row (tr)
    const bookTitle = button.closest('tr').querySelector('td:first-child').innerText;

    // Use confirm() for a simple Yes/No dialog
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
        return; // User clicked "Cancel"
    }

    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // This will happen if the user is not an Admin (403 Forbidden)
            throw new Error(`Server responded with status: ${response.status}`);
        }

        // If successful, show a success message and reload the book table
        alert(`Successfully deleted "${bookTitle}".`);
        loadBooks(token); // Refresh the table

    } catch (error) {
        console.error("Error deleting book:", error);
        alert(`Error: Could not delete book. ${error.message}`);
    }
}

// --- THIS IS YOUR EXISTING "ADD BOOK" FUNCTION ---
// I have only added one line to it: loadBooks(token) after a success.
async function handleBookSubmit(event, token) {
    event.preventDefault(); // Stop the form from refreshing the page
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    const bookData = {
        title: form.elements.title.value,
        author: form.elements.author.value,
        isbn: form.elements.isbn.value,
        genre: form.elements.genre.value,
        publicationYear: parseInt(form.elements.year.value),
        quantity: parseInt(form.elements.quantity.value),
        price: parseFloat(form.elements.price.value),
        originalPrice: parseFloat(form.elements.originalPrice.value)
    };

    // Simple validation
    if (!bookData.title || !bookData.author) {
        alert("Please fill in at least Title and Author.");
        return;
    }

    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    try {
        const response = await fetch('http://localhost:8080/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error("Server error response:", errorText);
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const newBook = await response.json();
        
        alert(`Success! "${newBook.title}" has been added to the library.`);
        form.reset(); // Clear the form
        
        // --- THIS IS THE NEW LINE ---
        // Refresh the table so the new book appears immediately
        loadBooks(token); 

    } catch (error) {
        console.error('Error adding book:', error);
        alert("Error: Could not add book. You may not have permission or the server is down.");
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = 'Add Book';
    }
}

