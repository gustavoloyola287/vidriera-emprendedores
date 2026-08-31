package ar.com.vidrieraemprendedores.controller;


import ar.com.vidrieraemprendedores.models.FotoProducto;
import ar.com.vidrieraemprendedores.repository.FotoProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fotos")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FotoController {

 
    private final FotoProductoRepository fotoRepository;

    @PostMapping
    public ResponseEntity<FotoProducto> guardarFoto(@RequestBody FotoProducto foto) {
        FotoProducto nuevaFoto = fotoRepository.save(foto);
        return ResponseEntity.ok(nuevaFoto);
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<FotoProducto>> obtenerPorProducto(@PathVariable Long productoId) {
        List<FotoProducto> fotos = fotoRepository.findByProductoId(productoId);
        return ResponseEntity.ok(fotos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFoto(@PathVariable String id) {
        fotoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
