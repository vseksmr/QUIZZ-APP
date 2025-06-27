package com.lic.licenta.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<String> adminDashboard(Authentication authentication) {
        System.out.println("🔍 User Principal: " + authentication.getPrincipal());
        System.out.println("🔍 Authorities: " + authentication.getAuthorities());

        return ResponseEntity.ok("Welcome Admin!");
    }
}
