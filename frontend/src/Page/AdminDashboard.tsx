import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, ShieldCheck, Package, 
    LogOut, Home, MessageSquare, 
    Bell, Check, X, Tags, UserPlus,
    AlertTriangle, Loader2, Mail } from 'lucide-react';
import { UsuariosView } from './Emprendedoresview';
import { ProductosView } from './Productosview';
import { ModeracionView } from './Moderacionview';
import { CategoriasView } from './Categoriasview';
import { ChatInterno } from '../components/ChatInterno';

const UsuariosViewWithActions = UsuariosView as React.ComponentType<{
    onEmprendedorCreado: () => void;
    onOpenModal: () => void;
}>;

export interface AdminDashboardStatsDTO {
    totalEmprendedores: number;
    emprendedoresActivos: number;
    emprendedoresSuspendidos: number;
    totalAdmins: number;
    emprendedoresRechazados: number;
    totalProductos: number;
    productosPendientes: number;
}

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

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ModalNuevoEmprendedor: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rubro: '',
        telefono: '',
    });
    const [loadingSave, setLoadingSave] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSave(true);
        setModalError(null); // Limpiar errores previos

        try {
            const response = await fetch('/api/admin/dashboard/emprendedores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({ nombre: '', email: '', rubro: '', telefono: '' });
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json().catch(() => null);
                setModalError(errorData?.message || 'No se pudo registrar el emprendedor. Revisa los datos ingresados.');
            }
        } catch (error) {
            setModalError('Error al registrar emprendedor:');
            setModalError('Error de conexión con el servidor. Inténtalo de nuevo.');
        } finally {
            setLoadingSave(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Registrar Nuevo Emprendedor</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={loadingSave}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Alerta de Error en la Vista */}
                            {modalError && (
                                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3" role="alert">
                                    <AlertTriangle size={16} />
                                    <span>{modalError}</span>
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        required
                                        disabled={loadingSave}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={loadingSave}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Rubro</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.rubro}
                                        onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                                        disabled={loadingSave}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        disabled={loadingSave}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loadingSave}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={loadingSave}>
                                {loadingSave ? (
                                    <>
                                        <Loader2 size={16} className="spinner-border spinner-border-sm" /> Guardando...
                                    </>
                                ) : (
                                    'Guardar Emprendedor'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [activeTab, setActiveTab] = useState<'inicio' | 'emprendedores' | 'productos' | 'moderacion' | 'categorias' | 'mensajes' | 'usuarios'>('inicio');
    const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'contenido' | 'usuarios'>('Todos');
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados de Error en Vista
    const [dashError, setDashError] = useState<string | null>(null);
    const [moderacionError, setModeracionError] = useState<string | null>(null);

    // Estado para las métricas
    const [stats, setStats] = useState<AdminDashboardStatsDTO>({
        totalEmprendedores: 0,
        emprendedoresActivos: 0,
        emprendedoresSuspendidos: 0,
        totalAdmins: 0,
        emprendedoresRechazados: 0,
        totalProductos: 0,
        productosPendientes: 0
    });

    const [loadingStats, setLoadingStats] = useState<boolean>(true);
    const [loadingModeracion, setLoadingModeracion] = useState<boolean>(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>([]);
    const [itemsModeracion, setItemsModeracion] = useState<ModeracionItem[]>([]);

    // Fetch Métricas Generales
    const fetchDashboardStats = async () => {
        try {
            setLoadingStats(true);
            const response = await fetch('/api/admin/dashboard/stats');
            if (response.ok) {
                const data: AdminDashboardStatsDTO = await response.json();
                setStats(data);
            } else {
                setDashError('No se pudieron cargar las estadísticas principales.');
            }
        } catch (error) {
            console.error('Error al obtener métricas:', error);
            setDashError('Error de red al conectar con el servidor.');
        } finally {
            setLoadingStats(false);
        }
    };

    // Fetch Tabla de Moderación Reciente
    const fetchModeracionReciente = async () => {
        try {
            setLoadingModeracion(true);
            setModeracionError(null);
            const response = await fetch('/api/admin/dashboard/moderacion/reciente');
            if (response.ok) {
                const data = await response.json();
                setItemsModeracion(data);
            } else {
                setModeracionError('No se pudieron recuperar los elementos de moderación.');
            }
        } catch (error) {
            console.error('Error al obtener moderación:', error);
            setModeracionError('Fallo al comunicarse con el servidor.');
        } finally {
            setLoadingModeracion(false);
        }
    };

    // Fetch Notificaciones
    const fetchNotificaciones = async () => {
        try {
            const response = await fetch('/api/admin/dashboard/notificaciones');
            if (response.ok) {
                const data = await response.json();
                setNotificaciones(data);
            }
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'inicio') {
            fetchDashboardStats();
            fetchModeracionReciente();
            fetchNotificaciones();
        }
    }, [activeTab]);

    const noLeidasCount = notificaciones.filter(n => !n.leida).length;

    const handleMarcarTodasLeidas = async () => {
        try {
            const response = await fetch('/api/admin/dashboard/notificaciones/marcar-leidas', { method: 'PUT' });
            if (response.ok) {
                setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
            }
        } catch (error) {
            console.error('Error al marcar notificaciones como leídas:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEmprendedorCreado = () => {
        fetchDashboardStats();
    };

    const handleAprobar = async (id: number) => {
        try {
            setActionLoadingId(id);
            setModeracionError(null);
            const response = await fetch(`/api/admin/dashboard/productos/${id}/estado?nuevoEstado=APROBADO`, {
                method: 'PUT'
            });

            if (response.ok) {
                setItemsModeracion(prev =>
                    prev.map(item => item.id === id ? { ...item, estado: 'Aprobado' } : item)
                );
                fetchDashboardStats();
            } else {
                setModeracionError('No se pudo aprobar el elemento seleccionado.');
            }
        } catch (error) {
            console.error('Error al aprobar item:', error);
            setModeracionError('Ocurrió un error al procesar la aprobación.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRechazar = async (id: number) => {
        try {
            setActionLoadingId(id);
            setModeracionError(null);
            const response = await fetch(`/api/admin/dashboard/productos/${id}/estado?nuevoEstado=RECHAZADO`, {
                method: 'PUT'
            });

            if (response.ok) {
                setItemsModeracion(prev =>
                    prev.map(item => item.id === id ? { ...item, estado: 'Rechazado' } : item)
                );
                fetchDashboardStats();
            } else {
                setModeracionError('No se pudo rechazar el elemento seleccionado.');
            }
        } catch (error) {
            console.error('Error al rechazar item:', error);
            setModeracionError('Ocurrió un error al procesar el rechazo.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const itemsFiltrados = itemsModeracion.filter(item => 
        filtroEstado === 'Todos' ? true : item.tipo === filtroEstado
    );

    const nombreAdmin = 'Administrador';
    const inicialAdmin = nombreAdmin.charAt(0).toUpperCase();

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
                    <div className="position-relative">
                        <button 
                            className="btn btn-link text-white p-0 position-relative"
                            onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                            aria-label="Ver notificaciones"
                        >
                            <Bell size={20} />
                            {noLeidasCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                                    {noLeidasCount}
                                </span>
                            )}
                        </button>

                        {mostrarNotificaciones && (
                            <div className="position-absolute end-0 mt-2 card shadow-lg text-dark border-0" style={{ width: '320px', zIndex: 1050 }}>
                                <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                                    <h6 className="fw-bold mb-0">Notificaciones</h6>
                                    {noLeidasCount > 0 && (
                                        <button 
                                            className="btn btn-sm btn-link p-0 text-decoration-none"
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
                                                        <span className="text-muted small">{n.tiempo}</span>
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
                            <span className="fw-bold fs-7">{inicialAdmin}</span>
                        </div>
                        <span className="small fw-semibold d-none d-sm-inline">{nombreAdmin}</span>
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
                                className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'mensajes' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setActiveTab('mensajes')}
                            >
                                <MessageSquare size={18} /> Mensajes
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
                            {/* Alerta de Error Principal */}
                            {dashError && (
                                <div className="alert alert-danger d-flex align-items-center justify-content-between mb-4 shadow-sm" role="alert">
                                    <div className="d-flex align-items-center gap-2">
                                        <AlertTriangle size={18} />
                                        <span>{dashError}</span>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger" onClick={fetchDashboardStats}>Reintentar</button>
                                </div>
                            )}

                            {/* Banner de Bienvenida */}
                            <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
                                <h5 className="alert-heading fw-bold mb-1 fs-6">Bienvenido admin: {nombreAdmin}</h5>
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
                                            <span className="display-6 fw-bold">
                                                {loadingStats ? (
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                ) : (
                                                    stats.totalEmprendedores
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                                            <div>
                                                <ShieldCheck className="text-primary mb-2" size={32} />
                                                <h6 className="card-subtitle text-muted mb-1">Moderar (Pendientes)</h6>
                                                <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('moderacion')}>Abrir</button>
                                            </div>
                                            <span className="display-6 fw-bold">
                                                {loadingStats ? (
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                ) : (
                                                    stats.productosPendientes
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                                            <div>
                                                <Package className="text-primary mb-2" size={32} />
                                                <h6 className="card-subtitle text-muted mb-1">Productos Totales</h6>
                                                <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('productos')}>Abrir</button>
                                            </div>
                                            <span className="display-6 fw-bold">
                                                {loadingStats ? (
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                                ) : (
                                                    stats.totalProductos
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Métricas Secundarias */}
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                Emprendedores totales: 
                                {loadingStats ? (
                                    <span className="spinner-border spinner-border-sm text-secondary" role="status"></span>
                                ) : (
                                    stats.totalEmprendedores
                                )}
                            </h6>
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold small">ACTIVOS</span>
                                            <h3 className="fw-bold my-1">
                                                {loadingStats ? <div className="spinner-border spinner-border-sm text-primary" /> : stats.emprendedoresActivos}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold small">SUSPENDIDOS</span>
                                            <h3 className="fw-bold my-1">
                                                {loadingStats ? <div className="spinner-border spinner-border-sm text-primary" /> : stats.emprendedoresSuspendidos}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold small">ADMINS</span>
                                            <h3 className="fw-bold my-1">
                                                {loadingStats ? <div className="spinner-border spinner-border-sm text-primary" /> : stats.totalAdmins}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body p-3">
                                            <span className="text-muted text-uppercase fw-semibold small">RECHAZADOS</span>
                                            <h3 className="fw-bold my-1">
                                                {loadingStats ? <div className="spinner-border spinner-border-sm text-primary" /> : stats.emprendedoresRechazados}
                                            </h3>
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

                                    {/* Alerta de error en la tabla de moderación */}
                                    {moderacionError && (
                                        <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                                            <AlertTriangle size={16} />
                                            <span>{moderacionError}</span>
                                        </div>
                                    )}

                                    <div className="table-responsive">
                                        <table className="table align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Usuario</th>
                                                    <th>Detalle</th>
                                                    <th>Tipo</th>
                                                    <th>Estado</th>
                                                    <th className="text-end">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadingModeracion ? (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-4">
                                                            <div className="spinner-border spinner-border-sm text-primary me-2" /> Cargando lista...
                                                        </td>
                                                    </tr>
                                                ) : itemsFiltrados.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-4 text-muted">
                                                            No hay elementos para moderar.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    itemsFiltrados.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.usuario}</td>
                                                            <td>{item.contenido}</td>
                                                            <td>
                                                                <span className={`badge ${item.tipo === 'contenido' ? 'bg-info' : 'bg-warning'} text-dark`}>
                                                                    {item.tipo}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    item.estado === 'Aprobado' ? 'bg-success' : 
                                                                    item.estado === 'Rechazado' ? 'bg-danger' : 'bg-secondary'
                                                                }`}>
                                                                    {item.estado}
                                                                </span>
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="btn-group btn-group-sm">
                                                                    <button
                                                                        className="btn btn-outline-success p-1"
                                                                        onClick={() => handleAprobar(item.id)}
                                                                        disabled={actionLoadingId === item.id || item.estado !== 'Pendiente'}
                                                                        title="Aprobar"
                                                                    >
                                                                        {actionLoadingId === item.id ? (
                                                                            <Loader2 size={14} className="spinner-border spinner-border-sm" />
                                                                        ) : (
                                                                            <Check size={14} />
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-outline-danger p-1"
                                                                        onClick={() => handleRechazar(item.id)}
                                                                        disabled={actionLoadingId === item.id || item.estado !== 'Pendiente'}
                                                                        title="Rechazar"
                                                                    >
                                                                        {actionLoadingId === item.id ? (
                                                                            <Loader2 size={14} className="spinner-border spinner-border-sm" />
                                                                        ) : (
                                                                            <X size={14} />
                                                                        )}
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
                        </div>
                    )}

                    {/* Vistas Secundarias por Pestaña */}
                    {activeTab === 'emprendedores' && (
                        <UsuariosViewWithActions 
                            onEmprendedorCreado={handleEmprendedorCreado} 
                            onOpenModal={() => setIsModalOpen(true)}
                        />
                    )}
                    {activeTab === 'productos' && <ProductosView />}
                    {activeTab === 'moderacion' && <ModeracionView />}
                    {activeTab === 'categorias' && <CategoriasView />}
                    {activeTab === 'mensajes' && <ChatInterno />}
                </main>
            </div>

            {/* Modal para alta de Emprendedores */}
            <ModalNuevoEmprendedor 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleEmprendedorCreado}
            />
        </div>
    );
};