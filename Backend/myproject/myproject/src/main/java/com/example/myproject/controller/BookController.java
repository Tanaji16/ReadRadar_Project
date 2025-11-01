package com.example.myproject.controller;

import com.example.myproject.model.Book;
import com.example.myproject.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// --- ADD THESE NEW IMPORTS ---
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
// --- END OF NEW IMPORTS ---

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // GET /api/books (Read all books)
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // POST /api/books (Create a new book)
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book savedBook = bookRepository.save(book);
        return ResponseEntity.ok(savedBook);
    }

    // --- ADD THIS NEW DELETE METHOD ---
    // DELETE /api/books/{id} (Delete a book)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        // @PathVariable pulls the "id" from the URL
        
        // We check if the book exists before deleting
        return bookRepository.findById(id)
            .map(book -> {
                bookRepository.delete(book);
                return ResponseEntity.ok().build(); // Sends a 200 OK
            })
            .orElse(ResponseEntity.notFound().build()); // Sends a 404 Not Found
    }
}
