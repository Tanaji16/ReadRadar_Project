package com.example.myproject.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "books") // This will create a "books" table in your database
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String isbn;
    private int publicationYear;
    private String genre;
    private int quantity; // How many copies the library owns
    private double price;
private double originalPrice;

    // A no-argument constructor is required by JPA
    public Book() {
    }

    // --- Getters and Setters ---
    // (You can auto-generate these in VS Code by right-clicking,
    // selecting "Source Action...", and then "Generate Getters and Setters...")

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(int publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public double getPrice() {
    return price;
}

public void setPrice(double price) {
    this.price = price;
}

public double getOriginalPrice() {
    return originalPrice;
}

public void setOriginalPrice(double originalPrice) {
    this.originalPrice = originalPrice;
}
}