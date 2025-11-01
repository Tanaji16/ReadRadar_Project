package com.example.myproject.config;

import com.example.myproject.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Make sure this import is here
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
            .cors(withDefaults()) // Enable CORS from ApplicationConfig
            
            .authorizeHttpRequests(authz -> authz
                
                // Public endpoints
                .requestMatchers("/api/register", "/api/login").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // Allow H2 console
                
                // --- THESE ARE OUR BOOK RULES ---
                // Allow ANY logged-in user to VIEW books
                .requestMatchers(HttpMethod.GET, "/api/books").authenticated() 
                
                // Only allow Admins to ADD books
                .requestMatchers(HttpMethod.POST, "/api/books").hasAuthority("Admin/Spoc/Educator") 

                // --- THIS IS THE NEW LINE ---
                // Only allow Admins to DELETE books
                .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasAuthority("Admin/Spoc/Educator")
                // --- END OF NEW LINE ---

                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        // This is needed to allow H2 console to be viewed
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }
}

