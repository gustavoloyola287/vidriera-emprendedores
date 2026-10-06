package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.CrearAdminDTO;
import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    private final AuthService authService;

    public SuperAdminController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/crear-admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> crearAdmin(@Valid @RequestBody CrearAdminDTO dto) {
        try {
            // ✅ Llamamos al método corregido del AuthService
            Emprendedor nuevoAdmin = authService.crearAdministrador(
                dto.getNombre(),
                dto.getEmail(),
                dto.getPassword()
            );
            
            // ✅ Devolvemos la respuesta con los datos del admin creado
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Administrador creado exitosamente",
                "adminId", nuevoAdmin.getId(),
                "email", nuevoAdmin.getEmail(),
                "rol", nuevoAdmin.getRol().name()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}
