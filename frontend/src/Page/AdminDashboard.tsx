import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    ShieldCheck, 
    Package, 
    LogOut, 
    Home, 
    Settings, 
    Bell, 
    Check, 
    X,
    Tags,
    UserPlus,
    AlertTriangle
} from 'lucide-react';
import { UsuariosView } from './emprendedoresview';
import { ProductosView } from './productosview';
import { ModeracionView as ModeracionView } from './moderacionview';
// Estrutura DTO para Notificaciones
export interface NotificacionItem {
    id: number;
    titulo: string;
    descripcion: string;
    tiempo: string;
    leida: boolean;
    tipo: 'registro' | 'producto' | 'reporte';
}

export interface ModeracionItem {
    id: number;
    usuario: string;
    contenido: string;
    estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
    tipo: 'contenido' | 'usuarios';
}

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [activeTab, setActiveTab] = useState<'inicio' | 'emprendedores' | 'productos' | 'moderacion' | 'categorias' | 'ajustes' | 'usuarios'>('inicio');
    const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'contenido' | 'usuarios'>('Todos');
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    // Estado para las Notificaciones
    const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>([
        { id: 1, titulo: 'Nuevo emprendedor', descripcion: 'Panadería San Carlos solicitó registro.', tiempo: 'Hace 5 min', leida: false, tipo: 'registro' },
        { id: 2, titulo: 'Producto a moderar', descripcion: 'Vidrio templado 10mm requiere aprobación.', tiempo: 'Hace 20 min', leida: false, tipo: 'producto' },
        { id: 3, titulo: 'Reporte recibido', descripcion: 'Comentario reportado en publicación de Laura.', tiempo: 'Hace 1 hora', leida: false, tipo: 'reporte' },
    ]);

    // Contador de notificaciones no leídas
    const noLeidasCount = notificaciones.filter(n => !n.leida).length;

    // Marcar todas como leídas
    const handleMarcarTodasLeidas = () => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [itemsModeracion, setItemsModeracion] = useState<ModeracionItem[]>([
        { id: 1, usuario: 'Santiago Rossi', contenido: 'Publicación de vidrio templado 10mm', estado: 'Pendiente', tipo: 'contenido' },
        { id: 2, usuario: 'Laura Benítez', contenido: 'Comentario ofensivo reportado', estado: 'Aprobado', tipo: 'contenido' },
        { id: 3, usuario: 'Carlos G.', contenido: 'Espejo biselado Premium x5', estado: 'Pendiente', tipo: 'contenido' },
        { id: 4, usuario: 'Sofía Martínez', contenido: 'Imagen de perfil no autorizada', estado: 'Rechazado', tipo: 'usuarios' },
    ]);

    const handleAprobar = (id: number) => {
        setItemsModeracion(prev =>
            prev.map(item => item.id === id ? { ...item, estado: 'Aprobado' } : item)
        );
    };

    const handleRechazar = (id: number) => {
        setItemsModeracion(prev =>
            prev.map(item => item.id === id ? { ...item, estado: 'Rechazado' } : item)
        );
    };

    const itemsFiltrados = itemsModeracion.filter(item => 
        filtroEstado === 'Todos' ? true : item.tipo === filtroEstado
    );

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            {/* Top Header */}
            <header className="navbar navbar-expand navbar-dark px-3 shadow-sm" style={{ backgroundColor: '#0f2b48' }}>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-dark d-md-none p-1">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <span className="navbar-brand mb-0 h1 fw-bold fs-5">Administración</span>
                </div>

                <div className="ms-auto d-flex align-items-center gap-3 text-white">
                    {/* Botón de Notificaciones con Badge Numérico y Dropdown */}
                    <div className="position-relative">
                        <button 
                            className="btn btn-link text-white p-0 position-relative"
                            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                            aria-label="Ver notificaciones"
                        >
                            <Bell size={20} />
                            {noLeidasCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-7" style={{ fontSize: '0.65rem' }}>
                                    {noLeidasCount}
                                </span>
                            )}
                        </button>

                        {/* Menú Desplegable de Notificaciones */}
                        {mostrarNotificaciones && (
                            <div className="position-absolute end-0 mt-2 card shadow-lg text-dark border-0" style={{ width: '320px', zIndex: 1050 }}>
                                <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                                    <h6 className="fw-bold mb-0">Notificaciones</h6>
                                    {noLeidasCount > 0 && (
                                        <button 
                                            className="btn btn-sm btn-link p-0 text-decoration-none style-micro"
                                            onClick={handleMarcarTodasLeidas}
                                        >
                                            Marcar leídas
                                        </button>
                                    )}
                                </div>
                                <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '280px' }}>
                                    {notificaciones.length === 0 ? (
                                        <div className="p-3 text-center text-muted small">No hay notificaciones</div>
                                    ) : (
                                        notificaciones.map((n) => (
                                            <div 
                                                key={n.id} 
                                                className={`list-group-item list-group-item-action p-2 d-flex gap-2 align-items-start ${!n.leida ? 'bg-light' : ''}`}
                                            >
                                                <div className="mt-1">
                                                    {n.tipo === 'registro' && <UserPlus size={16} className="text-primary" />}
                                                    {n.tipo === 'producto' && <Package size={16} className="text-warning" />}
                                                    {n.tipo === 'reporte' && <AlertTriangle size={16} className="text-danger" />}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <strong className="small">{n.titulo}</strong>
                                                        <span className="text-muted style-micro">{n.tiempo}</span>
                                                    </div>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>{n.descripcion}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            <span className="fw-bold fs-7">M</span>
                        </div>
                        <span className="small fw-semibold d-none d-sm-inline">Marcos Admin</span>
                    </div>
                </div>
            </header>

            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="bg-white border-end d-flex flex-column justify-content-between p-3" style={{ width: '240px' }}>
                    <ul className="nav nav-pills flex-column gap-1">
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'inicio' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('inicio')}
                            >
                                <Home size={18} /> Inicio
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'emprendedores' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('emprendedores')}
                            >
                                <Users size={18} /> Emprendedores
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'productos' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('productos')}
                            >
                                <Package size={18} /> Productos
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'moderacion' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('moderacion')}
                            >
                                <ShieldCheck size={18} /> Moderación
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'categorias' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('categorias')}
                            >
                                <Tags size={18} /> Categorías
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'ajustes' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('ajustes')}
                            >
                                <Settings size={18} /> Ajustes
                            </button>
                        </li>
                    </ul>

                    <button 
                        onClick={handleLogout}
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100 border-0"
                    >
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </aside>

                {/* Dynamic Content */}
                <main className="flex-grow-1 p-4 overflow-auto">
                    {activeTab === 'inicio' && (
                        <div className="container-fluid p-0">
                            {/* Banner */}
                            <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
                                <h5 className="alert-heading fw-bold mb-1 fs-6">Bienvenido admin: Marcos</h5>
                                <p className="mb-0 small">Aquí podrás Administrar Emprendedores, Moderar Contenidos y Gestionar Productos.</p>
                            </div>

                            {/* Accesos Directos */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                                            <div>
                                                <Users className="text-primary mb-2" size={32} />
                                                <h6 className="card-subtitle text-muted mb-1">Emprendedores</h6>
                                                <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('emprendedores')}>Abrir</button>
                                            </div>
                                            <span className="display-6 fw-bold">10</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                                            <div>
                                                <ShieldCheck className="text-primary mb-2" size={32} />
                                                <h6 className="card-subtitle text-muted mb-1">Moderar</h6>
                                                <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('moderacion')}>Abrir</button>
                                            </div>
                                            <span className="display-6 fw-bold">5</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                                            <div>
                                                <Package className="text-primary mb-2" size={32} />
                                                <h6 className="card-subtitle text-muted mb-1">Productos</h6>
                                                <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('productos')}>Abrir</button>
                                            </div>
                                            <span className="display-6 fw-bold">30</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Métricas de Emprendedores */}
                            <h6 className="fw-bold mb-3">Emprendedores totales: 150</h6>
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold style-micro">ACTIVOS</span>
                                            <h3 className="fw-bold my-1">25</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold style-micro">SUSPENDIDOS</span>
                                            <h3 className="fw-bold my-1">5</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold style-micro">ADMINS</span>
                                            <h3 className="fw-bold my-1">2</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold style-micro">RECHAZADOS</span>
                                            <h3 className="fw-bold my-1">3</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Moderación Reciente */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">Moderación Reciente</h6>
                                        <select 
                                            className="form-select form-select-sm w-auto"
                                            value={filtroEstado}
                                            onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | 'contenido' | 'usuarios')}
                                        >
                                            <option value="Todos">Todos los tipos</option>
                                            <option value="contenido">Contenido</option>
                                            <option value="usuarios">Usuarios</option>
                                        </select>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Usuario</th>
                                                    <th>Contenido</th>
                                                    <th>Estado</th>
                                                    <th className="text-end">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {itemsFiltrados.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.usuario}</td>
                                                        <td>{item.contenido}</td>
                                                        <td>
                                                            <span className={`badge ${
                                                                item.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                                                item.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'
                                                            }`}>
                                                                {item.estado}
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <button 
                                                                className="btn btn-sm btn-success me-1"
                                                                onClick={() => handleAprobar(item.id)}
                                                                disabled={item.estado === 'Aprobado'}
                                                            >
                                                                <Check size={14} /> Aprobar
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleRechazar(item.id)}
                                                                disabled={item.estado === 'Rechazado'}
                                                            >
                                                                <X size={14} /> Rechazar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'emprendedores' && <UsuariosView />}
                    {activeTab === 'productos' && <ProductosView />}
                    {activeTab === 'moderacion' && <ModeracionView />}
                </main>
            </div>
        </div>
    );
};