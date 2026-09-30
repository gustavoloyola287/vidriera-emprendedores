import React, { useState, useEffect } from 'react';
import { Box, Eye, MessageSquare, Plus, Pencil, Trash2 } from 'lucide-react';

// Interfaz para el modelo de Producto
export interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    estado: string;
}

export const InicioDash: React.FC = () => {
    // ------------------------------------------------------------------
    // ESTADOS
    // ------------------------------------------------------------------
    // Estado de productos inicializado con los datos de la foto
    const [productos, setProductos] = useState<Producto[]>([
        {
            id: 1,
            nombre: 'Maceta Artesanal de Cerámica',
            categoria: 'Hogar y Decoración',
            precio: 4500,
            estado: 'Publicado'
        },
        {
            id: 2,
            nombre: 'Set de Mates Grabados',
            categoria: 'Regalería',
            precio: 8200,
            estado: 'Publicado'
        }
    ]);

    // Estado para controlar el modal de Bootstrap y saber si editamos o creamos
    const [showModal, setShowModal] = useState<boolean>(false);
    const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

    // Formulario de edición / creación
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        precio: '',
        estado: 'Publicado'
    });

    // ------------------------------------------------------------------
    // CONEXIÓN AL BACKEND / CONTROLLER (Efecto de Carga)
    // ------------------------------------------------------------------
    useEffect(() => {
        // TODO: Reemplazar por la llamada a tu controller/servicio cuando esté listo
        // productoService.obtenerProductos().then(data => setProductos(data));
    }, []);

    // ------------------------------------------------------------------
    // HANDLERS CRUD
    // ------------------------------------------------------------------
    // Abrir Modal para crear
    const handleNuevoProducto = () => {
        setProductoEditar(null);
        setFormData({ nombre: '', categoria: '', precio: '', estado: 'Publicado' });
        setShowModal(true);
    };

    // Abrir Modal para editar
    const handleEditar = (producto: Producto) => {
        setProductoEditar(producto);
        setFormData({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio.toString(),
            estado: producto.estado
        });
        setShowModal(true);
    };

    // Eliminar producto
    const handleEliminar = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            // TODO: Lógica para enviar DELETE a la API mediante el controller/servicio
            // productoService.eliminarProducto(id).then(...)
            setProductos(prev => prev.filter(p => p.id !== id));
        }
    };

    // Guardar (Crear o Actualizar)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (productoEditar) {
            // MODO EDICIÓN
            const productoActualizado: Producto = {
                ...productoEditar,
                nombre: formData.nombre,
                categoria: formData.categoria,
                precio: parseFloat(formData.precio) || 0,
                estado: formData.estado
            };

            // TODO: productoService.actualizarProducto(productoActualizado).then(...)
            setProductos(prev => prev.map(p => p.id === productoEditar.id ? productoActualizado : p));
        } else {
            // MODO CREACIÓN
            const nuevoProducto: Producto = {
                id: Date.now(), // ID temporal local
                nombre: formData.nombre,
                categoria: formData.categoria,
                precio: parseFloat(formData.precio) || 0,
                estado: formData.estado
            };

            // TODO: productoService.crearProducto(nuevoProducto).then(...)
            setProductos(prev => [...prev, nuevoProducto]);
        }

        setShowModal(false);
    };

    return (
        <div className="container-fluid p-0">
            {/* 1. Header Superior */}
            <div className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-dark">Mi Emprendimiento</h4>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        E
                    </span>
                    <span className="fw-semibold text-secondary">Marcos Admin</span>
                </div>
            </div>

            {/* 2. Banner Verde de Bienvenida */}
            <div className="alert border-0 rounded-3 p-4 mb-4" style={{ backgroundColor: '#d1e7dd', color: '#0f5132' }}>
                <h5 className="fw-bold mb-1">¡Hola, Marcos Admin!</h5>
                <p className="mb-0">Gestioná tus productos, mantené tu catálogo actualizado y revisá tus estadísticas.</p>
            </div>

            {/* 3. Tarjetas de Métricas */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-secondary fw-semibold">Mis Productos</span>
                            <h2 className="fw-bold mt-2 mb-0">{productos.length}</h2>
                        </div>
                        <Box className="text-primary" size={24} />
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-secondary fw-semibold">Visitas a la Vidriera</span>
                            <h2 className="fw-bold mt-2 mb-0">340</h2>
                        </div>
                        <Eye className="text-info" size={24} />
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="text-secondary fw-semibold">Consultas Recibidas</span>
                            <h2 className="fw-bold mt-2 mb-0">8</h2>
                        </div>
                        <MessageSquare className="text-warning" size={24} />
                    </div>
                </div>
            </div>

            {/* 4. Tabla de Productos Publicados */}
            <div className="bg-white p-4 rounded-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Productos Publicados</h5>
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-1 fw-medium"
                        onClick={handleNuevoProducto}
                    >
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col" className="fw-bold">Producto</th>
                                <th scope="col" className="fw-bold">Categoría</th>
                                <th scope="col" className="fw-bold">Precio</th>
                                <th scope="col" className="fw-bold">Estado</th>
                                <th scope="col" className="fw-bold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No hay productos cargados en el sistema.
                                    </td>
                                </tr>
                            ) : (
                                productos.map((prod) => (
                                    <tr key={prod.id}>
                                        <td className="fw-bold text-dark">{prod.nombre}</td>
                                        <td className="text-secondary">{prod.categoria}</td>
                                        <td className="fw-bold text-dark">${prod.precio.toLocaleString('es-AR')}</td>
                                        <td>
                                            <span 
                                                className="badge px-2 py-1 fw-semibold" 
                                                style={{ backgroundColor: '#198754', borderRadius: '4px' }}
                                            >
                                                {prod.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                {/* Botón Editar (Lápiz azul) */}
                                                <button 
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm p-1 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    onClick={() => handleEditar(prod)}
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                {/* Botón Eliminar (Tacho rojo) */}
                                                <button 
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm p-1 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    onClick={() => handleEliminar(prod.id)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
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

            {/* 5. Modal para Crear / Editar Producto */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre del Producto</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            required 
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Categoría</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            required 
                                            value={formData.categoria}
                                            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Precio ($)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            required 
                                            value={formData.precio}
                                            onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Estado</label>
                                        <select 
                                            className="form-select"
                                            value={formData.estado}
                                            onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                        >
                                            <option value="Publicado">Publicado</option>
                                            <option value="Borrador">Borrador</option>
                                            <option value="Pausado">Pausado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button 
                                        type="button" 
                                        className="btn btn-light" 
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {productoEditar ? 'Guardar Cambios' : 'Crear Producto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};