package ar.com.vidrieraemprendedores.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ar.com.vidrieraemprendedores.model.Emprendedor;

public interface EmprendedorRepository extends JpaRepository<Emprendedor, Long> {

}
