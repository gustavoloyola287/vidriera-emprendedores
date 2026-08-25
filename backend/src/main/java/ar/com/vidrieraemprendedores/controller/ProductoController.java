package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.models.Producto;
import ar.com.vidrieraemprendedores.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos") // URL base para los productos del catálogo
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Evita problemas de CORS con la app de React
public class ProductoController {

    private final IProductoService productoService;

    // 1. LISTAR TODOS LOS PRODUCTOS DE LA VIDRIERA
    @GetMapping
    public ResponseEntity<List<Producto>> listarTodos() {
        List<Producto> lista = productoService.listarProductos();
        return ResponseEntity.ok(lista);
    }

    // 2. BUSCAR UN PRODUCTO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
        Producto producto = productoService.buscarPorId(id);
        return ResponseEntity.ok(producto);
    }

    // 3. CREAR UN NUEVO PRODUCTO ASOCIADO A EMPRENDEDOR Y CATEGORÍA
    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        Producto nuevo = productoService.guardarProducto(producto);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    // 4. ELIMINAR UN PRODUCTO DEL CATÁLOGO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
