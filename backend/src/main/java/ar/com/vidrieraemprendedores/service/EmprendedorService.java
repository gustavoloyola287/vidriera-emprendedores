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
        //Los administradores no aparecen en ningun listado
        return emprendedorRepository.findAll().stream()
                .filter(e -> e.getRol() == Rol.ROLE_EMPRENDEDOR)
                .toList();
    }

    @Override
    public Emprendedor buscarPorId(Long id) {
        return emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado con el ID: " + id));
    }

    @Override
    public Emprendedor guardarEmprendedor(Emprendedor emprendedor) {
         if (emprendedor.getPassword() != null && !emprendedor.getPassword().isEmpty()) {
            emprendedor.setPassword(passwordEncoder.encode(emprendedor.getPassword()));
        } else {
            // Si no viene contraseña, poner una por defecto o lanzar error
            throw new RuntimeException("La contraseña es obligatoria");
        }
        
        // Asegurar que tenga un estado por defecto
        if (emprendedor.getEstado() == null || emprendedor.getEstado().isEmpty()) {
            emprendedor.setEstado("ACTIVO");
        }
        
        return emprendedorRepository.save(emprendedor);
    }

    //Actualiza solo el nombre y email. No pasa por guardadrEmprendedor para no re-encriptar 
    //la contraseña
    @Override
    @Transactional
    public Emprendedor actualizarDatosAdministrador(Long id, String nombreCompleto, String email) {
        Emprendedor admin = emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado con el ID: " + id));

        if (nombreCompleto == null || nombreCompleto.isBlank() || email == null || email.isBlank()) {
            throw new RuntimeException("El nombre y el email son obligatorios");
        }

        String emailNormalizado = email.trim().toLowerCase();
        emprendedorRepository.findByEmail(emailNormalizado).ifPresent(otro -> {
            if (!otro.getId().equals(id)) {
                throw new RuntimeException("Ya existe un usuario registrado con el email: " + emailNormalizado);
            }
        });

        admin.setNombreCompleto(nombreCompleto.trim());
        admin.setEmail(emailNormalizado);
        return emprendedorRepository.save(admin);
    }

    @Override
    public void eliminarEmprendedor(Long id) {
        Emprendedor emprendedor = emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede eliminar. Emprendedor no encontrado con el ID: " + id));

        if (emprendedor.getRol() == Rol.ROLE_SUPER_ADMIN) {
            throw new RuntimeException("No se puede eliminar al Super Administrador");
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