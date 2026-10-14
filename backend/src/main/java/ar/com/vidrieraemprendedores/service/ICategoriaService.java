package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Categoria;
import java.util.List;

public interface ICategoriaService {
    // Listar todas las categorías
    List<Categoria> listarCategorias();

    // Buscar una categoría por ID
    Categoria buscarPorId(Long id);

    // Guardar o actualizar una categoría
    Categoria guardarCategoria(Categoria categoria);

    // Actualizar una categoría existente
    Categoria actualizarCategoria(Long id, Categoria categoriaActualizada);

    // Eliminar una categoría por ID
    void eliminarCategoria(Long id);
}
