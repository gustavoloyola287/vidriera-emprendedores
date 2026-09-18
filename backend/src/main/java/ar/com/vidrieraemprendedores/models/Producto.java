package ar.com.vidrieraemprendedores.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
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