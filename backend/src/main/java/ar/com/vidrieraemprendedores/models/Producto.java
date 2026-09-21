package ar.com.vidrieraemprendedores.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(length = 250) // Limitar la longitud de la descripción a 250 caracteres
    private String descripcion;

    private String urlImagen; // Para mostrar la foto en la vidriera

    @Column(nullable = true)
    private Double precio;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    @Column(name = "estado", nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'DISPONIBLE'")
    private String estado; // Para indicar si el producto está disponible o no

    // Relación: Muchos productos pertenecen a un mismo Emprendedor
    @ManyToOne
    @JoinColumn(name = "emprendedor_id", nullable = false)
    private Emprendedor emprendedor;

    // Relación: Muchos productos pertenecen a una Categoría
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    

}