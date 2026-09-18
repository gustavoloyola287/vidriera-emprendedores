package ar.com.vidrieraemprendedores;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.Rol;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    // Se ejecuta automáticamente al arrancar Spring Boot
    @Bean
    public CommandLineRunner initSuperAdmin(EmprendedorRepository repository, PasswordEncoder encoder) {
        return args -> {
            // Verifica si ya existe el usuario para no duplicarlo cada vez que reinicias
            if (repository.findByEmail("superadmin@vcp.gob.ar").isEmpty()) {
                Emprendedor superAdmin = new Emprendedor();
                superAdmin.setNombreCompleto("Super Admin");
                superAdmin.setEmail("superadmin@vcp.gob.ar");
                superAdmin.setPassword(encoder.encode("AdminVCP2026!"));
                superAdmin.setRol(Rol.ROLE_SUPER_ADMIN);
                superAdmin.setEstado("ACTIVO");

                repository.save(superAdmin);
                System.out.println(">>> Super Admin creado exitosamente: superadmin@vcp.gob.ar <<<");
            }
        };
    }

}