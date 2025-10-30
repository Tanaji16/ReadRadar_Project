package com.example.myproject.controller;

// --- MAKE SURE YOU ADD THESE IMPORTS ---
import com.example.myproject.dto.LoginRequest;
import com.example.myproject.dto.LoginResponse;
// --- END OF IMPORTS TO ADD ---

import com.example.myproject.dto.RegisterRequest;
import com.example.myproject.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // (Your existing register method)
        try {
            authService.register(registerRequest);
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- ADD THIS ENTIRE NEW METHOD ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // The authService.login method will do all the work
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response); // Sends back the { "token": "..." }
        } catch (Exception e) {
            // This catches bad passwords, user not found, etc.
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }
}