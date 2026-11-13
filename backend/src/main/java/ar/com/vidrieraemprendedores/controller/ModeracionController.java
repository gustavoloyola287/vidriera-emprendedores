package ar.com.vidrieraemprendedores.controller;

import ar.com.vidrieraemprendedores.models.ReporteModeracion;
import ar.com.vidrieraemprendedores.service.ModeracionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/moderacion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ModeracionController {

    private final ModeracionService moderacionService;

    @GetMapping
    public ResponseEntity<List<ReporteModeracion>> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(moderacionService.listar(estado, tipo));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        return ResponseEntity.ok(moderacionService.stats());
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<ReporteModeracion> aprobar(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(moderacionService.aprobar(id, auth.getName()));
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<ReporteModeracion> rechazar(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(moderacionService.rechazar(id, auth.getName()));
    }
}