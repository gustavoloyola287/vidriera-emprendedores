package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.models.ReporteModeracion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteModeracionRepository extends MongoRepository<ReporteModeracion, String> {

    // Consultas derivadas (sin SQL)
    List<ReporteModeracion> findByEstadoOrderByFechaDesc(String estado);
    List<ReporteModeracion> findByEstadoAndTipoOrderByFechaDesc(String estado, String tipo);

    // Métricas con agregación (COUNT por estado)
    @Query(value = "{ $group: { _id: '$estado', total: { $sum: 1 } } }",
           fields = "{ _id: 0, estado: '$_id', total: 1 }")
    List<EstadoCount> contarPorEstado();

    interface EstadoCount {
        String getEstado();
        long getTotal();
    }
}
