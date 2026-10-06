import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit, Ban, Trash2, CheckCircle2, Plus, RefreshCw } from 'lucide-react';
import ModalNuevoEmprendedor from '../components/modalemprendedor';

const API_URL = 'http://localhost:8080/api/emprendedores';

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: 'ADMIN' | 'EMPRENDEDOR' | 'MODERADOR' | 'SUPER_ADMIN';
    estado: 'ACTIVO' | 'SUSPENDIDO' | 'RECHAZADO' | 'PENDIENTE';
}

interface Metricas {
    activos: number;
    suspendidos: number;
    admins: number;
    rechazados: number;
    total: number;
}

export const UsuariosView: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [errorApi, setErrorApi] = useState<string | null>(null);

    const [metricas, setMetricas] = useState<Metricas>({ activos: 0, suspendidos: 0, admins: 0, rechazados: 0, total: 0 });

    const [filtroEstadoCard, setFiltroEstadoCard] = useState<string>('TODOS');
    const [filtroRolSelect, setFiltroRolSelect] = useState<string>('TODOS');
    const [busquedaInput, setBusquedaInput] = useState<string>('');
    const [busquedaAplicada, setBusquedaAplicada] = useState<string>('');
    
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const elementosPorPagina = 5;

    const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState<boolean>(false);

    const obtenerEmprendedores = async () => {
        setCargando(true);
        setErrorApi(null);
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            
            const usuariosMapeados: Usuario[] = data.map((emp: any) => {
                let rolNormalizado: 'ADMIN' | 'EMPRENDEDOR' | 'MODERADOR' | 'SUPER_ADMIN' = 'EMPRENDEDOR';
                
                if (emp.rol === 'ROLE_ADMIN' || emp.rol === 'ADMIN') rolNormalizado = 'ADMIN';
                else if (emp.rol === 'ROLE_SUPER_ADMIN' || emp.rol === 'SUPER_ADMIN') rolNormalizado = 'SUPER_ADMIN';
                else if (emp.rol === 'ROLE_MODERADOR' || emp.rol === 'MODERADOR') rolNormalizado = 'MODERADOR';

                return {
                    id: emp.id,
                    nombre: emp.nombre_completo || emp.nombre || 'Sin nombre',
                    email: emp.email || 'Sin email',
                    telefono: emp.telefono || '',
                    rol: rolNormalizado,
                    estado: emp.estado || 'ACTIVO'
                };
            });

            setUsuarios(usuariosMapeados);
        } catch (err: any) {
            console.error("Error al conectar con EmprendedorController:", err);
            setErrorApi("No se pudo conectar con el servidor backend.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerEmprendedores();
    }, []);

    // ✅ CORREGIDO: Las métricas ahora calculan SOLO sobre los usuarios con rol EMPRENDEDOR
    useEffect(() => {
        const soloEmprendedores = usuarios.filter(u => u.rol === 'EMPRENDEDOR');

        const activos = soloEmprendedores.filter(u => u.estado === 'ACTIVO').length;
        const suspendidos = soloEmprendedores.filter(u => u.estado === 'SUSPENDIDO').length;
        const rechazados = soloEmprendedores.filter(u => u.estado === 'RECHAZADO').length;

        setMetricas({
            activos,
            suspendidos,
            admins: 0, // Mantenemos la propiedad pero en 0, ya que esta vista es solo para emprendedores
            rechazados,
            total: soloEmprendedores.length
        });
    }, [usuarios]);

    const handleEliminar = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este emprendedor permanentemente?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok || response.status === 204) {
                setUsuarios(prev => prev.filter(u => u.id !== id));
            } else {
                alert('No se pudo eliminar el registro en el servidor.');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error de conexión al intentar eliminar.');
        }
    };

    const handleToggleSuspender = async (id: number) => {
        setUsuarios(prev => prev.map(u => {
            if (u.id === id) {
                const nuevoEstado = u.estado === 'SUSPENDIDO' ? 'ACTIVO' : 'SUSPENDIDO';
                return { ...u, estado: nuevoEstado };
            }
            return u;
        }));
    };

    const handleAbrirEdicion = (usuario: Usuario) => {
        setUsuarioAEditar({ ...usuario });
    };

    const handleGuardarEdicion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioAEditar) return;
        setUsuarios(prev => prev.map(u => u.id === usuarioAEditar.id ? usuarioAEditar : u));
        setUsuarioAEditar(null);
    };

    // Filtrado estricto para OCULTAR Admins y Super Admins de esta vista
    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(u => {
            // 1. REGLA DE ORO: Si es Admin, Super Admin o Moderador, NO lo mostramos en esta lista
            if (u.rol === 'ADMIN' || u.rol === 'SUPER_ADMIN' || u.rol === 'MODERADOR') {
                return false; 
            }

            const coincideBusqueda = 
                u.nombre.toLowerCase().includes(busquedaAplicada.toLowerCase()) ||
                u.email.toLowerCase().includes(busquedaAplicada.toLowerCase());

            const coincideRol = filtroRolSelect === 'TODOS' || u.rol === filtroRolSelect;

            let coincideCard = true;
            if (filtroEstadoCard === 'ADMIN') {
                coincideCard = false; 
            } else if (filtroEstadoCard !== 'TODOS') {
                coincideCard = u.estado === filtroEstadoCard;
            }

            return coincideBusqueda && coincideRol && coincideCard;
        });
    }, [usuarios, busquedaAplicada, filtroRolSelect, filtroEstadoCard]);

    const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina) || 1;
    const usuariosPaginados = useMemo(() => {
        const inicio = (paginaActual - 1) * elementosPorPagina;
        return usuariosFiltrados.slice(inicio, inicio + elementosPorPagina);
    }, [usuariosFiltrados, paginaActual]);

    const handleCardClick = (filtro: string) => {
        setFiltroEstadoCard(prev => prev === filtro ? 'TODOS' : filtro);
        setPaginaActual(1);
    };

    const handleBuscar = () => {
        setBusquedaAplicada(busquedaInput);
        setPaginaActual(1);
    };

    const renderBadgeEstado = (estado: Usuario['estado']) => {
        switch (estado) {
            case 'ACTIVO': return <span className="badge bg-success-subtle text-success border border-success px-2 py-1">Activo</span>;
            case 'SUSPENDIDO': return <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1">Suspendido</span>;
            case 'RECHAZADO': return <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1">Rechazado</span>;
            default: return <span className="badge bg-warning-subtle text-warning border border-warning px-2 py-1">Pendiente</span>;
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Gestión de Emprendedores</h5>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={obtenerEmprendedores}>
                        <RefreshCw size={14} className={cargando ? 'spin' : ''} /> Recargar
                    </button>
                    <button className="btn btn-success d-flex align-items-center gap-1" onClick={() => setIsCrearModalOpen(true)}>
                        <Plus size={16} /> Nuevo Emprendedor
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
                    <div className={`card border-0 shadow-sm border-start border-danger border-4 ${filtroEstadoCard === 'RECHAZADO' ? 'bg-danger-subtle' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleCardClick('RECHAZADO')}>
                        <div className="card-body p-3">
                            <span className="text-muted small fw-semibold">Rechazados</span>
                            <h2 className="fw-bold my-1 text-danger">{metricas.rechazados}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="row g-2">
                        <div className="col-md-7 position-relative">
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
                            <select className="form-select" value={filtroRolSelect} onChange={(e) => { setFiltroRolSelect(e.target.value); setPaginaActual(1); }}>
                                <option value="TODOS">Todos los roles</option>
                                <option value="EMPRENDEDOR">Emprendedor</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" onClick={handleBuscar}>Buscar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA Y PAGINACIÓN */}
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
                                    <tr><td colSpan={5} className="text-center py-4 text-muted">Cargando emprendedores...</td></tr>
                                ) : usuariosPaginados.length > 0 ? (
                                    usuariosPaginados.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <td className="fw-semibold">{usuario.nombre}</td>
                                            <td>{usuario.email}</td>
                                            <td className="text-capitalize">{usuario.rol.toLowerCase().replace('role_', '')}</td>
                                            <td>{renderBadgeEstado(usuario.estado)}</td>
                                            <td className="text-end">
                                                <div className="d-flex align-items-center justify-content-end gap-1 flex-nowrap">
                                                    <button className="btn btn-sm btn-outline-primary px-2" onClick={() => handleAbrirEdicion(usuario)}><Edit size={14} /> Editar</button>
                                                    <button className={`btn btn-sm ${usuario.estado === 'SUSPENDIDO' ? 'btn-outline-success' : 'btn-outline-warning'} px-2`} onClick={() => handleToggleSuspender(usuario.id)}>
                                                        {usuario.estado === 'SUSPENDIDO' ? <><CheckCircle2 size={14} /> Activar</> : <><Ban size={14} /> Suspender</>}
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger px-2" onClick={() => handleEliminar(usuario.id)}><Trash2 size={14} /> Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center py-4 text-muted">No se encontraron registros.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                    <span className="small text-muted">
                        {usuariosFiltrados.length > 0 ? `Mostrando ${((paginaActual - 1) * elementosPorPagina) + 1} - ${Math.min(paginaActual * elementosPorPagina, usuariosFiltrados.length)} de ${usuariosFiltrados.length} usuarios` : 'Sin resultados'}
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

            {/* MODAL DE EDICIÓN */}
            {usuarioAEditar && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h6 className="modal-title fw-bold">Editar Usuario #{usuarioAEditar.id}</h6>
                                <button type="button" className="btn-close" onClick={() => setUsuarioAEditar(null)}></button>
                            </div>
                            <form onSubmit={handleGuardarEdicion}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Nombre</label>
                                        <input type="text" className="form-control form-control-sm" value={usuarioAEditar.nombre} onChange={(e) => setUsuarioAEditar({ ...usuarioAEditar, nombre: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Email</label>
                                        <input type="email" className="form-control form-control-sm" value={usuarioAEditar.email} onChange={(e) => setUsuarioAEditar({ ...usuarioAEditar, email: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="modal-footer py-2">
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setUsuarioAEditar(null)}>Cancelar</button>
                                    <button type="submit" className="btn btn-sm btn-primary">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ModalNuevoEmprendedor
                isOpen={isCrearModalOpen}
                onClose={() => setIsCrearModalOpen(false)}
                onSuccess={() => { setIsCrearModalOpen(false); obtenerEmprendedores(); }}
            />
        </div>
    );
};

export default UsuariosView;