package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}