package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data; 
import lombok.NoArgsConstructor;
import ar.com.vidrieraemprendedores.models.FotoProducto;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor  

public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String urlImagen; // Para mostrar la foto en la vidriera
    private Long idEmprendedor; // ID del emprendedor al que pertenece el producto
    private String nombreEmprendedor; // Nombre del emprendedor al que pertenece el producto
    private Long idCategoria; // ID de la categoría a la que pertenece el producto
    private String nombreCategoria; // Nombre de la categoría a la que pertenece el producto
    private FotoProducto fotoPrincipal; // La foto principal del producto
    private List<FotoProducto> fotos; // Lista de fotos del producto asociadas de MongoDB

}
