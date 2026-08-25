package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.service.ICategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias") // URL base para las categorías
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Clave para evitar problemas de CORS con React
public class CategoriaController {

    private final ICategoriaService categoriaService;

    // 1. LISTAR TODAS LAS CATEGORÍAS
    @GetMapping
    public ResponseEntity<List<Categoria>> listarTodas() {
        List<Categoria> lista = categoriaService.listarCategorias();
        return ResponseEntity.ok(lista);
    }

    // 2. BUSCAR CATEGORÍA POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarPorId(@PathVariable Long id) {
        Categoria categoria = categoriaService.buscarPorId(id);
        return ResponseEntity.ok(categoria);
    }

    // 3. CREAR UNA NUEVA CATEGORÍA
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria nueva = categoriaService.guardarCategoria(categoria);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    // 4. ELIMINAR UNA CATEGORÍA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}