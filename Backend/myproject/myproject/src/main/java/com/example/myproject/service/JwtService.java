package com.example.myproject.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // This is our secret key for signing the JWT.
    // THIS IS THE NEW "PERMANENT KEY"
// (In a real app, this long string would be in your application.properties, but this is perfect for now)
private static final String SECRET_KEY = "your-super-secret-long-and-secure-key-that-no-one-can-guess-12345";
private final SecretKey jwtSecretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // --- Public Methods ---

    // Generates a token from user details
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // You can add more claims here if you want (e.g., user.getRole())
        return createToken(claims, userDetails.getUsername());
    }

    // Checks if a token is valid
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Extracts the user's email (the "subject") from the token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // --- Private Helper Methods ---

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date validity = new Date(nowMillis + 1000 * 60 * 60 * 10); // 10 hours validity

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(validity)
                .signWith(jwtSecretKey)
                .compact();
    }
}