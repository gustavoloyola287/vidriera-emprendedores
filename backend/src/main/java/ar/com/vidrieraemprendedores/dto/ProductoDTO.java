package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data; 
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor  

public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String urlImagen; // Para mostrar la foto en la vidriera
    private Long idEmprendedor; // ID del emprendedor al que pertenece el producto
    private Long idCategoria; // ID de la categoría a la que pertenece el producto
    
}
