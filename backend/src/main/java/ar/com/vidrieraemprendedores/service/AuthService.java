package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.dto.AuthResponse;
import ar.com.vidrieraemprendedores.dto.LoginRequest;
import ar.com.vidrieraemprendedores.dto.RegisterRequest;
import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.Rol;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;
import ar.com.vidrieraemprendedores.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final EmprendedorRepository emprendedorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(
            EmprendedorRepository emprendedorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EmailService emailService
    ) {
        this.emprendedorRepository = emprendedorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    // 1. Registrar nuevo emprendedor
    public AuthResponse register(RegisterRequest request) {                                        
        Emprendedor emprendedor = new Emprendedor();                    
        emprendedor.setNombreCompleto(request.getNombreCompleto());
        emprendedor.setNombreEmprendimiento(request.getNombreEmprendimiento());
        emprendedor.setDescripcion(request.getDescripcion());
        emprendedor.setEmail(request.getEmail());
        emprendedor.setTelefono(request.getTelefono());
        emprendedor.setPassword(passwordEncoder.encode(request.getPassword()));
        emprendedor.setRol(Rol.ROLE_EMPRENDEDOR);

        emprendedorRepository.save(emprendedor);

        String jwtToken = jwtService.generateToken(emprendedor);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .role(emprendedor.getRol().name()) 
                .id(emprendedor.getId())
                .nombre(emprendedor.getNombreCompleto())
                .build();
    }

    // 2. Crear Administrador (Coincide exactamente con lo que llama tu AdminController)
    public Emprendedor crearAdministrador(String nombre, String email, String password) {
        if (emprendedorRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El email ya se encuentra registrado");
        }

        Emprendedor admin = new Emprendedor();
        admin.setNombreCompleto(nombre);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRol(Rol.ROLE_ADMIN);
        admin.setEstado("ACTIVO");

        // Retornamos el objeto Emprendedor guardado, que es lo que espera el Controller
        return emprendedorRepository.save(admin);
    }

    // 3. Login 
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Emprendedor emprendedor = emprendedorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado"));

        String jwtToken = jwtService.generateToken(emprendedor);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .role(emprendedor.getRol().name()) // Devuelve "ROLE_SUPER_ADMIN", "ROLE_ADMIN", etc.
                .id(emprendedor.getId())
                .nombre(emprendedor.getNombreCompleto())
                .build();
    }

    // 4. Recuperación de contraseña
    public void processPasswordRecovery(String email) {
        Emprendedor emprendedor = emprendedorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado"));

        String token = UUID.randomUUID().toString();
        emprendedor.setResetPasswordToken(token);
        emprendedor.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        emprendedorRepository.save(emprendedor);

        String resetLink = "http://localhost:5173/restablecer-password?token=" + token; // Ajustado al puerto de Vite
        emailService.sendPasswordResetEmail(emprendedor.getEmail(), resetLink);
    }

    // 5. Restablecer contraseña
    public void resetPassword(String token, String newPassword) {
        Emprendedor emprendedor = emprendedorRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Token de recuperación inválido"));

        if (emprendedor.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token de recuperación ha expirado");
        }

        emprendedor.setPassword(passwordEncoder.encode(newPassword));
        emprendedor.setResetPasswordToken(null);
        emprendedor.setResetPasswordTokenExpiry(null);
        emprendedorRepository.save(emprendedor);
    }
}