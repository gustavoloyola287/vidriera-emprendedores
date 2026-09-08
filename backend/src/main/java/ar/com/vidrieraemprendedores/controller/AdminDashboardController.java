package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.AdminDashboardStatsDTO;
import ar.com.vidrieraemprendedores.service.IEmprendedorService;
import ar.com.vidrieraemprendedores.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final IEmprendedorService emprendedorService;
    private final IProductoService productoService;

    // 1. Métricas generales para las tarjetas superiores (devuelve el DTO tipado)
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        AdminDashboardStatsDTO stats = AdminDashboardStatsDTO.builder()
                .totalEmprendedores(emprendedorService.contarEmprendedores())
                .totalProductos(productoService.contarProductos())
                .productosPendientes(productoService.contarPendientes())
                .build();

        return ResponseEntity.ok(stats);
    }

    // 2. Cambio de estado de Emprendedor (Aprobar, Suspender, Rechazar)
    @PutMapping("/emprendedores/{id}/estado")
    public ResponseEntity<Void> cambiarEstadoEmprendedor(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) { // "ACTIVO", "SUSPENDIDO", "RECHAZADO"
        emprendedorService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok().build();
    }

    // 3. Moderación de Productos (Aprobar o Rechazar)
    @PutMapping("/productos/{id}/estado")
    public ResponseEntity<Void> cambiarEstadoProducto(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) { // "APROBADO", "RECHAZADO"
        productoService.cambiarEstadoProducto(id, nuevoEstado);
        return ResponseEntity.ok().build();
    }
}