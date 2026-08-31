package ar.com.vidrieraemprendedores.repository;


import ar.com.vidrieraemprendedores.models.FotoProducto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface FotoProductoRepository extends MongoRepository<FotoProducto, String> {
    List<FotoProducto> findByProductoId(Long productoId);
    void deleteByProductoId(Long productoId);
}