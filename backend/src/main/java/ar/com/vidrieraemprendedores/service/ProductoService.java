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

        return productos.stream().map(producto -> {
            ProductoDTO dto = new ProductoDTO();
            dto.setId(producto.getId());
            dto.setNombre(producto.getNombre());
            dto.setDescripcion(producto.getDescripcion());
            
            // Mapeo de Emprendedor desde Postgres
            if (producto.getEmprendedor() != null) {
                dto.setIdEmprendedor(producto.getEmprendedor().getId());
                dto.setNombreEmprendedor(producto.getEmprendedor().getNombreEmprendimiento());
            }

            // Mapeo de Categoría desde Postgres
            if (producto.getCategoria() != null) {
                dto.setIdCategoria(producto.getCategoria().getId());
                dto.setNombreCategoria(producto.getCategoria().getNombre());
            }

            // Integración con MongoDB: buscar las fotos asociadas al ID del producto
            List<FotoProducto> fotosMongo = fotoProductoRepository.findByProductoId(producto.getId());
            dto.setFotos(fotosMongo);

            // Asignación de la foto principal si existen fotos en Mongo
            if (!fotosMongo.isEmpty()) {
                dto.setFotoPrincipal(fotosMongo.get(0));
            }

            return dto;
        }).collect(Collectors.toList());
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
        
        // Limpieza: al borrar de PostgreSQL, eliminamos sus fotos en MongoDB
        fotoProductoRepository.deleteByProductoId(id);
        
        productoRepository.deleteById(id);
    }
}