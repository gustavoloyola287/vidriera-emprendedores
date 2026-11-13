package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.ReporteModeracion;
import ar.com.vidrieraemprendedores.repository.ReporteModeracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ModeracionService {

    private final ReporteModeracionRepository repository;

    public List<ReporteModeracion> listar(String estado, String tipo) {
        boolean tieneEstado = estado != null && !estado.isBlank() && !"Todos".equalsIgnoreCase(estado);
        boolean tieneTipo   = tipo   != null && !tipo.isBlank()   && !"Todos".equalsIgnoreCase(tipo);

        if (tieneEstado && tieneTipo) {
            return repository.findByEstadoAndTipoOrderByFechaDesc(estado.toUpperCase(), tipo.toUpperCase());
        }
        if (tieneEstado) {
            return repository.findByEstadoOrderByFechaDesc(estado.toUpperCase());
        }
        return repository.findAll();
    }

    public ReporteModeracion aprobar(String id, String adminEmail) {
        return resolver(id, "APROBADO", adminEmail);
    }

    public ReporteModeracion rechazar(String id, String adminEmail) {
        return resolver(id, "RECHAZADO", adminEmail);
    }

    private ReporteModeracion resolver(String id, String nuevoEstado, String adminEmail) {
        ReporteModeracion r = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado: " + id));
        r.setEstado(nuevoEstado);
        r.setResueltoEn(LocalDateTime.now());
        r.setResueltoPor(adminEmail);
        return repository.save(r);
    }

    public Map<String, Long> stats() {
        Map<String, Long> m = new HashMap<>();
        m.put("pendientes", 0L);
        m.put("aprobados", 0L);
        m.put("rechazados", 0L);
        for (var c : repository.contarPorEstado()) {
            switch (c.getEstado()) {
                case "PENDIENTE" -> m.put("pendientes", c.getTotal());
                case "APROBADO"  -> m.put("aprobados", c.getTotal());
                case "RECHAZADO" -> m.put("rechazados", c.getTotal());
            }
        }
        return m;
    }
}