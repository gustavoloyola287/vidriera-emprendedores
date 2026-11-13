package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import java.util.List;

public interface IEmprendedorService {
    
    // ✅ 1. Métodos nuevos para separar lógica pública y de administración
    List<Emprendedor> listarEmprendedoresActivos();
    List<Emprendedor> listarTodosLosEmprendedores();
    Emprendedor obtenerPerfilPublico(Long id);

    // ✅ 2. Métodos originales de gestión
    Emprendedor buscarPorId(Long id);
    Emprendedor guardarEmprendedor(Emprendedor emprendedor);
    Emprendedor guardarEmprendedorSinReencriptar(Emprendedor emprendedor);
    Emprendedor actualizarDatosAdministrador(Long id, String nombreCompleto, String email);
    void eliminarEmprendedor(Long id);
    void cambiarEstado(Long id, String nuevoEstado);
    
    // ✅ 3. Métricas y listados específicos
    long contarEmprendedores();
    long contarAdministradores();
    List<Emprendedor> listarAdministradores();
    Emprendedor crearAdministrador(String nombre, String email, String passwordPlano);
}