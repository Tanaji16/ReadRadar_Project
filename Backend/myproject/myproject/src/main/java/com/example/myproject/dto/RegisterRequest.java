package com.example.myproject.dto;

// A record is a simple data-holder class.
// This will automatically have fields for name, email, password, and role.
public record RegisterRequest(String name, String email, String password, String role) {
}