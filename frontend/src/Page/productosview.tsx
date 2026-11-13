import React, { useState, useEffect } from 'react';
import { Search, Check, X, Eye, Package, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api'; // ✅ Usamos tu instancia de axios con el token

export interface ProductoItem {
    id: number;
    nombre: string;
    nombreEmprendedor: string; // Alineado con tu DTO
    nombreCategoria: string;   // Alineado con tu DTO
    precio: number;
    estado: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO'; // ✅ Mayúsculas para coincidir con el backend
    fechaCreacion: string;
    descripcion: string;
    fotoPrincipal?: { imagenBase64?: string; rutaFoto?: string };
}

export const ProductosView: React.FC = () => {
    const [productos, setProductos] = useState<ProductoItem[]>([]);
    const [cargando, setCargando] = useState(true);
    const [actionId, setActionId] = useState<number | null>(null);

    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoItem | null>(null);

    const [toastInfo, setToastInfo] = useState<{ visible: boolean; mensaje: string; tipo: 'success' | 'warning' | 'danger' }>({ visible: false, mensaje: '', tipo: 'success' });

    const mostrarToast = (mensaje: string, tipo: 'success' | 'warning' | 'danger' = 'success') => {
        setToastInfo({ visible: true, mensaje, tipo });
        setTimeout(() => setToastInfo(prev => ({ ...prev, visible: false })), 4000);
    };

    // ✅ Cargar productos reales desde el backend
    const cargarProductos = async () => {
        setCargando(true);
        try {
            const response = await api.get('/api/admin/productos');
            // Normalizamos los datos para que coincidan con la interfaz
            const datosNormalizados = response.data.map((p: any) => ({
                id: p.id,
                nombre: p.nombre,
                nombreEmprendedor: p.nombreEmprendedor || 'Sin emprendedor',
                nombreCategoria: p.nombreCategoria || 'Sin categoría',
                precio: p.precio || 0,
                estado: (p.estado || 'PENDIENTE').toUpperCase(),
                fechaCreacion: p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString('es-AR') : 'N/A',
                descripcion: p.descripcion || 'Sin descripción',
                fotoPrincipal: p.fotoPrincipal
            }));
            setProductos(datosNormalizados);
        } catch (error) {
            console.error(error);
            mostrarToast('Error al cargar los productos', 'danger');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // ✅ Handler real para Aprobar/Rechazar
    const handleCambiarEstado = async (id: number, nuevoEstado: 'APROBADO' | 'RECHAZADO') => {
        try {
            setActionId(id);
            await api.put(`/api/admin/productos/${id}/estado`, null, {
                params: { nuevoEstado }
            });
            
            // Actualizamos el estado local inmediatamente para una UI reactiva
            setProductos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
            
            mostrarToast(
                nuevoEstado === 'APROBADO' ? 'Producto aprobado y publicado' : 'Producto rechazado', 
                nuevoEstado === 'APROBADO' ? 'success' : 'warning'
            );
            setProductoSeleccionado(null); // Cerrar modal si está abierto
        } catch (error: any) {
            console.error(error);
            mostrarToast(error.response?.data?.message || 'Error al cambiar el estado', 'danger');
        } finally {
            setActionId(null);
        }
    };

    const obtenerImagen = (prod: ProductoItem) => {
        if (prod.fotoPrincipal?.imagenBase64) {
            return prod.fotoPrincipal.imagenBase64.startsWith('http') || prod.fotoPrincipal.imagenBase64.startsWith('data:') 
                ? prod.fotoPrincipal.imagenBase64 
                : `data:image/jpeg;base64,${prod.fotoPrincipal.imagenBase64}`;
        }
        return 'https://via.placeholder.com/150?text=Sin+Imagen';
    };

    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                p.nombreEmprendedor.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
        return coincideBusqueda && coincideEstado;
    });

    const totalActivos = productos.filter(p => p.estado === 'APROBADO').length;
    const totalPendientes = productos.filter(p => p.estado === 'PENDIENTE').length;
    const totalRechazados = productos.filter(p => p.estado === 'RECHAZADO').length;

    const obtenerClaseToastBg = (tipo: string) => tipo === 'success' ? 'bg-success text-white' : tipo === 'warning' ? 'bg-warning text-dark' : 'bg-danger text-white';
    const renderIconoToast = (tipo: string) => tipo === 'success' ? <CheckCircle2 size={18} /> : tipo === 'warning' ? <AlertTriangle size={18} /> : <XCircle size={18} />;

    return (
        <div className="container-fluid p-0 position-relative">
            {/* TOAST */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
                <div className={`toast align-items-center border-0 shadow-lg rounded-3 ${obtenerClaseToastBg(toastInfo.tipo)} ${toastInfo.visible ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body d-flex align-items-center gap-2">
                            {renderIconoToast(toastInfo.tipo)}
                            <span className="fw-semibold">{toastInfo.mensaje}</span>
                        </div>
                        <button type="button" className={`btn-close me-2 m-auto ${toastInfo.tipo === 'warning' ? '' : 'btn-close-white'}`} onClick={() => setToastInfo(prev => ({ ...prev, visible: false }))} aria-label="Close"></button>
                    </div>
                </div>
            </div>
        
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                    <Package className="text-primary" /> Moderación de Productos
                </h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={cargarProductos} disabled={cargando}>
                    {cargando ? <Loader2 size={14} className="spinner-border spinner-border-sm" /> : 'Recargar'}
                </button>
            </div>

            {/* Métricas */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 border-start border-4 border-success">
                        <span className="text-muted small text-uppercase fw-semibold">Publicados / Aprobados</span>
                        <h3 className="fw-bold my-1 text-success">{totalActivos}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 border-start border-4 border-warning">
                        <span className="text-muted small text-uppercase fw-semibold">Pendientes de Revisión</span>
                        <h3 className="fw-bold my-1 text-warning">{totalPendientes}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 border-start border-4 border-danger">
                        <span className="text-muted small text-uppercase fw-semibold">Rechazados</span>
                        <h3 className="fw-bold my-1 text-danger">{totalRechazados}</h3>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
                                <input type="text" className="form-control form-control-sm border-start-0" placeholder="Buscar producto o emprendedor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <select className="form-select form-select-sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                <option value="Todos">Todos los Estados</option>
                                <option value="APROBADO">Aprobados</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="RECHAZADO">Rechazados</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table align-middle table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-3">Producto</th>
                                    <th>Emprendedor</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th className="text-end pe-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando ? (
                                    <tr><td colSpan={6} className="text-center py-4 text-muted">Cargando productos...</td></tr>
                                ) : productosFiltrados.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-4 text-muted">No se encontraron productos.</td></tr>
                                ) : (
                                    productosFiltrados.map((prod) => (
                                        <tr key={prod.id}>
                                            <td className="ps-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <img src={obtenerImagen(prod)} alt={prod.nombre} className="rounded object-fit-cover" style={{ width: '40px', height: '40px' }} />
                                                    <div>
                                                        <span className="fw-semibold d-block small">{prod.nombre}</span>
                                                        <span className="text-muted style-micro">{prod.fechaCreacion}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="small">{prod.nombreEmprendedor}</td>
                                            <td><span className="badge bg-light text-dark border fw-normal">{prod.nombreCategoria}</span></td>
                                            <td className="fw-bold small">${prod.precio.toLocaleString('es-AR')}</td>
                                            <td>
                                                <span className={`badge ${prod.estado === 'APROBADO' ? 'bg-success' : prod.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                                    {prod.estado === 'APROBADO' ? 'Aprobado' : prod.estado === 'PENDIENTE' ? 'Pendiente' : 'Rechazado'}
                                                </span>
                                            </td>
                                            <td className="text-end pe-3">
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button className="btn btn-outline-secondary" onClick={() => setProductoSeleccionado(prod)} title="Ver Detalle"><Eye size={14} /></button>
                                                    <button className="btn btn-outline-success" onClick={() => handleCambiarEstado(prod.id, 'APROBADO')} disabled={prod.estado === 'APROBADO' || actionId === prod.id} title="Aprobar Producto">
                                                        {actionId === prod.id ? <Loader2 size={14} className="spinner-border spinner-border-sm" /> : <Check size={14} />}
                                                    </button>
                                                    <button className="btn btn-outline-danger" onClick={() => handleCambiarEstado(prod.id, 'RECHAZADO')} disabled={prod.estado === 'RECHAZADO' || actionId === prod.id} title="Rechazar Producto">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Detalle */}
            {productoSeleccionado && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h6 className="modal-title fw-bold">Detalle del Producto</h6>
                                <button type="button" className="btn-close" onClick={() => setProductoSeleccionado(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-3">
                                    <img src={obtenerImagen(productoSeleccionado)} alt={productoSeleccionado.nombre} className="img-fluid rounded border" style={{ maxHeight: '180px' }} />
                                </div>
                                <h5 className="fw-bold mb-1">{productoSeleccionado.nombre}</h5>
                                <p className="text-primary fw-bold fs-5 mb-2">${productoSeleccionado.precio.toLocaleString('es-AR')}</p>
                                <ul className="list-group list-group-flush mb-3 small">
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="text-muted">Emprendedor:</span>
                                        <span className="fw-semibold">{productoSeleccionado.nombreEmprendedor}</span>
                                    </li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="text-muted">Categoría:</span>
                                        <span>{productoSeleccionado.nombreCategoria}</span>
                                    </li>
                                </ul>
                                <h6 className="fw-semibold small mb-1">Descripción:</h6>
                                <p className="text-muted small bg-light p-2 rounded">{productoSeleccionado.descripcion}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setProductoSeleccionado(null)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductosView;