package com.lic.licenta.controller;

import com.lic.licenta.responses.PasswordResetRequest;
import com.lic.licenta.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password-reset")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
        String token = passwordResetService.generateResetToken(email);

        if (token == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok("Password reset email sent!");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        boolean isValid = passwordResetService.validateToken(request.getToken());

        if (!isValid) {
            return ResponseEntity.status(400).body("Invalid or expired token");
        }

        boolean isPasswordChanged = passwordResetService.changePassword(request.getToken(), request.getNewPassword());

        if (isPasswordChanged) {
            return ResponseEntity.ok("Password successfully changed!");
        }

        return ResponseEntity.status(400).body("Password reset failed");
    }

}
