package ar.com.vidrieraemprendedores.repository;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface EmprendedorRepository extends JpaRepository<Emprendedor, Long> {
    // JpaRepository ya te da por defecto: save(), findById(), findAll(), deleteById(), etc.

    // Método para buscar un emprendedor por su email   
    Optional <Emprendedor> findByEmail(String email);

    // Método para buscar un emprendedor por su token de recuperación de contraseña
    Optional <Emprendedor> findByResetPasswordToken(String token);
}