package ar.com.vidrieraemprendedores.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ar.com.vidrieraemprendedores.model.Emprendedor;

@Repository
public interface EmprendedorRepository extends JpaRepository<Emprendedor, Long> {
    
 
}
