package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.Producto;
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
    
    // ✅ Inyectamos el servicio de productos para manejar el borrado en cascada
    private final IProductoService productoService;

    // ✅ 1. PARA LA VISTA PÚBLICA: Solo emprendedores ACTIVOS
    @Override
    public List<Emprendedor> listarEmprendedoresActivos() {
        return emprendedorRepository.findAll().stream()
                .filter(e -> e.getRol() == Rol.ROLE_EMPRENDEDOR && "ACTIVO".equalsIgnoreCase(e.getEstado()))
                .toList();
    }

    // ✅ 2. PARA EL PANEL DE ADMIN: Todos los emprendedores (para poder reactivarlos)
    @Override
    public List<Emprendedor> listarTodosLosEmprendedores() {
        return emprendedorRepository.findAll().stream()
                .filter(e -> e.getRol() == Rol.ROLE_EMPRENDEDOR)
                .toList();
    }

    // ✅ 3. SEGURIDAD EN EL PERFIL PÚBLICO: Bloquear acceso a perfiles suspendidos
    @Override
    public Emprendedor obtenerPerfilPublico(Long id) {
        Emprendedor emp = emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado"));
        
        if (!"ACTIVO".equalsIgnoreCase(emp.getEstado())) {
            throw new RuntimeException("Este emprendimiento se encuentra temporalmente suspendido o inactivo.");
        }
        return emp;
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
            throw new RuntimeException("La contraseña es obligatoria");
        }
        
        if (emprendedor.getEstado() == null || emprendedor.getEstado().isEmpty()) {
            emprendedor.setEstado("ACTIVO");
        }
        
        return emprendedorRepository.save(emprendedor);
    }

    // Guardar emprendedor sin reencriptar la contraseña (para actualizar datos)
    @Override
    @Transactional
    public Emprendedor guardarEmprendedorSinReencriptar(Emprendedor emprendedor) {
        return emprendedorRepository.save(emprendedor);
    }

    // Actualiza solo el nombre y email. No pasa por guardarEmprendedor para no re-encriptar la contraseña
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

    // ✅ CORREGIDO: Borrado en cascada para evitar productos huérfanos
    @Override
    @Transactional
    public void eliminarEmprendedor(Long id) {
        Emprendedor emprendedor = emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede eliminar. Emprendedor no encontrado con el ID: " + id));

        if (emprendedor.getRol() == Rol.ROLE_SUPER_ADMIN) {
            throw new RuntimeException("No se puede eliminar al Super Administrador");
        }

        // ✅ 1. PRIMERO: Eliminar todos los productos de este emprendedor 
        // (Esto también ejecuta la lógica que borra las fotos asociadas en MongoDB)
        List<Producto> productos = productoService.listarPorEmprendedor(id);
        for (Producto p : productos) {
            productoService.eliminarProducto(p.getId());
        }

        // ✅ 2. DESPUÉS: Eliminar al emprendedor
        emprendedorRepository.deleteById(id);
    }

    // ✅ CORREGIDO: Ahora cuenta SOLO los que tienen rol de emprendedor
    @Override
    public long contarEmprendedores() {
        return emprendedorRepository.countByRol(Rol.ROLE_EMPRENDEDOR);
    }

    // ✅ NUEVO MÉTODO: Listar administradores
    @Override
    public List<Emprendedor> listarAdministradores() {
        return emprendedorRepository.findAll().stream()
                .filter(e -> e.getRol() == Rol.ROLE_ADMIN || e.getRol() == Rol.ROLE_SUPER_ADMIN)
                .toList();
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