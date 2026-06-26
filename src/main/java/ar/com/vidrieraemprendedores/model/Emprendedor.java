package ar.com.vidrieraemprendedores.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emprendedores") 
@Data // Genera getters, setters detras de escena cuando se compila el proyecto
@NoArgsConstructor 
@AllArgsConstructor 
public class Emprendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID Autoincremental
    private Long id;

    private String nombreCompleto;
    private String nombreEmprendimiento;
    private String descripcion;
    private String email;
    private String telefono;

    

    
}