import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; // O la librería de íconos que uses

// Definición de la interfaz del producto
interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    estado: string;
}

export const MisProductos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Cargar productos al montar el componente
    useEffect(() => {
        // Aquí llamas a tu productoService.ts
        // productoService.obtenerProductos().then(data => setProductos(data));
    }, []);

    const handleEliminar = (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            // Lógica para eliminar mediante productoService.ts
            console.log('Eliminando producto:', id);
        }
    };

    const handleEditar = (producto: Producto) => {
        // Lógica para abrir modal con datos cargados
        console.log('Editando producto:', producto);
    };

    return (
        <div className="card border-0 shadow-sm p-4 rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Gestión de Productos</h5>
                <button 
                    className="btn btn-primary d-flex align-items-center gap-1"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>
            
            <div className="table-responsive mt-3">
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
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td className="fw-semibold">{prod.nombre}</td>
                                    <td className="text-secondary">{prod.categoria}</td>
                                    <td className="fw-semibold">${prod.precio}</td>
                                    <td>
                                        <span className={`badge px-2 py-1 ${prod.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.75rem' }}>
                                            {prod.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-outline-primary btn-sm p-1 rounded"
                                                onClick={() => handleEditar(prod)}
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger btn-sm p-1 rounded"
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

            {/* Aquí puedes incluir el renderizado del Modal de alta/edición si showModal es true */}
        </div>
    );
};