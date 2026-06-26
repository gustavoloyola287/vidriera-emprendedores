package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.model.Emprendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmprendedorRepository extends JpaRepository<Emprendedor, Long> {
    // JpaRepository ya te da por defecto: save(), findById(), findAll(), deleteById(), etc.
}