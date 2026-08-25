package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
