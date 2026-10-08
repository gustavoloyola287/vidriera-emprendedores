package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import java.util.List;

public interface IEmprendedorService {
    // Traer todos los emprendedores
    List<Emprendedor> listarEmprendedores();

    // Buscar uno solo por su ID
    Emprendedor buscarPorId(Long id);

    Emprendedor crearAdministrador(String nombre, String email, String passwordPlano);

    // Guardar o crear un nuevo emprendedor
    Emprendedor guardarEmprendedor(Emprendedor emprendedor);

    // Eliminar un emprendedor por su ID
    void eliminarEmprendedor(Long id);


    void cambiarEstado(Long id, String nuevoEstado);

       // Contar la cantidad de emprendedores  
    long contarEmprendedores();

    long contarAdministradores();
}