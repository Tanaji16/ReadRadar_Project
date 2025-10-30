package com.example.myproject.service;

// --- MAKE SURE YOU ADD THESE IMPORTS ---
import com.example.myproject.dto.LoginRequest;
import com.example.myproject.dto.LoginResponse;
// --- END OF IMPORTS TO ADD ---

import com.example.myproject.dto.RegisterRequest;
import com.example.myproject.model.User;
import com.example.myproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
// --- MAKE SURE YOU ADD THESE IMPORTS ---
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// --- END OF IMPORTS TO ADD ---
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// --- ADD THESE IMPORTS for JWT ---
import io.jsonwebtoken.Jwts;
import java.util.Date;
import javax.crypto.SecretKey;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- ADD THIS NEW FIELD ---
    @Autowired
    private AuthenticationManager authenticationManager;

    // --- ADD THIS NEW FIELD ---
   // THIS IS THE NEW, MODERN LINE
private final SecretKey jwtSecretKey = Jwts.SIG.HS256.key().build();


    public User register(RegisterRequest request) {
        // (Your existing register method)
        if(userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already taken!");
        }
        String hashedPassword = passwordEncoder.encode(request.password());
        User newUser = new User(
            request.name(),
            request.email(),
            hashedPassword,
            request.role()
        );
        return userRepository.save(newUser);
    }

    // --- ADD THIS ENTIRE NEW METHOD ---
    public LoginResponse login(LoginRequest request) {
        // 1. Authenticate the user (checks email and password)
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // 2. If successful, set it in the context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Find the user
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Error finding user after login"));

        // 4. Generate the JWT Token
        long nowMillis = System.currentTimeMillis();
Date now = new Date(nowMillis);
Date validity = new Date(nowMillis + 1000 * 60 * 60 * 10); // 10 hours

String token = Jwts.builder()
    .subject(user.getEmail())        // Replaced setSubject
    .claim("role", user.getRole())
    .claim("name", user.getName())
    .issuedAt(now)                 // Replaced setIssuedAt
    .expiration(validity)          // Replaced setExpiration
    .signWith(jwtSecretKey)
    .compact();
        // 5. Send the token back
        return new LoginResponse(token);
    }
}