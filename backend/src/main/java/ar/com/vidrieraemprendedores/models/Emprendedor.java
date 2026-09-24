package ar.com.vidrieraemprendedores.models;

import java.util.Collection;
import java.util.List;
import java.time.LocalDateTime;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emprendedores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Emprendedor implements UserDetails {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCompleto;
    private String nombreEmprendimiento;
    private String descripcion;

    @Column(unique = true, nullable = false)
    private String email;

    private String telefono;

    @Column(nullable = false)
    private String password = "defaultPassword"; // Valor por defecto

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @Column (name = "estado", nullable = false, length = 50)
    private String estado = "PENDIENTE"; // Pendiente, Activo, Suspendido

    // Recuperacion de contraseña
    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiration")
    private LocalDateTime resetPasswordTokenExpiry;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = "PENDIENTE";
        }
        
        if (this.rol == null) {
            this.rol = Rol.ROLE_EMPRENDEDOR; // Asigna el rol por defecto si no se proporciona      
        }
    }
      

    @OneToOne 
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; 


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Asigna la autoridad según el enum guardado (ROLE_SUPER_ADMIN, ROLE_ADMIN o ROLE_EMPRENDEDOR)
        String rolNombre = (this.rol != null) ? this.rol.name() : Rol.ROLE_EMPRENDEDOR.name();
        return List.of(new SimpleGrantedAuthority(rolNombre));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Opcional: si queres que solo los usuarios activos puedan iniciar sesión, podes cambiar esto a:
        // return "ACTIVO".equalsIgnoreCase(this.estado);
        return true;
    }


}
