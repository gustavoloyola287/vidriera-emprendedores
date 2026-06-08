package ar.com.vidrieraemprendedores.model;

import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;


@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor

public class Emprendedor { 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String nombre;
    
    private String descripcion;
    
    private String imagenUrl;
    
    private String contacto;
    
    private String redesSociales;
    
    private Boolean activo;

}
