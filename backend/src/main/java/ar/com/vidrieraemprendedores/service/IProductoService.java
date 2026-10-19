package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.dto.CrearProductoDTO; 
import ar.com.vidrieraemprendedores.dto.ProductoDTO;
import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.models.Producto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface IProductoService {
    List<Producto> listarProductos();
    List<ProductoDTO> obtenerCatalogoPublico();
    List<Categoria> listarCategorias();
    List<Producto> listarPorEmprendedor(Long emprendedorId);
    Producto buscarPorId(Long id);
    Producto guardarProducto(Producto producto);
    Producto guardarProductoConFoto(String nombre, String descripcion, Long idCategoria, Long emprendedorId, MultipartFile foto);
    void eliminarProducto(Long id);
    
    long contarProductos();
    long contarPendientes();
    void cambiarEstadoProducto(Long productoId, String nuevoEstado);
    long contarProductosPorEmprendedor(Long emprendedorId);
    boolean perteneceAEmprendedor(Long productoId, Long emprendedorId);
    List<ProductoDTO> obtenerPorEmprendedor(Long emprendedorId);
    ProductoDTO actualizarProducto(Long id, ProductoDTO productoDTO);
    ProductoDTO crearProductoParaEmprendedor(ProductoDTO productoDTO, Long emprendedorId);

    // ✅ NUEVO MÉTODO AGREGADO
    Producto crearProductoDesdeDTO(CrearProductoDTO dto);
}