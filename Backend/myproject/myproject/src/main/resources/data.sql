-- We are adding the price and original_price columns

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price) 
VALUES 
('The Martian', 'Andy Weir', '978-0553418026', 2014, 'Science Fiction', 10, 50, 100);

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price) 
VALUES 
('Educated', 'Tara Westover', '978-0399590504', 2018, 'Memoir', 15, 50, 100);

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price) 
VALUES 
('Atomic Habits', 'James Clear', '978-0735211292', 2018, 'Self-Help', 20, 50, 100);

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price) 
VALUES 
('Project Hail Mary', 'Andy Weir', '978-0593135204', 2021, 'Science Fiction', 12, 50, 100);

INSERT INTO books (title, author, isbn, publication_year, genre, quantity, price, original_price) 
VALUES 
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '978-0062316097', 2015, 'Non-Fiction', 8, 50, 100);
-- This adds your Admin user with the password "admin123"
-- The long string is "admin123" after being hashed with BCrypt
-- NOTE: Use a unique email for your admin

INSERT INTO users (name, email, password, role)
VALUES
('Admin User', 'admin@gmail.com', '$2a$10$3zHzb.Nrnv5T1cWaBG.kIeNrC14G/iZ3cCSvN1ylg2iMQb.qzfnVW', 'Admin/Spoc/Educator');