package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmprendedorDTO {
    private Long id;
    private String nombreCompleto;
    private String nombreEmprendimiento;
    private String descripcion;
    private String email;
    private String telefono;
    private String urlImagen; // Para mostrar la foto en la vidriera    

    
}
