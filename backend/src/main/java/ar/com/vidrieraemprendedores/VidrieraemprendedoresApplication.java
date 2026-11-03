package ar.com.vidrieraemprendedores;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.Rol;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@SpringBootApplication
@RestController
public class VidrieraemprendedoresApplication {

    public static void main(String[] args) {
        SpringApplication.run(VidrieraemprendedoresApplication.class, args);
    }

    @GetMapping("/")
    public List<String> hello() {
        return List.of("Hello, World!");
    }

    // Se ejecuta automáticamente al arrancar Spring Boot.
    // Credenciales configurables por variables de entorno: SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD
    // (si no se definen, se usan los valores de siempre).
    // Para recuperar el acceso: arrancar UNA vez con SUPERADMIN_RESET=true y luego quitar la variable.
    @Bean
    public CommandLineRunner initSuperAdmin(
            EmprendedorRepository repository,
            PasswordEncoder encoder,
            @Value("${superadmin.email:superadmin@vcp.gob.ar}") String email,
            @Value("${superadmin.password:AdminVCP2026!}") String password,
            @Value("${superadmin.reset:false}") boolean reset) {
        return args -> {
            Optional<Emprendedor> existente = repository.findByEmail(email);

            if (existente.isEmpty()) {
                Emprendedor superAdmin = new Emprendedor();
                superAdmin.setNombreCompleto("Super Admin");
                superAdmin.setEmail(email);
                superAdmin.setPassword(encoder.encode(password));
                superAdmin.setRol(Rol.ROLE_SUPER_ADMIN);
                superAdmin.setEstado("ACTIVO");

                repository.save(superAdmin);
                System.out.println(">>> Super Admin creado exitosamente: " + email + " <<<");
            } else if (reset) {
                Emprendedor superAdmin = existente.get();
                superAdmin.setPassword(encoder.encode(password));
                superAdmin.setRol(Rol.ROLE_SUPER_ADMIN);
                superAdmin.setEstado("ACTIVO");

                repository.save(superAdmin);
                System.out.println(">>> Super Admin restablecido (contraseña, rol y estado): " + email + " <<<");
            }
        };
    }

}