package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.models.Producto;
import java.util.List;

public interface IProductoService {
    // Listar todos los productos expuestos en la vidriera
    List<Producto> listarProductos();

    // Listar todas las categorías de productos
    List<Categoria> listarCategorias();

    // Listar productos de un emprendedor específico
    List<Producto> listarPorEmprendedor(Long emprendedorId);

    // Buscar un producto específico por su ID
    Producto buscarPorId(Long id);

    // Guardar o actualizar un producto
    Producto guardarProducto(Producto producto);

    // Eliminar un producto del catálogo
    void eliminarProducto(Long id);
}