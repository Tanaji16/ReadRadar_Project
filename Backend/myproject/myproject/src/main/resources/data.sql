-- This SQL will run automatically on startup
-- It deletes all old data for a clean start, then adds users and books

DELETE FROM books;
DELETE FROM users;

-- Add our Admin user
INSERT INTO users (name, email, password, role)
VALUES
('Admin User', 'admin@gmail.com', '$2a$10$3zHzb.Nrnv5T1cWaBG.kIeNrC14G/iZ3cCSvN1ylg2iMQb.qzfnVW', 'Admin/Spoc/Educator');

-- Add our 5 starter books, now with local image paths
INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price, img) 
VALUES 
('The Martian', 'Andy Weir', '978-0553418026', 2014, 'Science Fiction', 10, 50, 100, 'images/the-martian.jpg.jpg');

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price, img) 
VALUES 
('Educated', 'Tara Westover', '978-0399590504', 2018, 'Memoir', 15, 50, 100, 'images/educated.jpg.webp');

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price, img) 
VALUES 
('Atomic Habits', 'James Clear', '978-0735211292', 2018, 'Self-Help', 20, 50, 100, 'images/atomic-habits.jpg.jpg');

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price, img) 
VALUES 
('Project Hail Mary', 'Andy Weir', '978-0593135204', 2021, 'Science Fiction', 12, 50, 100, 'images/project-hail-mary.jpg.jpg');

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price, img) 
VALUES 
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '978-0062316097', 2015, 'Non-Fiction', 8, 50, 100, 'images/sapiens.jpg.jpg');