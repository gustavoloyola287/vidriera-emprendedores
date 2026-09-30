import React, { useState } from 'react';
// Íconos (puedes usar lucide-react o los que prefieras)
import { Home, Box, User, LogOut, MessagesSquare } from 'lucide-react';

// Importación de las vistas independientes (cada una maneja su propia lógica)
import  {InicioDash } from './iniciodash';
import { MisProductos } from './misproductos';
import { MiPerfil } from './miperfil';
import ChatInterno from '../components/ChatInterno';

export const EmprendedorDashboard: React.FC = () => {
    // Estado para controlar qué sección del menú lateral está activa
    const [activeTab, setActiveTab] = useState<'inicio' | 'productos' | 'perfil' | 'mensajes'>('inicio');
    const emprendedor = false;

    const handleCerrarSesion = () => {
        // Lógica para cerrar sesión (limpiar tokens y redirigir al login)
        console.log('Cerrando sesión...');
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* SIDEBAR */}
            <aside 
                className="bg-white border-end d-flex flex-column justify-content-between p-3 shadow-sm" 
                style={{ width: '250px', minHeight: '100vh' }}
            >
                {/* Sección Superior: Navegación */}
                <div className="d-flex flex-column gap-2">
                    {/* Botón Inicio */}
                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'inicio' 
                                ? 'btn-primary text-white shadow-sm' 
                                : 'btn-light bg-transparent text-dark'
                        }`}
                        style={{ borderRadius: '8px' }}
                        onClick={() => setActiveTab('inicio')}
                    >
                        <Home size={18} />
                        <span>Inicio</span>
                    </button>

                    {/* Botón Mis Productos */}
                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'productos' 
                                ? 'btn-primary text-white shadow-sm' 
                                : 'btn-light bg-transparent text-dark'
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
                                activeTab === 'mensajes' 
                                    ? 'btn-primary text-white shadow-sm' 
                                    : 'btn-light bg-transparent text-dark'
                            }`}
                            style={{ borderRadius: '8px' }}
                            onClick={() => setActiveTab('mensajes')}
                        >
                            <MessagesSquare size={18} />
                            <span>Chat</span>
                        </button>
                    )}

                    {/* Botón Mi Perfil */}
                    <button
                        type="button"
                        className={`btn w-100 d-flex align-items-center gap-2 py-2 px-3 border-0 fw-medium text-start ${
                            activeTab === 'perfil' 
                                ? 'btn-primary text-white shadow-sm' 
                                : 'btn-light bg-transparent text-dark'
                        }`}
                        style={{ borderRadius: '8px' }}
                        onClick={() => setActiveTab('perfil')}
                    >
                        <User size={18} />
                        <span>Mi Perfil</span>
                    </button>
                </div>

                {/* Sección Inferior: Cerrar Sesión */}
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

            {/* ÁREA PRINCIPAL: Renderizado modular según la pestaña activa */}
            <main className="flex-grow-1 p-4 overflow-auto">
                {activeTab === 'inicio' && <InicioDash />}
                {activeTab === 'productos' && <MisProductos />}
                {activeTab === 'perfil' && <MiPerfil />}
                {activeTab === 'mensajes' && <ChatInterno />}
            </main>
        </div>
    );
};