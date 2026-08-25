package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // ⬅️ Lombok genera el constructor para inyectar el repositorio automáticamente
public class EmprendedorService implements IEmprendedorService {

    // Inyectamos el repositorio (usamos final + @RequiredArgsConstructor, que es mejor práctica que @Autowired)
    private final EmprendedorRepository emprendedorRepository;

    @Override
    public List<Emprendedor> listarEmprendedores() {
        return emprendedorRepository.findAll();
    }

    @Override
    public Emprendedor buscarPorId(Long id) {
        // Si no lo encuentra, por ahora lanzamos una excepción básica de runtime
        return emprendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado con el ID: " + id));
    }

    @Override
    public Emprendedor guardarEmprendedor(Emprendedor emprendedor) {
        return emprendedorRepository.save(emprendedor);
    }

    @Override
    public void eliminarEmprendedor(Long id) {
        // Verificamos si existe antes de borrar para evitar errores feos
        if (!emprendedorRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Emprendedor no encontrado con el ID: " + id);
        }
        emprendedorRepository.deleteById(id);
    }
}