package com.lic.licenta.service;

import com.lic.licenta.model.PasswordResetToken;
import com.lic.licenta.model.User;
import com.lic.licenta.repository.PasswordResetTokenRepository;
import com.lic.licenta.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordResetService(
            PasswordResetTokenRepository tokenRepository,
            UserRepository userRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder
    ) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }


    public String generateResetToken(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (!user.isPresent()) {
            return null;
        }


        String token = UUID.randomUUID().toString();


        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpirationDate(new Date(System.currentTimeMillis() + 3600000));


        tokenRepository.save(resetToken);


        emailService.sendPasswordResetEmail(email, token);

        return token;
    }


    public boolean validateToken(String token) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);

        return resetTokenOpt.isPresent() && resetTokenOpt.get().getExpirationDate().after(new Date());
    }

    @Transactional
    public boolean changePassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);

        if (resetTokenOpt.isEmpty() || resetTokenOpt.get().getExpirationDate().before(new Date())) {
            return false;
        }

        PasswordResetToken resetToken = resetTokenOpt.get();

        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        String hashedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(hashedPassword);
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return true;
    }



}
