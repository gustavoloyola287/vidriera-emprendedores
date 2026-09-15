package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data; 
import lombok.NoArgsConstructor;
import ar.com.vidrieraemprendedores.models.FotoProducto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor  

public class ProductoDTO {
    private Long id;
    private String nombre;

    @NotNull(message = "El precio no puede ser nulo")
    @Positive(message = "El precio debe ser un valor positivo")
    private Double precio;

    @Size(max = 250, message = "La descripción no puede superar los 250 caracteres")
    private String descripcion;

    private Long idEmprendedor; // ID del emprendedor al que pertenece el producto
    private String nombreEmprendedor; // Nombre del emprendedor al que pertenece el producto
    private Long idCategoria; // ID de la categoría a la que pertenece el producto
    private String nombreCategoria; // Nombre de la categoría a la que pertenece el producto
    private FotoProducto fotoPrincipal; // La foto principal del producto
    private List<FotoProducto> fotos; // Lista de fotos del producto asociadas de MongoDB
}
