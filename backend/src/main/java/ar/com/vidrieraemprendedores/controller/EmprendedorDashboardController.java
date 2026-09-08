package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.EmprendedorDashboardStatsDTO;
import ar.com.vidrieraemprendedores.dto.ProductoDTO;
import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprendedor")
@RequiredArgsConstructor
public class EmprendedorDashboardController {

    private final IProductoService productoService;

    // 1. Obtener estadísticas para las tarjetitas superiores del Dashboard
    @GetMapping("/stats")
    public ResponseEntity<EmprendedorDashboardStatsDTO> getStats(@AuthenticationPrincipal Emprendedor emprendedor) {
        long cantidadActual = productoService.contarProductosPorEmprendedor(emprendedor.getId());

        EmprendedorDashboardStatsDTO stats = EmprendedorDashboardStatsDTO.builder()
                .totalProductos(cantidadActual)
                .maxProductosPermitidos(5)
                .visitasTotales(0) 
                .consultasRecibidas(0)
                .consultasSinLeer(0)
                .build();

        return ResponseEntity.ok(stats);
    }

    // 2. Obtener mis productos (del emprendedor autenticado)
    @GetMapping("/mis-productos")
    public ResponseEntity<List<ProductoDTO>> getMisProductos(@AuthenticationPrincipal Emprendedor emprendedor) {
        List<ProductoDTO> productos = productoService.obtenerPorEmprendedor(emprendedor.getId());
        return ResponseEntity.ok(productos);
    }

    // 3. Crear un nuevo producto con la validación de MÁXIMO 5 PRODUCTOS
    @PostMapping("/productos")
    public ResponseEntity<?> crearProducto(
            @AuthenticationPrincipal Emprendedor emprendedor,
            @RequestBody ProductoDTO productoDTO) {

        long cantidadActual = productoService.contarProductosPorEmprendedor(emprendedor.getId());

        if (cantidadActual >= 5) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Límite alcanzado: Un emprendedor no puede publicar más de 5 productos.");
        }

        ProductoDTO nuevoProducto = productoService.crearProductoParaEmprendedor(productoDTO, emprendedor.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    // 4. Modificar un producto propio
    @PutMapping("/productos/{id}")
    public ResponseEntity<?> editarProducto(
            @AuthenticationPrincipal Emprendedor emprendedor,
            @PathVariable Long id,
            @RequestBody ProductoDTO productoDTO) {

        if (!productoService.perteneceAEmprendedor(id, emprendedor.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tenés permiso para modificar este producto.");
        }

        ProductoDTO productoEditado = productoService.actualizarProducto(id, productoDTO);
        return ResponseEntity.ok(productoEditado);
    }

    // 5. Dar de baja (eliminar) un producto propio
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<?> eliminarProducto(
            @AuthenticationPrincipal Emprendedor emprendedor,
            @PathVariable Long id) {

        if (!productoService.perteneceAEmprendedor(id, emprendedor.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tenés permiso para eliminar este producto.");
        }

        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}