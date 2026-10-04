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
        stats.setTotalEmprendedores(0);
        stats.setTotalProductos(0);
        stats.setProductosPendientes(0);
        stats.setEmprendedoresActivos(0);
        stats.setEmprendedoresSuspendidos(0);
        stats.setEmprendedoresRechazados(0);
        stats.setTotalAdmins(0);
        return ResponseEntity.ok(stats);
    }

    // 2. Cambio de estado de Emprendedor
    @PutMapping("/emprendedores/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoEmprendedor(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        emprendedorService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(Map.of("message", "Estado actualizado correctamente"));
    }

    // 3. Moderación de Productos
    @PutMapping("/productos/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoProducto(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        productoService.cambiarEstadoProducto(id, nuevoEstado);
        return ResponseEntity.ok(Map.of("message", "Estado actualizado correctamente"));
    }

    // 4. Crear emprendedor
    @PostMapping("/emprendedores")
    public ResponseEntity<?> crearEmprendedorManual(@RequestBody Emprendedor emprendedor) {
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
            return ResponseEntity.badRequest().body(Map.of("message", "Error al registrar: " + e.getMessage()));
        }
    }

    // 5. Crear administrador (Solo Super Admin)
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

    // 6. Cambiar estado de admin
    @PutMapping("/admins/{id}/estado")
    public ResponseEntity<Map<String, String>> cambiarEstadoAdmin(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        emprendedorService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(Map.of("message", "Estado del administrador actualizado"));
    }

    // ==========================================
    // ✅ ENDPOINTS NUEVOS (Para evitar errores)
    // ==========================================

    // 7. Moderación reciente (devuelve lista vacía)
    @GetMapping("/moderacion/reciente")
    public ResponseEntity<List<?>> getModeracionReciente() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    // 8. Notificaciones (devuelve lista vacía)
    @GetMapping("/notificaciones")
    public ResponseEntity<List<?>> getNotificaciones() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    // 9. Marcar notificaciones como leídas
    @PutMapping("/notificaciones/marcar-leidas")
    public ResponseEntity<Map<String, String>> marcarLeidas() {
        return ResponseEntity.ok(Map.of("message", "OK"));
    }
}