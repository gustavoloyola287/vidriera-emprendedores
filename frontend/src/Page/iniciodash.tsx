import React, { useState, useEffect } from 'react';
import { Box, Eye, MessageSquare, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

// ✅ Interfaz actualizada: 'categoria' puede ser un string o un objeto completo
export interface Producto {
    id: number;
    nombre: string;
    categoria: string | { id: number; nombre: string; descripcion?: string };
    precio: number | null;
    estado: string;
}

interface InicioDashProps {
    setActiveTab?: (tab: string) => void;
}

// ✅ Función auxiliar para obtener el nombre de la categoría de forma segura
const obtenerNombreCategoria = (categoria: any): string => {
    if (!categoria) return 'Sin categoría';
    if (typeof categoria === 'string') return categoria;
    if (typeof categoria === 'object' && categoria.nombre) return categoria.nombre;
    return 'Sin categoría';
};

export const InicioDash: React.FC<InicioDashProps> = ({ setActiveTab }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorApi, setErrorApi] = useState<string | null>(null);

    const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);

    const [toastInfo, setToastInfo] = useState<{
        visible: boolean;
        mensaje: string;
        tipo: 'success' | 'warning' | 'danger';
    }>({
        visible: false,
        mensaje: '',
        tipo: 'success'
    });

    const mostrarToast = (mensaje: string, tipo: 'success' | 'warning' | 'danger' = 'success') => {
        setToastInfo({ visible: true, mensaje, tipo });
        setTimeout(() => {
            setToastInfo(prev => ({ ...prev, visible: false }));
        }, 4000);
    };

    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            setErrorApi(null);
            
            const token = localStorage.getItem('token');
            const emprendedorId = localStorage.getItem('emprendedorId');

            if (!token || !emprendedorId) {
                setErrorApi('No se encontró la sesión del emprendedor.');
                mostrarToast('Error de autenticación', 'danger');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/productos/emprendedor/${emprendedorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Error al cargar productos');
                
                const data = await response.json();
                setProductos(data);
            } catch (err: any) {
                console.error('Error al cargar productos:', err);
                setErrorApi('No se pudieron cargar los productos.');
                mostrarToast('Error al cargar datos', 'danger');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const handleVerDetalle = (id: number) => {
        const producto = productos.find((prod) => prod.id === id);
        if (!producto) {
            mostrarToast("No se encontró el producto seleccionado.", "warning");
            return;
        }
        setProductoDetalle(producto);
    };

    const obtenerClaseToastBg = (tipo: 'success' | 'warning' | 'danger') => {
        switch (tipo) {
            case 'success': return 'bg-success text-white';
            case 'warning': return 'bg-warning text-dark';
            case 'danger': return 'bg-danger text-white';
            default: return 'bg-success text-white';
        }
    };

    const renderIconoToast = (tipo: 'success' | 'warning' | 'danger') => {
        switch (tipo) {
            case 'success': return <CheckCircle2 size={18} />;
            case 'warning': return <AlertTriangle size={18} />;
            case 'danger': return <XCircle size={18} />;
            default: return <CheckCircle2 size={18} />;
        }
    };

    return (
        <div className="container-fluid p-0 position-relative">
            {/* TOAST */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
                <div 
                    className={`toast align-items-center border-0 shadow-lg rounded-3 ${obtenerClaseToastBg(toastInfo.tipo)} ${toastInfo.visible ? 'show' : 'hide'}`} 
                    role="alert" 
                    aria-live="assertive" 
                    aria-atomic="true"
                >
                    <div className="d-flex">
                        <div className="toast-body d-flex align-items-center gap-2">
                            {renderIconoToast(toastInfo.tipo)}
                            <span className="fw-semibold">{toastInfo.mensaje}</span>
                        </div>
                        <button 
                            type="button" 
                            className={`btn-close me-2 m-auto ${toastInfo.tipo === 'warning' ? '' : 'btn-close-white'}`} 
                            onClick={() => setToastInfo(prev => ({ ...prev, visible: false }))}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            </div>

            {/* Banner Verde de Bienvenida */}
            <div className="alert border-0 rounded-3 p-4 mb-4" style={{ backgroundColor: '#d1e7dd', color: '#0f5132' }}>
                <h5 className="fw-bold mb-1">¡Hola, emprendedor!</h5>
                <p className="mb-0">Gestioná tus productos, mantené tu catálogo actualizado y revisá tus estadísticas.</p>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-secondary fw-semibold">Mis Productos</span>
                            <h2 className="fw-bold mt-2 mb-0">
                                {loading ? <span className="spinner-border spinner-border-sm text-primary" /> : productos.length}
                            </h2>
                        </div>
                        <Box className="text-primary" size={24} />
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-secondary fw-semibold">Visitas a la Vidriera</span>
                            <h2 className="fw-bold mt-2 mb-0">
                                {loading ? <span className="spinner-border spinner-border-sm text-primary" /> : 'Próximamente'}
                            </h2>
                        </div>
                        <Eye className="text-info" size={24} />
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-secondary fw-semibold">Consultas Recibidas</span>
                            <h2 className="fw-bold mt-2 mb-0">
                                {loading ? <span className="spinner-border spinner-border-sm text-primary" /> : 'Próximamente'}
                            </h2>
                        </div>
                        <MessageSquare className="text-warning" size={24} />
                    </div>
                </div>
            </div>

            {/* Tabla de Productos Publicados */}
            <div className="bg-white p-4 rounded-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Productos Publicados</h5>
                    {productos.length > 0 && setActiveTab && (
                        <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setActiveTab('productos')}
                        >
                            Ver todos
                        </button>
                    )}
                </div>

                {errorApi && (
                    <div className="alert alert-danger py-2 small mb-3" role="alert">
                        {errorApi}
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col" className="fw-bold">Producto</th>
                                <th scope="col" className="fw-bold">Categoría</th>
                                <th scope="col" className="fw-bold">Precio</th>
                                <th scope="col" className="fw-bold">Estado</th>
                                <th scope="col" className="fw-bold">Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : productos.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No tenés productos publicados. ¡Comenzá a cargar el primero!
                                    </td>
                                </tr>
                            ) : (
                                productos.slice(0, 5).map((prod) => (
                                    <tr key={prod.id}>
                                        <td className="fw-bold text-dark">{prod.nombre}</td>
                                        
                                        {/* ✅ CORREGIDO: Manejo seguro de categoría (objeto o string) */}
                                        <td className="text-secondary">{obtenerNombreCategoria(prod.categoria)}</td>
                                        
                                        <td className="fw-bold text-dark">
                                            {prod.precio ? `$${Number(prod.precio).toLocaleString('es-AR')}` : 'Consultar'}
                                        </td>
                                        <td>
                                            <span 
                                                className="badge px-2 py-1 fw-semibold" 
                                                style={{ backgroundColor: prod.estado === 'Activo' ? '#0d9c50' : '#6c757d', borderRadius: '4px' }}
                                            >
                                                {prod.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm p-1 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    onClick={() => handleVerDetalle(prod.id)}
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
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

            {/* VISTA EMERGENTE (MODAL) PARA DETALLE DE PRODUCTO */}
            {productoDetalle && (
                <div 
                    className="modal show d-block" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
                    tabIndex={-1}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-primary">Detalle del Producto</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setProductoDetalle(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <span className="text-muted small d-block">Nombre del producto:</span>
                                    <h6 className="fw-bold text-dark fs-5">{productoDetalle.nombre}</h6>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <span className="text-muted small d-block">Categoría:</span>
                                        {/* ✅ CORREGIDO: Manejo seguro de categoría en el modal */}
                                        <span className="fw-semibold text-secondary">{obtenerNombreCategoria(productoDetalle.categoria)}</span>
                                    </div>
                                    <div className="col-6">
                                        <span className="text-muted small d-block">Precio:</span>
                                        <span className="fw-bold text-success fs-6">
                                            {productoDetalle.precio ? `$${Number(productoDetalle.precio).toLocaleString('es-AR')}` : 'Consultar'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-muted small d-block">Estado en la feria:</span>
                                    <span className="badge bg-success px-2 py-1">{productoDetalle.estado}</span>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm px-4" 
                                    onClick={() => setProductoDetalle(null)}
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

export default InicioDash;