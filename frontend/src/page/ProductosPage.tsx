import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../services/productoService';
import type { Producto, Categoria } from '../types/Producto';

export const ProductosPage = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Formulario de nuevo producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoria, setIdCategoria] = useState<number | ''>('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  // Identidad del Emprendedor (Sin fallbacks hardcodeados como 1)
  const [nombreEmprendedor, setNombreEmprendedor] = useState('');
  const [emprendedorId, setEmprendedorId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Obtener Token y Datos del Emprendedor
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombreEmprendedor') || localStorage.getItem('nombreCompleto');
    
    // Intentar leer ID de distintos nombres de clave comunes
    const idGuardado = localStorage.getItem('emprendedorId') 
      || localStorage.getItem('idEmprendedor') 
      || localStorage.getItem('userId');

    if (!token && !idGuardado) {
      alert('Tu sesión ha expirado o no estás autenticado.');
      navigate('/login');
      return;
    }

    if (nombreGuardado) {
      setNombreEmprendedor(nombreGuardado);
    }

    if (idGuardado) {
      setEmprendedorId(Number(idGuardado));
    } else {
      console.warn('No se encontró emprendedorId explícito en localStorage.');
    }

    // 2. Cargar categorías disponibles
    productoService.getCategorias()
      .then((cats) => {
        setCategorias(cats);
        if (cats.length > 0) setIdCategoria(cats[0].id);
      })
      .catch((err) => console.error('Error al obtener categorías:', err));
  }, [navigate]);

  // Cargar productos del emprendedor únicamente cuando se confirme su ID
  const cargarProductos = (id: number) => {
    setLoading(true);
    productoService.getByEmprendedor(id)
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al obtener productos:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (emprendedorId) {
      cargarProductos(emprendedorId);
    }
  }, [emprendedorId]);

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productoService.delete(id);
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('No se pudo eliminar el producto. Verifica tus permisos.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emprendedorId) {
      alert('Error de autenticación: No se identificó al emprendedor logueado.');
      return;
    }

    if (!idCategoria) {
      alert('Por favor selecciona una categoría');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('idCategoria', idCategoria.toString());
      formData.append('idEmprendedor', emprendedorId.toString());

      if (fotoFile) {
        formData.append('foto', fotoFile);
      }

      await productoService.createConFoto(formData);

      setMostrarModal(false);
      setNombre('');
      setDescripcion('');
      setFotoFile(null);
      
      cargarProductos(emprendedorId);
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Ocurrió un error al intentar guardar el producto.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 font-bold text-gray-800 mb-0">Gestión de Mis Productos</h1>
            {nombreEmprendedor && (
              <small className="text-muted">Emprendimiento: {nombreEmprendedor}</small>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setMostrarModal(true)}
            disabled={!emprendedorId}
          >
            + Nuevo Producto
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">Cargando mis productos...</div>
        ) : (
          <div className="bg-white rounded shadow-sm p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <img
                          src={prod.fotoPrincipal?.imagenBase64 || prod.imagenUrl || 'https://via.placeholder.com/50'}
                          alt={prod.nombre}
                          width="50"
                          height="50"
                          className="rounded object-cover"
                        />
                      </td>
                      <td className="fw-bold">{prod.nombre}</td>
                      <td className="text-muted small">{prod.descripcion}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => prod.id && handleEliminar(prod.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        No tenés productos cargados aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal para agregar producto */}
        {mostrarModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Agregar Nuevo Producto</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    
                    {/* Campo Emprendedor (Solo lectura) */}
                    <div className="mb-3">
                      <label className="form-label font-bold">Emprendedor / Marca</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={nombreEmprendedor || 'Emprendedor Logueado'}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nombre del Producto</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Categoría</label>
                      <select
                        className="form-select"
                        value={idCategoria}
                        onChange={(e) => setIdCategoria(Number(e.target.value))}
                        required
                      >
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Seleccionar Imagen</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFotoFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Producto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosPage;