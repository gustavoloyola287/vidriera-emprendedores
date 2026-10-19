import React, { useState } from 'react';
// Íconos de lucide-react (incluimos Bell)
import { Home, Box, User, LogOut, MessagesSquare, Star, Store, Bell, CheckCircle, MessageSquare } from 'lucide-react';

// Importación de las vistas independientes
import { InicioDash } from './iniciodash';
import MisProductos from './misproductos';
import { MiPerfil } from './miperfil';
import ChatInterno from '../components/ChatInterno';
import OpinionesYCalificaciones from './opinionesycalificaciones';

export const EmprendedorDashboard: React.FC = () => {
    // Estado para controlar qué sección del menú lateral está activa
    const [activeTab, setActiveTab] = useState<'inicio' | 'productos' | 'perfil' | 'mensajes' | 'opinionesycalificaciones'>('inicio');
    
    // Estado para controlar la visibilidad del desplegable de notificaciones
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState<boolean>(false);
    
    // Notificaciones de ejemplo (mock)
    const [notificaciones, setNotificaciones] = useState([
        { id: 1, texto: "¡Tu perfil fue aprobado por el municipio!", leida: false, tipo: "success" },
        { id: 2, texto: "Nueva reseña de 5 estrellas de Lucía Gómez.", leida: false, tipo: "star" }
    ]);

    const emprendedor = false;

    const handleCerrarSesion = () => {
        console.log('Cerrando sesión...');
    };

    const marcarComoLeidas = () => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    };

    const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

    return (
        <div className="d-flex min-vh-100 bg-light position-relative">
            {/* SIDEBAR LATERAL */}
            <aside 
                className="bg-white border-end d-flex flex-column justify-content-between p-3 shadow-sm" 
                style={{ width: '250px', minHeight: '100vh' }}
            >
                <div className="d-flex flex-column gap-2">
                    <div className="px-3 py-2 mb-2">
                        <h6 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                            <Store size={20} /> Panel Municipal
                        </h6>
                    </div>

                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'inicio' ? 'btn-primary text-white shadow-sm' : 'btn-light bg-transparent text-dark'
                        }`}
                        style={{ borderRadius: '8px' }}
                        onClick={() => setActiveTab('inicio')}
                    >
                        <Home size={18} />
                        <span>Inicio</span>
                    </button>

                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'productos' ? 'btn-primary text-white shadow-sm' : 'btn-light bg-transparent text-dark'
                        }`}
                        style={{ borderRadius: '8px' }}
                        onClick={() => setActiveTab('productos')}
                    >
                        <Box size={18} />
                        <span>Mis Productos</span>
                    </button>

                    {emprendedor === false && (
                        <button
                            type="button"
                            className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                                activeTab === 'mensajes' ? 'btn-primary text-white shadow-sm' : 'btn-light bg-transparent text-dark'
                            }`}
                            style={{ borderRadius: '8px' }}
                            onClick={() => setActiveTab('mensajes')}
                        >
                            <MessagesSquare size={18} />
                            <span>Chat</span>
                        </button>
                    )}

                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'opinionesycalificaciones' ? 'btn-primary text-white shadow-sm' : 'btn-light bg-transparent text-dark'
                        }`}
                        style={{ borderRadius: '8px' }}
                        onClick={() => setActiveTab('opinionesycalificaciones')}
                    >
                        <Star size={18} />
                        <span>Opiniones y Calificaciones</span>
                    </button>

                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'perfil' ? 'btn-primary text-white shadow-sm' : 'btn-light bg-transparent text-dark'
                        }`}
                        style={{ borderRadius: '8px' }}
                        onClick={() => setActiveTab('perfil')}
                    >
                        <User size={18} />
                        <span>Mi Perfil</span>
                    </button>
                </div>

                <div className="pt-3 border-top">
                    <button
                        type="button"
                        className="btn btn-link w-100 d-flex align-items-center gap-2 py-2 px-3 text-danger text-decoration-none fw-medium text-start"
                        onClick={handleCerrarSesion}
                    >
                        <LogOut size={18} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex-grow-1 d-flex flex-column">
                {/* NAVBAR SUPERIOR */}
                <header className="bg-white border-bottom px-4 py-3 shadow-sm d-flex justify-content-between align-items-center">
                    <h4 className="fw-bold m-0 text-dark">Mi Emprendimiento</h4>
                    
                    <div className="d-flex align-items-center gap-3">
                        {/* 🔔 CAMANA DE NOTIFICACIONES */}
                        <div className="position-relative">
                            <button
                                type="button"
                                className="btn btn-light position-relative rounded-circle p-2 d-flex align-items-center justify-content-center border"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => {
                                    setMostrarNotificaciones(!mostrarNotificaciones);
                                    if (!mostrarNotificaciones) marcarComoLeidas();
                                }}
                            >
                                <Bell size={18} className="text-secondary" />
                                {notificacionesNoLeidas > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                                        {notificacionesNoLeidas}
                                    </span>
                                )}
                            </button>

                            {/* Desplegable de Notificaciones */}
                            {mostrarNotificaciones && (
                                <div 
                                    className="position-absolute end-0 mt-2 bg-white border shadow-lg rounded-4 p-3" 
                                    style={{ width: '320px', zIndex: 1050 }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                        <h6 className="fw-bold mb-0 text-dark">Notificaciones</h6>
                                        <span className="badge bg-light text-primary border">Municipalidad</span>
                                    </div>
                                    <div className="d-flex flex-column gap-2">
                                        {notificaciones.length === 0 ? (
                                            <p className="text-muted small text-center mb-0 py-2">No hay notificaciones nuevas.</p>
                                        ) : (
                                            notificaciones.map((notif) => (
                                                <div key={notif.id} className="p-2 bg-light rounded-3 d-flex align-items-start gap-2">
                                                    {notif.tipo === 'success' ? (
                                                        <CheckCircle size={16} className="text-success mt-1 flex-shrink-0" />
                                                    ) : (
                                                        <Star size={16} className="text-warning mt-1 flex-shrink-0" />
                                                    )}
                                                    <p className="text-secondary small mb-0">{notif.texto}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Perfil del Usuario */}
                        <div className="d-flex align-items-center gap-2 border-start ps-3">
                            <div 
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                style={{ width: '36px', height: '36px', fontSize: '14px' }}
                            >
                                E
                            </div>
                            <span className="fw-semibold text-secondary small d-none d-md-inline">Emprendedor</span>
                        </div>
                    </div>
                </header>

                {/* ÁREA DE CONTENIDO */}
                <main className="flex-grow-1 p-4 overflow-auto">
                    {activeTab === 'inicio' && <InicioDash />}
                    {activeTab === 'opinionesycalificaciones' && <OpinionesYCalificaciones />}
                    {activeTab === 'productos' && <MisProductos />}
                    {activeTab === 'perfil' && <MiPerfil />}
                    {activeTab === 'mensajes' && <ChatInterno />}
                </main>
            </div>
        </div>
    );
};

export default EmprendedorDashboard;