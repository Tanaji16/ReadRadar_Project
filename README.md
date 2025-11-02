📚 ReadRadarApp

This is a full-stack library management web application built from scratch. It features a complete Java Spring Boot backend (handling security, data, and business logic) and a modern JavaScript frontend (for the user interface).

✨ Features

Full-Stack Authentication: Secure user registration and login system.

Role-Based Security:

Student role: Can view books.

Admin/Spoc/Educator role: Can view, add, and delete books.

Secure API: All backend API endpoints (except login/register) are protected using JWT (JSON Web Tokens).

Dynamic Inventory: The "Explore Books" and "Admin Inventory" pages load all data directly from the backend database.

CRUD Operations: Full Create, Read, and Delete functionality for books, available only to Admins.

💻 Tech Stack

Backend:

Java 17

Spring Boot

Spring Security (for JWT authentication and role-based security)

Spring Data JPA (for database operations)

H2 (File-Based SQL Database)

Frontend:

HTML5

Tailwind CSS

JavaScript (ES6 Modules, async/await, fetch API)

🚀 How to Run This Project

You must run both the backend and frontend servers.

1. Run the Backend 

Open the ReadRadarApp project in VS Code.

Navigate to Backend/myproject/src/main/java/com/example/myproject/MyprojectApplication.java.

Click the "Run" button above the main method.

The server will start on http://localhost:8080.

You can view the database console at http://localhost:8080/h2-console (use jdbc:h2:file:./readradar as the JDBC URL).

2. Run the Frontend 

In the same VS Code window, go to the frontend folder.

Right-click on the login.html file.

Select "Open with Live Server".

Your browser will open to http://127.0.0.1:5500/frontend/login.html.

🔑 Admin Login

To test the admin features (adding/deleting books), use the user created in your data.sql file:

Role: Admin/Spoc/Educator

Email: admin@gmail.com

Password: admin123