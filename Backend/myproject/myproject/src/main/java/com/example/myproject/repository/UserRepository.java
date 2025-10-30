package com.example.myproject.repository;

import com.example.myproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // This lets us find a user by their email
    Optional<User> findByEmail(String email);
}