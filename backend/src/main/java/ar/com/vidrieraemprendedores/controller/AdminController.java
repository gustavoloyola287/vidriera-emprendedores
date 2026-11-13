package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.AdminDashboardStatsDTO;
import ar.com.vidrieraemprendedores.dto.CrearAdminDTO;
import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.Rol;
import ar.com.vidrieraemprendedores.service.IEmprendedorService;
import ar.com.vidrieraemprendedores.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final IEmprendedorService emprendedorService;
    private final IProductoService productoService;

    // 1. Métricas generales
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();
        stats.setTotalEmprendedores(emprendedorService.contarEmprendedores());
        stats.setTotalProductos(productoService.contarProductos());
        stats.setProductosPendientes(0);
        stats.setEmprendedoresActivos(0);
        stats.setEmprendedoresSuspendidos(0);
        stats.setEmprendedoresRechazados(0);
        stats.setTotalAdmins(emprendedorService.contarAdministradores());
        return ResponseEntity.ok(stats);
    }

    // 2. Cambio de estado de Emprendedor (suspender / activar)
    @PutMapping("/emprendedores/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoEmprendedor(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        emprendedorService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(Map.of("message", "Estado actualizado correctamente"));
    }

    // 3. Eliminar emprendedor
    @DeleteMapping("/emprendedores/{id}")
    public ResponseEntity<Map<String, String>> eliminarEmprendedor(@PathVariable Long id) {
        try {
            emprendedorService.eliminarEmprendedor(id);
            return ResponseEntity.ok(Map.of("message", "Emprendedor eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 4. Actualizar datos de un emprendedor desde el panel de administración
    @PutMapping("/emprendedores/{id}")
    public ResponseEntity<Map<String, String>> actualizarEmprendedor(
            @PathVariable Long id,
            @RequestBody Map<String, String> datos) {
        try {
            Emprendedor emprendedor = emprendedorService.buscarPorId(id);
            if (datos.get("nombreCompleto") != null && !datos.get("nombreCompleto").isBlank()) {
                emprendedor.setNombreCompleto(datos.get("nombreCompleto").trim());
            }
            if (datos.get("email") != null && !datos.get("email").isBlank()) {
                emprendedor.setEmail(datos.get("email").trim().toLowerCase());
            }
            if (datos.get("telefono") != null) {
                emprendedor.setTelefono(datos.get("telefono"));
            }
            emprendedorService.guardarEmprendedorSinReencriptar(emprendedor);
            return ResponseEntity.ok(Map.of("message", "Emprendedor actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 5. Moderación de Productos (aprobar / rechazar)
    @PutMapping("/productos/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoProducto(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        productoService.cambiarEstadoProducto(id, nuevoEstado);
        return ResponseEntity.ok(Map.of("message", "Estado actualizado correctamente"));
    }

    // 6. Crear emprendedor
    @PostMapping("/emprendedores")
    public ResponseEntity<?> crearEmprendedor(@RequestBody Emprendedor emprendedor) {
        try {
            emprendedor.setRol(Rol.ROLE_EMPRENDEDOR);
            if (emprendedor.getEstado() == null || emprendedor.getEstado().isEmpty()) {
                emprendedor.setEstado("ACTIVO");
            }
            Emprendedor guardado = emprendedorService.guardarEmprendedor(emprendedor);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Emprendedor registrado exitosamente",
                "id", guardado.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    // 7. Crear administrador
    @PostMapping("/crear-admin")
    public ResponseEntity<?> crearAdministrador(@RequestBody CrearAdminDTO crearAdminDTO) {
        try {
            Emprendedor nuevoAdmin = emprendedorService.crearAdministrador(
                crearAdminDTO.getNombre(),
                crearAdminDTO.getEmail(),
                crearAdminDTO.getPassword()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Administrador creado exitosamente",
                "adminId", nuevoAdmin.getId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 8. Cambiar estado de admin
    @PutMapping("/admins/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoAdmin(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        emprendedorService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(Map.of("message", "Estado del administrador actualizado"));
    }

    // 9. Listar administradores
    @GetMapping("/listar-admins")
    public ResponseEntity<List<Emprendedor>> listarAdministradores() {
        List<Emprendedor> admins = emprendedorService.listarAdministradores();
        return ResponseEntity.ok(admins);
    }

    // 10. Eliminar administrador
    @DeleteMapping("/eliminar-admin/{id}")
    public ResponseEntity<Map<String, String>> eliminarAdmin(@PathVariable Long id) {
        try {
            emprendedorService.eliminarEmprendedor(id);
            return ResponseEntity.ok(Map.of("message", "Administrador eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 11. Actualizar administrador
    @PutMapping("/admins/{id}")
    public ResponseEntity<Map<String, String>> actualizarAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> datos) {
        try {
            emprendedorService.actualizarDatosAdministrador(id, datos.get("nombreCompleto"), datos.get("email"));
            return ResponseEntity.ok(Map.of("message", "Administrador actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 13. Notificaciones (placeholder)
    @GetMapping("/notificaciones")
    public ResponseEntity<List<?>> getNotificaciones() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    // 14. Marcar notificaciones como leídas (placeholder)
    @PutMapping("/notificaciones/marcar-leidas")
    public ResponseEntity<Map<String, String>> marcarLeidas() {
        return ResponseEntity.ok(Map.of("message", "OK"));
    }

    // Endpoint para que el admin vea TODOS (incluyendo suspendidos)
    @GetMapping("/emprendedores/todos")
    public ResponseEntity<List<Emprendedor>> listarTodosParaAdmin() {
        return ResponseEntity.ok(emprendedorService.listarTodosLosEmprendedores());
    }
}