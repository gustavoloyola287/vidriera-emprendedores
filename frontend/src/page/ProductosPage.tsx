import { useEffect, useState } from 'react';
//import { Navbar } from '../components/Navbar';
import { productoService } from '../services/productoService';
import type { Producto } from '../types/Producto';

export const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Formulario de nuevo producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [imagenUrl, setImagenUrl] = useState('');

  // Recuperación de datos del Emprendedor desde el almacenamiento local
  const [nombreEmprendedor, setNombreEmprendedor] = useState('');
  const [emprendedorId, setEmprendedorId] = useState<number>(1);

  useEffect(() => {
    // Leemos el nombre guardado durante el Login
    const nombreGuardado = localStorage.getItem('nombreEmprendedor') || 'Emprendedor Registrado';
    const idGuardado = localStorage.getItem('emprendedorId');

    setNombreEmprendedor(nombreGuardado);
    if (idGuardado) {
      setEmprendedorId(Number(idGuardado));
    }
  }, []);

  const cargarProductos = () => {
    setLoading(true);
    productoService.getByEmprendedor(emprendedorId)
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al obtener productos:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarProductos();
  }, [emprendedorId]);

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productoService.delete(id);
        setProductos(productos.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productoService.create({
        nombre,
        descripcion,
        precio: Number(precio),
        imagenUrl,
        emprendedor: { id: emprendedorId } as any,
      });
      setMostrarModal(false);
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setImagenUrl('');
      cargarProductos();
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
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
                    <th>Precio</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <img
                          src={prod.imagenUrl || 'https://via.placeholder.com/50'}
                          alt={prod.nombre}
                          width="50"
                          height="50"
                          className="rounded object-cover"
                        />
                      </td>
                      <td className="fw-bold">{prod.nombre}</td>
                      <td className="text-muted small">{prod.descripcion}</td>
                      <td>${prod.precio}</td>
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
                      <td colSpan={5} className="text-center text-muted py-4">
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
                        value={nombreEmprendedor}
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
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Precio</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">URL de Imagen</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
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