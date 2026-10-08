package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.Rol;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmprendedorService implements IEmprendedorService {

    private final EmprendedorRepository emprendedorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<Emprendedor> listarEmprendedores() {
        return emprendedorRepository.findAll();
    }

    @Override
    public Emprendedor buscarPorId(Long id) {
        return emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado con el ID: " + id));
    }

    @Override
    public Emprendedor guardarEmprendedor(Emprendedor emprendedor) {
        return emprendedorRepository.save(emprendedor);
    }

    @Override
    public void eliminarEmprendedor(Long id) {
        if (!emprendedorRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Emprendedor no encontrado con el ID: " + id);
        }
        emprendedorRepository.deleteById(id);
    }

    // ✅ CORREGIDO: Ahora cuenta SOLO los que tienen rol de emprendedor
    @Override
    public long contarEmprendedores() {
        return emprendedorRepository.countByRol(Rol.ROLE_EMPRENDEDOR);
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, String nuevoEstado) {
        Emprendedor emprendedor = emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado con el ID: " + id));

        emprendedor.setEstado(nuevoEstado);
        emprendedorRepository.save(emprendedor);
    }

    // Método para que el Super Admin cree un nuevo Admin 
    @Override
    @Transactional
    public Emprendedor crearAdministrador(String nombre, String email, String passwordPlano) {
        if (emprendedorRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Ya existe un usuario registrado con el email: " + email);
        }

        Emprendedor nuevoAdmin = new Emprendedor();
        nuevoAdmin.setNombreCompleto(nombre);
        nuevoAdmin.setEmail(email);
        nuevoAdmin.setPassword(passwordEncoder.encode(passwordPlano));
        nuevoAdmin.setRol(Rol.ROLE_ADMIN);
        nuevoAdmin.setEstado("ACTIVO");

        return emprendedorRepository.save(nuevoAdmin);
    }

    @Override
    public long contarAdministradores() {
        return emprendedorRepository.countByRol(Rol.ROLE_ADMIN);
    }
}