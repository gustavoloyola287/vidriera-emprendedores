package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.service.IEmprendedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprendedores") // Ruta base para todos los endpoints de este controlador
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite que el frontend (React) se conecte sin problemas de CORS
public class EmprendedorController {

    private final IEmprendedorService emprendedorService;

    // 1. OBTENER TODOS LOS EMPRENDEDORES ACTIVOS (para la vidriera pública)
    @GetMapping
    public ResponseEntity<List<Emprendedor>> listarEmprendedoresPublicos() {
        // Solo devuelve los ACTIVOS
        return ResponseEntity.ok(emprendedorService.listarEmprendedoresActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Emprendedor> verPerfilPublico(@PathVariable Long id) {
        // Lanza excepción si está suspendido
        return ResponseEntity.ok(emprendedorService.obtenerPerfilPublico(id));
    }

    // 3. CREAR UN NUEVO EMPRENDEDOR (Alta)
    @PostMapping
    public ResponseEntity<Emprendedor> crear(@RequestBody Emprendedor emprendedor) {
        Emprendedor nuevo = emprendedorService.guardarEmprendedor(emprendedor);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED); // Devuelve status 201 Created
    }

    // 4. ELIMINAR UN EMPRENDEDOR (Baja)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        emprendedorService.eliminarEmprendedor(id);
        return ResponseEntity.noContent().build(); // Devuelve status 204 No Content
    }
}
