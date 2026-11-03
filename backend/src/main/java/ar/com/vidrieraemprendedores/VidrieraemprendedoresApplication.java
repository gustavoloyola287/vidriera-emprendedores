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
    // Los Super Administradores se configuran SOLO por variables de entorno (no hay contraseñas en el código):
    //   SUPERADMIN_EMAIL  / SUPERADMIN_PASSWORD   -> primer Super Admin
    //   SUPERADMIN2_EMAIL / SUPERADMIN2_PASSWORD  -> segundo Super Admin
    //   SUPERADMIN_RESET=true                     -> (opcional) restablece contraseña, rol y estado de los existentes
    // Si una cuenta ya existe y no se pide el reset, no se toca. Una vez creados los dos,
    // se pueden quitar todas estas variables.
    @Bean
    public CommandLineRunner initSuperAdmins(
            EmprendedorRepository repository,
            PasswordEncoder encoder,
            @Value("${superadmin.email:superadmin@vcp.gob.ar}") String email1,
            @Value("${superadmin.password:}") String password1,
            @Value("${superadmin2.email:}") String email2,
            @Value("${superadmin2.password:}") String password2,
            @Value("${superadmin.reset:false}") boolean reset) {
        return args -> {
            asegurarSuperAdmin(repository, encoder, "Super Admin", email1, password1, reset);
            asegurarSuperAdmin(repository, encoder, "Super Admin 2", email2, password2, reset);
        };
    }

    private void asegurarSuperAdmin(EmprendedorRepository repository, PasswordEncoder encoder,
                                    String nombre, String email, String password, boolean reset) {
        if (email == null || email.isBlank()) {
            return; // cuenta no configurada
        }
        if (password == null || password.isBlank()) {
            System.out.println(">>> " + nombre + ": falta la contraseña en las variables de entorno, no se crea ni se modifica <<<");
            return;
        }

        String emailNormalizado = email.trim().toLowerCase();
        Optional<Emprendedor> existente = repository.findByEmail(emailNormalizado);

        if (existente.isEmpty()) {
            Emprendedor superAdmin = new Emprendedor();
            superAdmin.setNombreCompleto(nombre);
            superAdmin.setEmail(emailNormalizado);
            superAdmin.setPassword(encoder.encode(password));
            superAdmin.setRol(Rol.ROLE_SUPER_ADMIN);
            superAdmin.setEstado("ACTIVO");

            repository.save(superAdmin);
            System.out.println(">>> " + nombre + " creado exitosamente: " + emailNormalizado + " <<<");
        } else if (reset) {
            Emprendedor superAdmin = existente.get();
            superAdmin.setPassword(encoder.encode(password));
            superAdmin.setRol(Rol.ROLE_SUPER_ADMIN);
            superAdmin.setEstado("ACTIVO");

            repository.save(superAdmin);
            System.out.println(">>> " + nombre + " restablecido (contraseña, rol y estado): " + emailNormalizado + " <<<");
        }
    }

}