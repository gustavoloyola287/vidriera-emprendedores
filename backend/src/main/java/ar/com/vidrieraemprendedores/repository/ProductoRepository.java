package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByEmprendedorId(Long emprendedorId);
}