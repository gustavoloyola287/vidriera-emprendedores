import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit, Ban, Trash2, CheckCircle2, Plus, RefreshCw, UserPlus, Loader2, AlertTriangle, XCircle } from 'lucide-react';

export interface AdminUsuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'SUPER_ADMIN';
    estado: 'ACTIVO' | 'SUSPENDIDO' | 'RECHAZADO';
}

interface AdminsViewProps {
    onAdminCreado: () => void;
}

export const AdminsView: React.FC<AdminsViewProps> = ({ onAdminCreado }) => {
    const [admins, setAdmins] = useState<AdminUsuario[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [errorApi, setErrorApi] = useState<string | null>(null);

    const [metricas, setMetricas] = useState({ activos: 0, suspendidos: 0, total: 0 });

    const [busquedaInput, setBusquedaInput] = useState<string>('');
    const [busquedaAplicada, setBusquedaAplicada] = useState<string>('');
    const [filtroEstadoCard, setFiltroEstadoCard] = useState<string>('TODOS');
    
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const elementosPorPagina = 5;

    const [adminAEditar, setAdminAEditar] = useState<AdminUsuario | null>(null);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState<boolean>(false);
    const [nuevoAdmin, setNuevoAdmin] = useState({ nombre: '', email: '', password: '' });
    const [loadingAdmin, setLoadingAdmin] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    // ✅ Estado para el sistema de Toasts multiestado
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

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const obtenerAdmins = async () => {
        setCargando(true);
        setErrorApi(null);
        try {
            const response = await fetch('/api/admin/listar-admins', {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            
            const adminsMapeados: AdminUsuario[] = data.map((emp: any) => {
                let rolNormalizado: 'ADMIN' | 'SUPER_ADMIN' = 'ADMIN';
                if (emp.rol === 'ROLE_SUPER_ADMIN' || emp.rol === 'SUPER_ADMIN') rolNormalizado = 'SUPER_ADMIN';
                
                return {
                    id: emp.id,
                    nombre: emp.nombre_completo || emp.nombre || 'Sin nombre',
                    email: emp.email || 'Sin email',
                    rol: rolNormalizado,
                    estado: emp.estado || 'ACTIVO'
                };
            });

            setAdmins(adminsMapeados);
            mostrarToast("Lista de administradores actualizada", "success");
        } catch (err: any) {
            console.error("Error al cargar administradores:", err);
            setErrorApi("No se pudo conectar con el servidor.");
            mostrarToast("No se pudo conectar con el servidor", "danger");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerAdmins();
    }, []);

    useEffect(() => {
        const activos = admins.filter(u => u.estado === 'ACTIVO').length;
        const suspendidos = admins.filter(u => u.estado === 'SUSPENDIDO').length;
        setMetricas({ activos, suspendidos, total: admins.length });
    }, [admins]);

    const handleCrearAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAdmin(true);
        try {
            const response = await fetch('/api/admin/crear-admin', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(nuevoAdmin)
            });
            const data = await response.json();
            if (response.ok) {
                setNuevoAdmin({ nombre: '', email: '', password: '' });
                setIsCrearModalOpen(false);
                obtenerAdmins();
                onAdminCreado();
                mostrarToast(data.message || 'Administrador creado con éxito', 'success');
            } else {
                const msg = data.error || 'No se pudo crear el administrador';
                mostrarToast(msg, 'warning');
            }
        } catch (error) {
            mostrarToast('Error de conexión al crear el administrador.', 'danger');
        } finally {
            setLoadingAdmin(false);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este administrador? Esta acción no se puede deshacer.')) return;
        try {
            const response = await fetch(`/api/admin/eliminar-admin/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                setAdmins(prev => prev.filter(u => u.id !== id));
                mostrarToast('Administrador eliminado correctamente', 'success');
            } else {
                mostrarToast('No se pudo eliminar el administrador.', 'warning');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            mostrarToast('Error de conexión al intentar eliminar.', 'danger');
        }
    };

    const handleToggleSuspender = async (id: number) => {
        try {
            setActionLoadingId(id);
            const admin = admins.find(a => a.id === id);
            if (!admin) return;
            
            const nuevoEstado = admin.estado === 'SUSPENDIDO' ? 'ACTIVO' : 'SUSPENDIDO';
            const response = await fetch(`/api/admin/admins/${id}/estado?nuevoEstado=${nuevoEstado}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                setAdmins(prev => prev.map(u => u.id === id ? { ...u, estado: nuevoEstado } : u));
                mostrarToast(`Administrador ${nuevoEstado === 'SUSPENDIDO' ? 'suspendido' : 'activado'}`, 'success');
            } else {
                mostrarToast('No se pudo cambiar el estado.', 'warning');
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            mostrarToast('Error de conexión.', 'danger');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleAbrirEdicion = (admin: AdminUsuario) => {
        setAdminAEditar({ ...admin });
    };

    const handleGuardarEdicion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminAEditar) return;
        try {
            const response = await fetch(`/api/admin/admins/${adminAEditar.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    nombreCompleto: adminAEditar.nombre,
                    email: adminAEditar.email
                })
            });
            if (response.ok) {
                setAdmins(prev => prev.map(u => u.id === adminAEditar.id ? adminAEditar : u));
                setAdminAEditar(null);
                mostrarToast('Administrador actualizado con éxito', 'success');
            } else {
                mostrarToast('No se pudo actualizar el administrador.', 'warning');
            }
        } catch (error) {
            console.error('Error al editar:', error);
            mostrarToast('Error de conexión.', 'danger');
        }
    };

    const adminsFiltrados = useMemo(() => {
        return admins.filter(u => {
            const coincideBusqueda = 
                u.nombre.toLowerCase().includes(busquedaAplicada.toLowerCase()) ||
                u.email.toLowerCase().includes(busquedaAplicada.toLowerCase());
            const coincideCard = filtroEstadoCard === 'TODOS' || u.estado === filtroEstadoCard;
            return coincideBusqueda && coincideCard;
        });
    }, [admins, busquedaAplicada, filtroEstadoCard]);

    const totalPaginas = Math.ceil(adminsFiltrados.length / elementosPorPagina) || 1;
    const adminsPaginados = useMemo(() => {
        const inicio = (paginaActual - 1) * elementosPorPagina;
        return adminsFiltrados.slice(inicio, inicio + elementosPorPagina);
    }, [adminsFiltrados, paginaActual]);

    const handleCardClick = (filtro: string) => {
        setFiltroEstadoCard(prev => prev === filtro ? 'TODOS' : filtro);
        setPaginaActual(1);
    };

    const handleBuscar = () => {
        setBusquedaAplicada(busquedaInput);
        setPaginaActual(1);
    };

    const renderBadgeEstado = (estado: AdminUsuario['estado']) => {
        switch (estado) {
            case 'ACTIVO': return <span className="badge bg-success-subtle text-success border border-success px-2 py-1">Activo</span>;
            case 'SUSPENDIDO': return <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1">Suspendido</span>;
            case 'RECHAZADO': return <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1">Rechazado</span>;
            default: return <span className="badge bg-warning-subtle text-warning border border-warning px-2 py-1">Pendiente</span>;
        }
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
            {/* ✅ TOAST EMERGENTE FLOTANTE MULTIESTADO */}
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

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Gestión de Administradores</h5>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={obtenerAdmins}>
                        <RefreshCw size={14} className={cargando ? 'spin' : ''} /> Recargar
                    </button>
                    <button className="btn btn-success d-flex align-items-center gap-1" onClick={() => setIsCrearModalOpen(true)}>
                        <UserPlus size={16} /> Nuevo Administrador
                    </button>
                </div>
            </div>

            {errorApi && (
                <div className="alert alert-danger py-2 small" role="alert">{errorApi}</div>
            )}

            {/* CARDS SUPERIORES */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className={`card border-0 shadow-sm border-start border-success border-4 ${filtroEstadoCard === 'ACTIVO' ? 'bg-success-subtle' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleCardClick('ACTIVO')}>
                        <div className="card-body p-3">
                            <span className="text-muted small fw-semibold">Activos</span>
                            <h2 className="fw-bold my-1 text-success">{metricas.activos}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`card border-0 shadow-sm border-start border-secondary border-4 ${filtroEstadoCard === 'SUSPENDIDO' ? 'bg-secondary-subtle' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleCardClick('SUSPENDIDO')}>
                        <div className="card-body p-3">
                            <span className="text-muted small fw-semibold">Suspendidos</span>
                            <h2 className="fw-bold my-1 text-secondary">{metricas.suspendidos}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`card border-0 shadow-sm border-start border-primary border-4`}>
                        <div className="card-body p-3">
                            <span className="text-muted small fw-semibold">Total</span>
                            <h2 className="fw-bold my-1 text-primary">{metricas.total}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="row g-2">
                        <div className="col-md-9 position-relative">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                            <input 
                                type="text" 
                                className="form-control ps-5" 
                                placeholder="Buscar por nombre o email..." 
                                value={busquedaInput}
                                onChange={(e) => setBusquedaInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                            />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary w-100" onClick={handleBuscar}>Buscar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando ? (
                                    <tr><td colSpan={5} className="text-center py-4 text-muted">Cargando administradores...</td></tr>
                                ) : adminsPaginados.length > 0 ? (
                                    adminsPaginados.map((admin) => (
                                        <tr key={admin.id}>
                                            <td className="fw-semibold">{admin.nombre}</td>
                                            <td>{admin.email}</td>
                                            <td>
                                                <span className={`badge ${admin.rol === 'SUPER_ADMIN' ? 'bg-purple text-white' : 'bg-info text-dark'}`}>
                                                    {admin.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                                                </span>
                                            </td>
                                            <td>{renderBadgeEstado(admin.estado)}</td>
                                            <td className="text-end">
                                                <div className="d-flex align-items-center justify-content-end gap-1 flex-nowrap">
                                                    <button className="btn btn-sm btn-outline-primary px-2" onClick={() => handleAbrirEdicion(admin)}>
                                                        <Edit size={14} /> Editar
                                                    </button>
                                                    <button 
                                                        className={`btn btn-sm ${admin.estado === 'SUSPENDIDO' ? 'btn-outline-success' : 'btn-outline-warning'} px-2`}
                                                        onClick={() => handleToggleSuspender(admin.id)}
                                                        disabled={actionLoadingId === admin.id}
                                                    >
                                                        {actionLoadingId === admin.id ? (
                                                            <Loader2 size={14} className="spinner-border spinner-border-sm" />
                                                        ) : admin.estado === 'SUSPENDIDO' ? (
                                                            <><CheckCircle2 size={14} /> Activar</>
                                                        ) : (
                                                            <><Ban size={14} /> Suspender</>
                                                        )}
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger px-2" onClick={() => handleEliminar(admin.id)}>
                                                        <Trash2 size={14} /> Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center py-4 text-muted">No se encontraron administradores.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                    <span className="small text-muted">
                        {adminsFiltrados.length > 0 ? `Mostrando ${((paginaActual - 1) * elementosPorPagina) + 1} a ${Math.min(paginaActual * elementosPorPagina, adminsFiltrados.length)} de ${adminsFiltrados.length} administradores` : 'Sin resultados'}
                    </span>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}>Anterior</button>
                        </li>
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                            <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPaginaActual(num)}>{num}</button>
                            </li>
                        ))}
                        <li className={`page-item ${paginaActual >= totalPaginas ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}>Siguiente</button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* MODAL CREAR */}
            {isCrearModalOpen && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h6 className="modal-title fw-bold">Crear Nuevo Administrador</h6>
                                <button type="button" className="btn-close" onClick={() => setIsCrearModalOpen(false)}></button>
                            </div>
                            <form onSubmit={handleCrearAdmin}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Nombre Completo</label>
                                        <input type="text" className="form-control form-control-sm" value={nuevoAdmin.nombre} onChange={(e) => setNuevoAdmin({...nuevoAdmin, nombre: e.target.value})} required disabled={loadingAdmin} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Email</label>
                                        <input type="email" className="form-control form-control-sm" value={nuevoAdmin.email} onChange={(e) => setNuevoAdmin({...nuevoAdmin, email: e.target.value})} required disabled={loadingAdmin} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Contraseña Temporal</label>
                                        <input type="password" className="form-control form-control-sm" value={nuevoAdmin.password} onChange={(e) => setNuevoAdmin({...nuevoAdmin, password: e.target.value})} required disabled={loadingAdmin} minLength={6} />
                                    </div>
                                </div>
                                <div className="modal-footer py-2">
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsCrearModalOpen(false)} disabled={loadingAdmin}>Cancelar</button>
                                    <button type="submit" className="btn btn-sm btn-primary d-flex align-items-center gap-2" disabled={loadingAdmin}>
                                        {loadingAdmin ? <Loader2 size={14} className="spinner-border spinner-border-sm" /> : <UserPlus size={14} />}
                                        {loadingAdmin ? 'Creando...' : 'Crear Administrador'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR */}
            {adminAEditar && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h6 className="modal-title fw-bold">Editar Administrador</h6>
                                <button type="button" className="btn-close" onClick={() => setAdminAEditar(null)}></button>
                            </div>
                            <form onSubmit={handleGuardarEdicion}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Nombre</label>
                                        <input type="text" className="form-control form-control-sm" value={adminAEditar.nombre} onChange={(e) => setAdminAEditar({ ...adminAEditar, nombre: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Email</label>
                                        <input type="email" className="form-control form-control-sm" value={adminAEditar.email} onChange={(e) => setAdminAEditar({ ...adminAEditar, email: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="modal-footer py-2">
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setAdminAEditar(null)}>Cancelar</button>
                                    <button type="submit" className="btn btn-sm btn-primary">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminsView;