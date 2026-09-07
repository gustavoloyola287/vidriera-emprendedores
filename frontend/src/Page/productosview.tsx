import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    Check, 
    X, 
    Eye, 
    Star, 
    Trash2, 
    Package, 
    AlertCircle,
    ExternalLink
    } from 'lucide-react';

    // Interface alineada al modelo de datos del Backend
    export interface ProductoItem {
    id: number;
    nombre: string;
    emprendedor: string;
    categoria: string;
    precio: number;
    imagen: string;
    estado: 'Aprobado' | 'Pendiente' | 'Rechazado';
    destacado: boolean;
    fechaCreacion: string;
    descripcion: string;
    }

    export const ProductosView: React.FC = () => {
    // Estado con datos de prueba
    const [productos, setProductos] = useState<ProductoItem[]>([
        {
        id: 101,
        nombre: 'Mesa de Madera Eucalipto',
        emprendedor: 'Muebles Carlos Paz',
        categoria: 'Hogar y Muebles',
        precio: 45000,
        imagen: 'https://via.placeholder.com/150',
        estado: 'Pendiente',
        destacado: false,
        fechaCreacion: '2026-09-01',
        descripcion: 'Mesa ratona de madera maciza barnizada para exterior o interior.'
        },
        {
        id: 102,
        nombre: 'Tarta Dulce de Frutillas',
        emprendedor: 'Panadería San Carlos',
        categoria: 'Gastronomía',
        precio: 12000,
        imagen: 'https://via.placeholder.com/150',
        estado: 'Aprobado',
        destacado: true,
        fechaCreacion: '2026-08-28',
        descripcion: 'Tarta artesanal con crema pastelera y frutillas frescas de estación.'
        },
        {
        id: 103,
        nombre: 'Jarra Cerámica Artesanal',
        emprendedor: 'Cerámicas Serrano',
        categoria: 'Artesanías',
        precio: 8500,
        imagen: 'https://via.placeholder.com/150',
        estado: 'Aprobado',
        destacado: false,
        fechaCreacion: '2026-08-30',
        descripcion: 'Jarra modelada a mano con acabado esmaltado mate.'
        },
        {
        id: 104,
        nombre: 'Remera Algodón Estampada',
        emprendedor: 'Indumentaria VCP',
        categoria: 'Indumentaria',
        precio: 15000,
        imagen: 'https://via.placeholder.com/150',
        estado: 'Rechazado',
        destacado: false,
        fechaCreacion: '2026-08-25',
        descripcion: 'Remera 100% algodón con diseño exclusivo.'
        }
    ]);

    // Estados de Filtro y Búsqueda
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoItem | null>(null);

    // Handlers para acciones
    const handleCambiarEstado = (id: number, nuevoEstado: 'Aprobado' | 'Rechazado') => {
        setProductos(prev =>
        prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
        );
    };

    const handleToggleDestacado = (id: number) => {
        setProductos(prev =>
        prev.map(p => p.id === id ? { ...p, destacado: !p.destacado } : p)
        );
    };

    const handleEliminarProducto = (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
        setProductos(prev => prev.filter(p => p.id !== id));
        }
    };

    // Filtrado reactivo
    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                p.emprendedor.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
        const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;

        return coincideBusqueda && coincideEstado && coincideCategoria;
    });

    // Métricas rápidas
    const totalActivos = productos.filter(p => p.estado === 'Aprobado').length;
    const totalPendientes = productos.filter(p => p.estado === 'Pendiente').length;
    const totalRechazados = productos.filter(p => p.estado === 'Rechazado').length;

    return (
        <div className="container-fluid p-0">
        
        {/* Título y Métricas Rápidas */}
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
            <Package className="text-primary" /> Gestión de Productos
            </h5>
        </div>

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

        {/* Barra de Búsqueda y Filtros */}
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-3">
            <div className="row g-2">
                <div className="col-md-5">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                    <Search size={16} className="text-muted" />
                    </span>
                    <input
                    type="text"
                    className="form-control form-control-sm border-start-0"
                    placeholder="Buscar producto o emprendedor..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                </div>

                <div className="col-md-3">
                <select
                    className="form-select form-select-sm"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Aprobado">Aprobados</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Rechazado">Rechazados</option>
                </select>
                </div>

                <div className="col-md-4">
                <select
                    className="form-select form-select-sm"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                    <option value="Todas">Todas las Categorías</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Hogar y Muebles">Hogar y Muebles</option>
                    <option value="Artesanías">Artesanías</option>
                    <option value="Indumentaria">Indumentaria</option>
                </select>
                </div>
            </div>
            </div>
        </div>

        {/* Tabla de Productos */}
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
                    <th>Destacado</th>
                    <th className="text-end pe-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                        No se encontraron productos que coincidan con los filtros.
                        </td>
                    </tr>
                    ) : (
                    productosFiltrados.map((prod) => (
                        <tr key={prod.id}>
                        <td className="ps-3">
                            <div className="d-flex align-items-center gap-2">
                            <img
                                src={prod.imagen}
                                alt={prod.nombre}
                                className="rounded object-fit-cover"
                                style={{ width: '40px', height: '40px' }}
                            />
                            <div>
                                <span className="fw-semibold d-block small">{prod.nombre}</span>
                                <span className="text-muted style-micro">Cargado: {prod.fechaCreacion}</span>
                            </div>
                            </div>
                        </td>
                        <td className="small">{prod.emprendedor}</td>
                        <td>
                            <span className="badge bg-light text-dark border fw-normal">
                            {prod.categoria}
                            </span>
                        </td>
                        <td className="fw-bold small">${prod.precio.toLocaleString('es-AR')}</td>
                        <td>
                            <span className={`badge ${
                            prod.estado === 'Aprobado' ? 'bg-success' :
                            prod.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-danger'
                            }`}>
                            {prod.estado}
                            </span>
                        </td>
                        <td>
                            <button
                            className="btn btn-sm p-0 border-0"
                            onClick={() => handleToggleDestacado(prod.id)}
                            title={prod.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                            >
                            <Star
                                size={18}
                                className={prod.destacado ? 'text-warning fill-warning' : 'text-muted'}
                                style={{ fill: prod.destacado ? '#ffc107' : 'none' }}
                            />
                            </button>
                        </td>
                        <td className="text-end pe-3">
                            <div className="btn-group btn-group-sm" role="group">
                            {/* Ver Detalle */}
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setProductoSeleccionado(prod)}
                                title="Ver Detalle"
                            >
                                <Eye size={14} />
                            </button>

                            {/* Aprobar */}
                            <button
                                className="btn btn-outline-success"
                                onClick={() => handleCambiarEstado(prod.id, 'Aprobado')}
                                disabled={prod.estado === 'Aprobado'}
                                title="Aprobar Producto"
                            >
                                <Check size={14} />
                            </button>

                            {/* Rechazar */}
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => handleCambiarEstado(prod.id, 'Rechazado')}
                                disabled={prod.estado === 'Rechazado'}
                                title="Rechazar Producto"
                            >
                                <X size={14} />
                            </button>

                            {/* Eliminar */}
                            <button
                                className="btn btn-outline-dark"
                                onClick={() => handleEliminarProducto(prod.id)}
                                title="Eliminar definitivo"
                            >
                                <Trash2 size={14} />
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

        {/* Modal de Previsualización / Detalle */}
        {productoSeleccionado && (
            <div className="modal show d-block tab-modal-bg" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                <div className="modal-header">
                    <h6 className="modal-title fw-bold">Detalle del Producto</h6>
                    <button
                    type="button"
                    className="btn-close"
                    onClick={() => setProductoSeleccionado(null)}
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="text-center mb-3">
                    <img
                        src={productoSeleccionado.imagen}
                        alt={productoSeleccionado.nombre}
                        className="img-fluid rounded border"
                        style={{ maxHeight: '180px' }}
                    />
                    </div>
                    <h5 className="fw-bold mb-1">{productoSeleccionado.nombre}</h5>
                    <p className="text-primary fw-bold fs-5 mb-2">
                    ${productoSeleccionado.precio.toLocaleString('es-AR')}
                    </p>

                    <ul className="list-group list-group-flush mb-3 small">
                    <li className="list-group-item px-0 d-flex justify-content-between">
                        <span className="text-muted">Emprendedor:</span>
                        <span className="fw-semibold">{productoSeleccionado.emprendedor}</span>
                    </li>
                    <li className="list-group-item px-0 d-flex justify-content-between">
                        <span className="text-muted">Categoría:</span>
                        <span>{productoSeleccionado.categoria}</span>
                    </li>
                    <li className="list-group-item px-0 d-flex justify-content-between">
                        <span className="text-muted">Estado actual:</span>
                        <span className={`badge ${
                        productoSeleccionado.estado === 'Aprobado' ? 'bg-success' :
                        productoSeleccionado.estado === 'Pendiente' ? 'bg-warning text-dark' : 'bg-danger'
                        }`}>
                        {productoSeleccionado.estado}
                        </span>
                    </li>
                    </ul>

                    <h6 className="fw-semibold small mb-1">Descripción:</h6>
                    <p className="text-muted small bg-light p-2 rounded">
                    {productoSeleccionado.descripcion}
                    </p>
                </div>
                <div className="modal-footer">
                    <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setProductoSeleccionado(null)}
                    >
                    Cerrar
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        </div>
    );
};