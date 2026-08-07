package ar.com.vidrieraemprendedores.model;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emprendedores") 
@Data // Genera getters, setters detras de escena cuando se compila el proyecto
@NoArgsConstructor 
@AllArgsConstructor 

public class Emprendedor implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID Autoincremental
    private Long id;

    private String nombreCompleto;
    private String nombreEmprendimiento;
    private String descripcion;

    @Column(unique = true, nullable = false)    // Unico y obligatorio
    private String email;

    private String telefono;

   
    //-- Campos para la seguridad de la aplicacion (Spring Security) --//
    @Column(nullable = false)    // Obligatorio
    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    //-- Implementacion de metodos de la interfaz UserDetails --//
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(rol != null ? rol.name() : "ROLE_EMPRENDEDOR"));
    }

    @Override
    public String getUsername() {
        return this.email;     /// El email es el username para Spring Security
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;    // La cuenta nunca expira
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;    // La cuenta nunca se bloquea
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;    // Las credenciales nunca expiran
    }

    @Override
    public boolean isEnabled() {
        return true;    // La cuenta siempre esta habilitada
    }
    


    
}