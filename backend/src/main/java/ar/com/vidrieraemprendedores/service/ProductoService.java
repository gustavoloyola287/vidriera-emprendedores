package ar.com.vidrieraemprendedores.service;

import ar.com.vidrieraemprendedores.dto.ProductoDTO;
import ar.com.vidrieraemprendedores.models.Categoria;
import ar.com.vidrieraemprendedores.models.Emprendedor;
import ar.com.vidrieraemprendedores.models.FotoProducto;
import ar.com.vidrieraemprendedores.models.Producto;
import ar.com.vidrieraemprendedores.repository.CategoriaRepository;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;
import ar.com.vidrieraemprendedores.repository.FotoProductoRepository;
import ar.com.vidrieraemprendedores.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService implements IProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final EmprendedorRepository emprendedorRepository;
    private final FotoProductoRepository fotoProductoRepository;

    @Override
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerCatalogoPublico() {
        List<Producto> productos = productoRepository.findAll();
        return productos.stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    @Override
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public List<Producto> listarPorEmprendedor(Long emprendedorId) {
        return productoRepository.findByEmprendedorId(emprendedorId);
    }

    @Override
    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con el ID: " + id));
    }

    @Override
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Producto guardarProductoConFoto(String nombre, String descripcion, Long idCategoria, Long idEmprendedor, MultipartFile foto) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);

        Categoria cat = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con el ID: " + idCategoria));
        producto.setCategoria(cat);

        Emprendedor emp = emprendedorRepository.findById(idEmprendedor)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado con el ID: " + idEmprendedor));
        producto.setEmprendedor(emp);

        Producto guardado = productoRepository.save(producto);

        if (foto != null && !foto.isEmpty()) {
            try {
                FotoProducto fotoMongo = new FotoProducto();
                fotoMongo.setProductoId(guardado.getId());
                
                String base64 = "data:" + foto.getContentType() + ";base64," + 
                                Base64.getEncoder().encodeToString(foto.getBytes());
                fotoMongo.setImagenBase64(base64);

                fotoProductoRepository.save(fotoMongo);
            } catch (IOException e) {
                throw new RuntimeException("Error al procesar el archivo de imagen", e);
            }
        }

        return guardado;
    }

    @Override
    @Transactional
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Producto no encontrado con el ID: " + id);
        }
        
        fotoProductoRepository.deleteByProductoId(id);
        productoRepository.deleteById(id);
    }

    // --- NUEVAS IMPLEMENTACIONES PARA DASHBOARDS ---

    @Override
    public long contarProductos() {
        return productoRepository.count();
    }

    @Override
    public long contarPendientes() {
        // Asegúrate de definir el método countByEstado("PENDIENTE") en ProductoRepository si manejas el estado allí
        return productoRepository.countByEstado("PENDIENTE");
    }

    @Override
    @Transactional
    public void cambiarEstadoProducto(Long productoId, String nuevoEstado) {
        Producto producto = buscarPorId(productoId);
        producto.setEstado(nuevoEstado);
        productoRepository.save(producto);
    }

    @Override
    public long contarProductosPorEmprendedor(Long emprendedorId) {
        return productoRepository.countByEmprendedorId(emprendedorId);
    }

    @Override
    public boolean perteneceAEmprendedor(Long productoId, Long emprendedorId) {
        Producto producto = buscarPorId(productoId);
        return producto.getEmprendedor() != null && producto.getEmprendedor().getId().equals(emprendedorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerPorEmprendedor(Long emprendedorId) {
        List<Producto> productos = productoRepository.findByEmprendedorId(emprendedorId);
        return productos.stream().map(this::convertirADTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductoDTO crearProductoParaEmprendedor(ProductoDTO productoDTO, Long emprendedorId) {
        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setEstado("PENDIENTE"); // Estado por defecto para revisión

        if (productoDTO.getIdCategoria() != null) {
            Categoria cat = categoriaRepository.findById(productoDTO.getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(cat);
        }

        Emprendedor emp = emprendedorRepository.findById(emprendedorId)
                .orElseThrow(() -> new RuntimeException("Emprendedor no encontrado"));
        producto.setEmprendedor(emp);

        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }

    @Override
    @Transactional
    public ProductoDTO actualizarProducto(Long id, ProductoDTO productoDTO) {
        Producto producto = buscarPorId(id);
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());

        if (productoDTO.getIdCategoria() != null) {
            Categoria cat = categoriaRepository.findById(productoDTO.getIdCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(cat);
        }

        Producto actualizado = productoRepository.save(producto);
        return convertirADTO(actualizado);
    }

    // Helper privado para mapear entidad a DTO incluyendo MongoDB de forma segura
    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());

        if (producto.getEmprendedor() != null) {
            dto.setIdEmprendedor(producto.getEmprendedor().getId());
            dto.setNombreEmprendedor(producto.getEmprendedor().getNombreEmprendimiento());
        }

        if (producto.getCategoria() != null) {
            dto.setIdCategoria(producto.getCategoria().getId());
            dto.setNombreCategoria(producto.getCategoria().getNombre());
        }

        // Bloque defensivo frente a fallos de MongoDB
        try {
            List<FotoProducto> fotosMongo = fotoProductoRepository.findByProductoId(producto.getId());
            dto.setFotos(fotosMongo);

            if (!fotosMongo.isEmpty()) {
                dto.setFotoPrincipal(fotosMongo.get(0));
            }
        } catch (Exception e) {
            System.err.println("Advertencia: No se pudieron cargar las fotos desde MongoDB para el producto " 
                    + producto.getId() + ". Causa: " + e.getMessage());
            
            // Asigna lista vacía para no romper la respuesta JSON
            dto.setFotos(List.of());
            dto.setFotoPrincipal(null);
        }

        return dto;

       
    }
}
