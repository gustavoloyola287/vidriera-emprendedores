package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.dto.ProductoDTO;
import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.models.Producto;
import ar.com.vidrieraemprendedores.service.IProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos") // URL base para los productos del catálogo
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Evita problemas de CORS con la app de React
public class ProductoController {

    private final IProductoService productoService;

    // 1. LISTAR TODOS LOS PRODUCTOS DE LA VIDRIERA (Devuelve DTO con fotos de Mongo)
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listarTodos() {
        List<ProductoDTO> lista = productoService.obtenerCatalogoPublico();
        return ResponseEntity.ok(lista);
    }

    // 2. BUSCAR UN PRODUCTO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
        Producto producto = productoService.buscarPorId(id);
        return ResponseEntity.ok(producto);
    }

    // 3. CREAR UN NUEVO PRODUCTO ASOCIADO A EMPRENDEDOR Y CATEGORÍA (JSON plano)
    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        Producto nuevo = productoService.guardarProducto(producto);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    // 4. CREAR UN NUEVO PRODUCTO CON FOTO (Multipart Form-Data)
    @PostMapping(value = "/con-foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearConFoto(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("idCategoria") Long idCategoria,
            @RequestParam("idEmprendedor") Long idEmprendedor,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        try {
            // Nota: Si tenés un método específico en tu Service para procesar foto, llamalo acá.
            // De lo contrario, este mapeo pasa los datos al servicio de guardado:
            Producto nuevoProducto = productoService.guardarProductoConFoto(nombre, descripcion, idCategoria, idEmprendedor, foto);
            return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el producto con foto: " + e.getMessage());
        }
    }

    // 5. ELIMINAR UN PRODUCTO DEL CATÁLOGO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    // Obtener todas las categorías de productos
    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        List<Categoria> categorias = productoService.listarCategorias();
        return ResponseEntity.ok(categorias);
    }

    // Listar productos de un emprendedor específico
    @GetMapping("/emprendedor/{emprendedorId}")
    public ResponseEntity<List<Producto>> listarPorEmprendedor(@PathVariable Long emprendedorId) {
        List<Producto> productos = productoService.listarPorEmprendedor(emprendedorId);
        return ResponseEntity.ok(productos);
    }
}