package com.lic.licenta.service;

import com.lic.licenta.dto.LoginUserDto;
import com.lic.licenta.model.User;
import com.lic.licenta.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    public void testAuthenticateUserSuccess() {
        LoginUserDto dto = new LoginUserDto("test@example.com", "password");
        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setEnabled(true);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);

        User result = authenticationService.authenticate(dto);

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    public void testAuthenticateUserNotVerified() {
        LoginUserDto dto = new LoginUserDto("test@example.com", "password");
        dto.setEmail("test@example.com");
        dto.setPassword("password");

        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword(passwordEncoder.encode("password"));
        mockUser.setEnabled(false);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        assertThrows(RuntimeException.class, () -> authenticationService.authenticate(dto));
    }
}
