package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
