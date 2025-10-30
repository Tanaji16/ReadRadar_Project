package com.example.myproject.config;

import com.example.myproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // This tells Spring Security how to load a user by their email
        return email -> userRepository.findByEmail(email)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        java.util.Collections.emptyList())) // We're not using Spring roles for now
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // This bean is required for our AuthService to handle the login
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for our API
            .authorizeHttpRequests(authz -> authz
                
                // Allow our "register" and "login" endpoints to be public
                .requestMatchers("/api/register", "/api/login").permitAll()
                
                // Also allow our test greeting endpoint
                .requestMatchers("/api/greeting").permitAll() 
                
                // All other requests must be authenticated
                .anyRequest().authenticated()
            );
            // By not including .authenticationProvider(), Spring Boot 3
            // will automatically create one using our UserDetailsService and PasswordEncoder beans.
            // This fixes all the deprecation warnings.

        return http.build();
    }
}