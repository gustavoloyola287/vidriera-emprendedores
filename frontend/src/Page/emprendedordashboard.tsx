import React, { useState } from 'react';
import ChatConsultas from '../Components/ChatConsultas';
import { 
    Package, 
    PlusCircle, 
    Eye, 
    MessageSquare, 
    User, 
    LogOut, 
    Edit, 
    Trash2,
    Bell,
    Home
    } from 'lucide-react';

    export const EmprendedorDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inicio' | 'productos' | 'consultas' | 'perfil'>('inicio');
    const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState<number>(3);

    const nombreEmprendimiento = localStorage.getItem('nombreEmprendedor') || 'Marcos Admin';

    return (
        <div className="d-flex vh-100 bg-light">
        {/* SIDEBAR EMBRENDEDOR */}
        <aside className="bg-white border-end d-flex flex-column p-3" style={{ width: '250px' }}>
            <h5 className="fw-bold text-primary mb-4 px-2">Mi Panel</h5>
            
            <ul className="nav nav-pills flex-column gap-1 mb-auto">
            <li className="nav-item">
                <button
                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'inicio' ? 'active bg-primary' : 'text-dark'}`}
                onClick={() => setActiveTab('inicio')}
                >
                < Home size={18} /> Inicio
                </button>
            </li>
            <li className="nav-item">
                <button
                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'productos' ? 'active bg-primary' : 'text-dark'}`}
                onClick={() => setActiveTab('productos')}
                >
                <Package size={18} /> Mis Productos
                </button>
            </li>
            <li className="nav-item">
                <button
                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'consultas' ? 'active bg-primary' : 'text-dark'}`}
                onClick={() => setActiveTab('consultas')}
                >
                <MessageSquare size={18} /> Consultas
                {notificacionesNoLeidas > 0 && (
                    <span className="badge bg-danger ms-auto">{notificacionesNoLeidas}</span>
                )}
                </button>
            </li>
            <li className="nav-item">
                <button
                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'perfil' ? 'active bg-primary' : 'text-dark'}`}
                onClick={() => setActiveTab('perfil')}
                >
                <User size={18} /> Mi Perfil
                </button>
            </li>
            </ul>

            <div className="border-top pt-3">
            <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                <LogOut size={18} /> Cerrar sesión
            </button>
            </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-grow-1 d-flex flex-column overflow-hidden">
            {/* NAVBAR SUPERIOR CON NOTIFICACIONES */}
            <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-0 text-dark">Mi Emprendimiento</h4>
            
            <div className="d-flex align-items-center gap-3">
                {/* ÍCONO DE NOTIFICACIONES */}
                <button 
                className="btn btn-light position-relative p-2 rounded-circle"
                onClick={() => setActiveTab('consultas')}
                title="Ver notificaciones y consultas"
                >
                <Bell size={20} className="text-secondary" />
                {notificacionesNoLeidas > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '10px' }}>
                    {notificacionesNoLeidas}
                    </span>
                )}
                </button>

                {/* USUARIO */}
                <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                    E
                </div>
                <span className="fw-semibold text-secondary">{nombreEmprendimiento}</span>
                </div>
            </div>
            </header>

            {/* CONTENIDO SEGÚN PESTAÑA */}
            <div className="p-4 overflow-auto flex-grow-1">
            {activeTab === 'inicio' && (
                <div>
                {/* Banner de bienvenida */}
                <div className="alert alert-success border-0 shadow-sm mb-4">
                    <h5 className="fw-bold alert-heading mb-1">¡Hola, {nombreEmprendimiento}!</h5>
                    <p className="mb-0 text-secondary">
                    Gestioná tus productos, mantené tu catálogo actualizado y revisá tus estadísticas.
                    </p>
                </div>

                {/* TARJETAS DE MÉTRICAS */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                    <div 
                        className="card border-0 shadow-sm p-3 h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveTab('productos')}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted fw-semibold">Mis Productos</span>
                        <Package className="text-primary" size={24} />
                        </div>
                        <h2 className="fw-bold mb-0">12</h2>
                    </div>
                    </div>
                

                    <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted fw-semibold">Visitas a la Vidriera</span>
                        <Eye className="text-info" size={24} />
                        </div>
                        <h2 className="fw-bold mb-0">340</h2>
                    </div>
                    </div>


                    {/* CARD CLICKEABLE CON BOTÓN / ACCIÓN */}
                    <div className="col-12 col-md-4">
                    <div 
                        className="card border-0 shadow-sm p-3 h-100 border-start border-warning border-4" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveTab('consultas')}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted fw-semibold">Consultas Recibidas</span>
                        <MessageSquare className="text-warning" size={24} />
                        </div>
                        <div className="d-flex justify-content-between align-items-end">
                        <h2 className="fw-bold mb-0">8</h2>
                        {notificacionesNoLeidas > 0 && (
                            <span className="badge bg-warning text-dark">
                            {notificacionesNoLeidas} sin leer
                            </span>
                        )}
                        </div>
                    </div>
                    </div>
                </div>

                {/* TABLA DE PRODUCTOS */}
                <div className="card border-0 shadow-sm p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Productos Publicados</h5>
                    <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={() => setActiveTab('productos')}>
                        <PlusCircle size={16} /> Nuevo Producto
                    </button>
                    </div>

                    <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="fw-semibold">Maceta Artesanal de Cerámica</td>
                            <td>Hogar y Decoración</td>
                            <td>$ 4.500</td>
                            <td><span className="badge bg-success">Publicado</span></td>
                            <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2"><Edit size={14} /></button>
                            <button className="btn btn-sm btn-outline-danger"><Trash2 size={14} /></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-semibold">Set de Mates Grabados</td>
                            <td>Regalería</td>
                            <td>$ 8.200</td>
                            <td><span className="badge bg-success">Publicado</span></td>
                            <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-2"><Edit size={14} /></button>
                            <button className="btn btn-sm btn-outline-danger"><Trash2 size={14} /></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            )}

            {/* VISTA DE CONSULTAS / NOTIFICACIONES */}
            {activeTab === 'consultas' && (
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm p-4 h-100">
                            <h5 className="fw-bold mb-3">Consultas y Notificaciones</h5>
                            <p className="text-muted">Mensajes enviados por los clientes desde la vidriera pública.</p>

                            <div className="list-group">
                                <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-start p-3 bg-light">
                                    <div>
                                        <div className="fw-bold">Juan Pérez</div>
                                        <small className="text-muted">Producto: Maceta Artesanal de Cerámica</small>
                                        <p className="mb-0 mt-1">¿Tienen stock disponible en color verde oliva?</p>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">Nuevo</span>
                                </div>
                                <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-start p-3">
                                    <div>
                                        <div className="fw-bold">María Gómez</div>
                                        <small className="text-muted">Producto: Set de Mates Grabados</small>
                                        <p className="mb-0 mt-1">¿Hacen envíos a domicilio en la zona céntrica?</p>
                                    </div>
                                    <small className="text-muted">Hace 2 horas</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <ChatConsultas />
                    </div>
                </div>
            )}

            {activeTab === 'productos' && (
                <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Gestión de Productos</h5>
                <p className="text-muted">Acá podés agregar o modificar tus publicaciones.</p>
                </div>
            )}

            {activeTab === 'perfil' && (
                <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Datos de Mi Emprendimiento</h5>
                <p className="text-muted">Actualizá tu información de contacto y descripción pública.</p>
                </div>
            )}
            </div>
        </main>
        </div>
    );
    };