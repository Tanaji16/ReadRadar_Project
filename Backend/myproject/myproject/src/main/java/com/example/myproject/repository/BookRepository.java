package com.example.myproject.repository;

import com.example.myproject.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Spring Data JPA automatically creates methods like:
    // save(), findById(), findAll(), deleteById(), etc.
    // We can add custom finders here later if we need them.
}