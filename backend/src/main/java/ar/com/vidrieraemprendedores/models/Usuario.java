package ar.com.vidrieraemprendedores.models;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol; // ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_EMPRENDEDOR

    // Relación opcional: Solo los usuarios con rol ROLE_EMPRENDEDOR tendrán un perfil asociado
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Emprendedor emprendedor;
}