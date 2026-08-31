package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.dto.ProductoDTO;
import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.models.Producto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface IProductoService {
    // Listar todos los productos expuestos en la vidriera
    List<Producto> listarProductos();

    // Obtener el catálogo público de productos con fotos integradas desde MongoDB
    List<ProductoDTO> obtenerCatalogoPublico();

    // Listar todas las categorías de productos
    List<Categoria> listarCategorias();

    // Listar productos de un emprendedor específico
    List<Producto> listarPorEmprendedor(Long emprendedorId);

    // Buscar un producto específico por su ID
    Producto buscarPorId(Long id);

    // Guardar o actualizar un producto
    Producto guardarProducto(Producto producto);

    // Guardar o actualizar un producto con foto
    Producto guardarProductoConFoto(String nombre, String descripcion, Long idCategoria, Long emprendedorId, MultipartFile foto);

    // Eliminar un producto del catálogo
    void eliminarProducto(Long id);
}