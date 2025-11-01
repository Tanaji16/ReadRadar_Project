package com.example.myproject.service;
import com.example.myproject.dto.LoginRequest;
import com.example.myproject.dto.LoginResponse;
import com.example.myproject.dto.RegisterRequest;
import com.example.myproject.model.User;
import com.example.myproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Import the UserDetailsService which is part of Spring Security
import org.springframework.security.core.userdetails.UserDetailsService;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    
    // --- ADD THIS ---
    @Autowired
    private JwtService jwtService;
    
    // --- ADD THIS ---
    @Autowired
    private UserDetailsService userDetailsService;
    
    // --- DELETE THE jwtSecretKey FIELD ---

    public User register(RegisterRequest request) {
        // (This method stays exactly the same)
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
    
    // --- REPLACE YOUR OLD login() METHOD WITH THIS ---
    public LoginResponse login(LoginRequest request) {
        // 1. Authenticate the user (checks email and password)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // 2. If successful, find the user's details
        // We use UserDetailsService to get the Spring-Security-compatible user
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        
        // 3. Generate the JWT Token using our new service
        String token = jwtService.generateToken(userDetails);

        // 4. Send the token back
        return new LoginResponse(token);
    }
}