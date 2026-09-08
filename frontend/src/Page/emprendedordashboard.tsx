import React, { useState } from 'react';
import { 
    Home, 
    Package, 
    MessageSquare, 
    User, 
    Bell, 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    LogOut,
    Mail,
    X
} from 'lucide-react';
import MailConsultas from '../Components/mailconsultas';

interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: string;
    estado: string;
}

export const EmprendedorDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inicio' | 'productos' | 'consultas' | 'perfil'>('inicio');
    const [showModal, setShowModal] = useState<boolean>(false);

    const [productos, setProductos] = useState<Producto[]>([
        { id: 1, nombre: 'Maceta Artesanal de Cerámica', categoria: 'Hogar y Decoración', precio: '$ 4.500', estado: 'Publicado' },
        { id: 2, nombre: 'Set de Mates Grabados', categoria: 'Regalería', precio: '$ 8.200', estado: 'Publicado' }
    ]);

    // Estado para el formulario del nuevo producto
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState('Hogar y Decoración');
    const [nuevoPrecio, setNuevoPrecio] = useState('');

    // Función para redirigir a 'productos' y abrir el modal
    const handleOpenNuevoProducto = () => {
        setActiveTab('productos');
        setShowModal(true);
    };

    // Agregar producto
    const handleCrearProducto = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoNombre.trim() || !nuevoPrecio.trim()) return;

        const nuevo: Producto = {
            id: Date.now(),
            nombre: nuevoNombre,
            categoria: nuevaCategoria,
            precio: nuevoPrecio.startsWith('$') ? nuevoPrecio : `$ ${nuevoPrecio}`,
            estado: 'Publicado'
        };

        setProductos([...productos, nuevo]);
        setNuevoNombre('');
        setNuevoPrecio('');
        setShowModal(false);
    };

    return (
        <div className="d-flex vh-100 bg-light">
            {/* SIDEBAR LATERAL */}
            <aside className="bg-white border-end d-flex flex-column p-3" style={{ width: '240px', flexShrink: 0 }}>
                <h4 className="fw-bold text-primary mb-4 ps-2">Mi Panel</h4>
                
                <nav className="nav nav-pills flex-column gap-2 justify-content-start">
                    <button
                        className={`nav-link text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-medium ${activeTab === 'inicio' ? 'active bg-primary text-white' : 'text-dark'}`}
                        onClick={() => setActiveTab('inicio')}
                    >
                        <Home size={18} /> Inicio
                    </button>
                    <button
                        className={`nav-link text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-medium ${activeTab === 'productos' ? 'active bg-primary text-white' : 'text-dark'}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        <Package size={18} /> Mis Productos
                    </button>
                    <button
                        className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded-3 fw-medium ${activeTab === 'consultas' ? 'active bg-primary text-white' : 'text-dark'}`}
                        onClick={() => setActiveTab('consultas')}
                    >
                        <span className="d-flex align-items-center gap-2">
                            <MessageSquare size={18} /> Consultas
                        </span>
                        <span className="badge bg-danger rounded-pill">3</span>
                    </button>
                    <button
                        className={`nav-link text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-medium ${activeTab === 'perfil' ? 'active bg-primary text-white' : 'text-dark'}`}
                        onClick={() => setActiveTab('perfil')}
                    >
                        <User size={18} /> Mi Perfil
                    </button>
                </nav>

                {/* BOTÓN CERRAR SESIÓN AL FINAL */}
                <div className="pt-3 border-top mt-auto">
                    <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3">
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-grow-1 d-flex flex-column h-100 overflow-auto">
                {/* HEADER */}
                <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold mb-0 text-dark">Mi Emprendimiento</h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                            <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center">
                                <Bell size={18} className="text-secondary" />
                            </button>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                                3
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                E
                            </div>
                            <span className="fw-semibold text-dark">Marcos Admin</span>
                        </div>
                    </div>
                </header>

                {/* CONTENIDO DE LAS PESTAÑAS */}
                <div className="p-4 flex-grow-1">
                    {activeTab === 'inicio' && (
                        <div className="d-flex flex-column gap-4">
                            {/* BANNER DE BIENVENIDA */}
                            <div className="rounded-3 p-3" style={{ backgroundColor: '#d1e7dd', color: '#0f5132' }}>
                                <h5 className="fw-bold mb-1">¡Hola, Marcos Admin!</h5>
                                <p className="mb-0 text-secondary" style={{ color: '#0f5132' }}>
                                    Gestioná tus productos, mantené tu catálogo actualizado y revisá tus estadísticas.
                                </p>
                            </div>

                            {/* ESTADÍSTICAS */}
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <div className="card border-0 shadow-sm p-3 h-100 rounded-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="fw-semibold text-secondary">Mis Productos</span>
                                            <Package size={22} className="text-primary" />
                                        </div>
                                        <h2 className="fw-bold mb-0">{productos.length}</h2>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div className="card border-0 shadow-sm p-3 h-100 rounded-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="fw-semibold text-secondary">Visitas a la Vidriera</span>
                                            <Eye size={22} className="text-info" />
                                        </div>
                                        <h2 className="fw-bold mb-0">340</h2>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div className="card border-0 shadow-sm p-3 h-100 rounded-3" style={{ borderLeft: '4px solid #ffc107' }}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="fw-semibold text-secondary">Consultas Recibidas</span>
                                            <MessageSquare size={22} className="text-warning" />
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h2 className="fw-bold mb-0">8</h2>
                                            <span className="badge bg-warning text-dark px-2 py-1" style={{ fontSize: '0.75rem' }}>3 sin leer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TABLA DE PRODUCTOS (VISTA PREVIA) */}
                            <div className="card border-0 shadow-sm p-3 rounded-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">Productos Publicados</h5>
                                    <button 
                                        className="btn btn-primary d-flex align-items-center gap-1 rounded-2 btn-sm px-3 py-2"
                                        onClick={handleOpenNuevoProducto}
                                    >
                                        <Plus size={16} /> Nuevo Producto
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
                                            {productos.map((prod) => (
                                                <tr key={prod.id}>
                                                    <td className="fw-semibold">{prod.nombre}</td>
                                                    <td className="text-secondary">{prod.categoria}</td>
                                                    <td className="fw-semibold">{prod.precio}</td>
                                                    <td>
                                                        <span className="badge bg-success px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                            {prod.estado}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-outline-primary btn-sm p-1 rounded">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm p-1 rounded">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'productos' && (
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
                                        {productos.map((prod) => (
                                            <tr key={prod.id}>
                                                <td className="fw-semibold">{prod.nombre}</td>
                                                <td className="text-secondary">{prod.categoria}</td>
                                                <td className="fw-semibold">{prod.precio}</td>
                                                <td>
                                                    <span className="badge bg-success px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                        {prod.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-outline-primary btn-sm p-1 rounded">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm p-1 rounded">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'consultas' && (
                        <div className="d-flex flex-column gap-3">
                            <div className="card border-0 shadow-sm p-4 text-center rounded-3">
                                <Mail size={40} className="text-primary mx-auto mb-2" />
                                <h5 className="fw-bold mb-1">Gestión de Consultas</h5>
                                <p className="text-muted small mb-0">Responde las consultas recibidas en tu bandeja de entrada.</p>
                            </div>

                            <div className="card border-0 shadow-sm p-4 rounded-3">
                                <MailConsultas />
                            </div>
                        </div>
                    )}

                    {activeTab === 'perfil' && (
                        <div className="card border-0 shadow-sm p-4 rounded-3">
                            <h5 className="fw-bold mb-3">Mi Perfil</h5>
                            <p className="text-muted">Ajustes generales de tu cuenta y datos de contacto.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL PARA NUEVO PRODUCTO */}
            {showModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">Crear Nuevo Producto</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleCrearProducto}>
                                <div className="modal-body py-3">
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Nombre del producto</label>
                                        <input 
                                            type="text" 
                                            className="form-control rounded-2" 
                                            placeholder="Ej. Taza sublimada"
                                            value={nuevoNombre}
                                            onChange={(e) => setNuevoNombre(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Categoría</label>
                                        <select 
                                            className="form-select rounded-2"
                                            value={nuevaCategoria}
                                            onChange={(e) => setNuevaCategoria(e.target.value)}
                                        >
                                            <option value="Hogar y Decoración">Hogar y Decoración</option>
                                            <option value="Regalería">Regalería</option>
                                            <option value="Indumentaria">Indumentaria</option>
                                            <option value="Gastronomía">Gastronomía</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Precio</label>
                                        <input 
                                            type="text" 
                                            className="form-control rounded-2" 
                                            placeholder="Ej. 5000"
                                            value={nuevoPrecio}
                                            onChange={(e) => setNuevoPrecio(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button 
                                        type="button" 
                                        className="btn btn-light rounded-2" 
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary rounded-2">
                                        Guardar Producto
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