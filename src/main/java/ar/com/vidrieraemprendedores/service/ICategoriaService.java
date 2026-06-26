package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.model.Categoria;
import java.util.List;

public interface ICategoriaService {
    // Listar todas las categorías
    List<Categoria> listarCategorias();

    // Buscar una categoría por ID
    Categoria buscarPorId(Long id);

    // Guardar o actualizar una categoría
    Categoria guardarCategoria(Categoria categoria);

    // Eliminar una categoría por ID
    void eliminarCategoria(Long id);
}
