package com.example.myproject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

// @RestController tells Spring this class will handle web requests
@RestController
public class GreetingController {

    // @GetMapping("/api/greeting") maps this method to handle
    // GET requests for the URL http://localhost:8080/api/greeting
    @GetMapping("/api/greeting")
    public Map<String, String> getGreeting() {
        // Spring will automatically turn this Map into JSON data
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from the Spring Boot Backend!");
        return response;
    }
}