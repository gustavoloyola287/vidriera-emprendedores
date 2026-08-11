package ar.com.vidrieraemprendedores.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
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

@Column(nullable = false, columnDefinition = "VARCHAR(255) DEFAULT '12345678'")
private String password;

@Enumerated(EnumType.STRING)
private Rol rol;

@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(
            new SimpleGrantedAuthority(
                    rol != null ? rol.name() : Rol.ROLE_EMPRENDEDOR.name()
            )
    );
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
    return true;
}


}
