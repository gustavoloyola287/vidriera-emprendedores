package ar.com.vidrieraemprendedores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearProductoDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @PositiveOrZero(message = "El precio debe ser mayor o igual a 0")
    @NotNull(message = "El precio es obligatorio")
    private Double precio;

    private String imagenUrl; // El frontend envía el Base64 o URL como String

    @NotNull(message = "El ID de la categoría es obligatorio")
    private Long categoriaId;

    @NotNull(message = "El ID del emprendedor es obligatorio")
    private Long emprendedorId;
}