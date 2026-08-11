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

@Service
public class AuthService {

    private final EmprendedorRepository emprendedorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            EmprendedorRepository emprendedorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.emprendedorRepository = emprendedorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
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
}
