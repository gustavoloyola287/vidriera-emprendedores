package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor // Lombok genera el constructor para inyectar el repositorio
public class CategoriaService implements ICategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con el ID: " + id));
    }

    @Override
    @Transactional
    public Categoria guardarCategoria(Categoria categoria) {
        if (categoriaRepository.existsByNombreIgnoreCase(categoria.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + categoria.getNombre());
        }

        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional
    public Categoria actualizarCategoria(Long id, Categoria categoriaActualizada) {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con el ID: " + id));

        // Verificar si el nombre actualizado ya existe en otra categoría
        if (!categoriaExistente.getNombre().equalsIgnoreCase(categoriaActualizada.getNombre()) &&
                categoriaRepository.existsByNombreIgnoreCase(categoriaActualizada.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + categoriaActualizada.getNombre());
        }

        // Actualizar los campos de la categoría existente
        categoriaExistente.setNombre(categoriaActualizada.getNombre());
        categoriaExistente.setDescripcion(categoriaActualizada.getDescripcion());

        return categoriaRepository.save(categoriaExistente);
    }

    @Override
    public void eliminarCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Categoría no encontrada con el ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}