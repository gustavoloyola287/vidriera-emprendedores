package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.AuthResponse;
import ar.com.vidrieraemprendedores.dto.LoginRequest;
import ar.com.vidrieraemprendedores.dto.PasswordRecoveryRequest;
import ar.com.vidrieraemprendedores.dto.RegisterRequest;
import ar.com.vidrieraemprendedores.dto.ResetPasswordRequest;
import ar.com.vidrieraemprendedores.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PatchMapping("/recover-password")
    public ResponseEntity<Map<String, String>> recoverPassword(@Valid @RequestBody PasswordRecoveryRequest request) {
        authService.processPasswordRecovery(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Se envió el enlace de recuperación a tu correo"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
    }
}