package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String nombreCompleto;
    private String nombreEmprendimiento;
    private String descripcion;
    private String email;
    private String telefono;
    private String password;
}
