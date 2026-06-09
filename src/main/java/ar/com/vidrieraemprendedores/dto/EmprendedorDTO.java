package ar.com.vidrieraemprendedores.dto;

import lombok.NoArgsConstructor;
import lombok.Getter;   
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EmprendedorDTO {
    private Long id;
    private String nombre;  
    private String descripcion;
    private String imagenUrl;
    private String contacto;
    private String redesSociales;

}
