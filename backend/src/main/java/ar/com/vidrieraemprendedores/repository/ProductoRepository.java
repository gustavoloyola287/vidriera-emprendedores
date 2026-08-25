package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductoRepository extends JpaRepository<Producto, Long> {
}