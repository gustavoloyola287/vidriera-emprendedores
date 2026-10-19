package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.CrearProductoDTO; 
import ar.com.vidrieraemprendedores.dto.ProductoDTO;
import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.models.Producto;
import ar.com.vidrieraemprendedores.service.IProductoService;
import jakarta.validation.Valid; 
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final IProductoService productoService;

    @GetMapping("/destacados")
    public ResponseEntity<List<ProductoDTO>> listarDestacados() {
        List<ProductoDTO> lista = productoService.obtenerCatalogoPublico();
        return ResponseEntity.ok(lista);
    }

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listarTodos() {
        List<ProductoDTO> lista = productoService.obtenerCatalogoPublico();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
        Producto producto = productoService.buscarPorId(id);
        return ResponseEntity.ok(producto);
    }

    // ✅ MODIFICADO: Ahora recibe el DTO y valida los datos
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody @Valid CrearProductoDTO dto) {
        try {
            Producto nuevo = productoService.crearProductoDesdeDTO(dto);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Esto devolverá un error 400 con el mensaje exacto (ej: "Categoría no encontrada")
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado al crear el producto: " + e.getMessage());
        }
    }

    @PostMapping(value = "/con-foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearConFoto(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("idCategoria") Long idCategoria,
            @RequestParam("idEmprendedor") Long idEmprendedor,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        try {
            Producto nuevoProducto = productoService.guardarProductoConFoto(nombre, descripcion, idCategoria, idEmprendedor, foto);
            return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el producto con foto: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        List<Categoria> categorias = productoService.listarCategorias();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/emprendedor/{emprendedorId}")
    public ResponseEntity<List<Producto>> listarPorEmprendedor(@PathVariable Long emprendedorId) {
        List<Producto> productos = productoService.listarPorEmprendedor(emprendedorId);
        return ResponseEntity.ok(productos);
    }
}