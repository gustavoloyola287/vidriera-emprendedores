package ar.com.vidrieraemprendedores.service;


import ar.com.vidrieraemprendedores.dto.AuthResponse;
import ar.com.vidrieraemprendedores.dto.LoginRequest;
import ar.com.vidrieraemprendedores.dto.RegisterRequest;
import ar.com.vidrieraemprendedores.model.Emprendedor;
import ar.com.vidrieraemprendedores.model.Rol;
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
    // Este metodo viene del frontend y se encarga de registrar un nuevo emprendedor
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

        // Generamos el token de inmediato para que quede autenticado al registrarse
        String jwtToken = jwtService.generateToken(emprendedor);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        // Valida que el email y la contraseña sean correctos
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Si pasa la autenticación, buscamos al emprendedor y generamos el token
        Emprendedor emprendedor = emprendedorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado"));

        String jwtToken = jwtService.generateToken(emprendedor);
        return new AuthResponse(jwtToken);
    }

    // Procesa la solicitud inicial de recuperación de contraseña, generando un token y enviando un correo electrónico
    public void processPasswordRecovery(String email) {
        Emprendedor emprendedor = emprendedorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado"));

        // Generamos un token de recuperación de contraseña (puede ser un UUID o cualquier otro token seguro)
        String token = UUID.randomUUID().toString();
        emprendedor.setResetPasswordToken(token);
        emprendedor.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15)); // Token expira en 15 minutos
        emprendedorRepository.save(emprendedor);

        // Enviar el correo electrónico con el enlace de recuperación
        String resetLink = "http://localhost:3000/reset-password?token=" + token; // Cambiar al dominio real en producción
        emailService.sendPasswordResetEmail(emprendedor.getEmail(), resetLink);
    }

    // Verifica el token de recuperación de contraseña y permite al usuario establecer una nueva contraseña
    public void resetPassword(String token, String newPassword) {
        Emprendedor emprendedor = emprendedorRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Token de recuperación inválido"));

        // Verificar si el token ha expirado
        if (emprendedor.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token de recuperación ha expirado");
        }

        // Actualizar la contraseña y limpiar el token
        emprendedor.setPassword(passwordEncoder.encode(newPassword));
        emprendedor.setResetPasswordToken(null);
        emprendedor.setResetPasswordTokenExpiry(null);
        emprendedorRepository.save(emprendedor);
    }

}
