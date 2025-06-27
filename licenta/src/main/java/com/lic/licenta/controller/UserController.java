package com.lic.licenta.controller;

import com.lic.licenta.model.User;
import com.lic.licenta.repository.UserRepository;
import com.lic.licenta.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/users")
@RestController
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;


    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List <User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        System.out.println(" Attempting to delete user with ID: " + id);

        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                userRepository.deleteById(id);
                System.out.println(" User deleted successfully!");
                return ResponseEntity.ok("User deleted successfully!");
            } else {
                System.out.println(" User not found or could not be deleted.");
                return ResponseEntity.badRequest().body("User not found or could not be deleted.");
            }
        } catch (Exception e) {
            System.out.println(" Error occurred while deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the user: " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        long count = userRepository.count();
        return ResponseEntity.ok(count);
    }
}
