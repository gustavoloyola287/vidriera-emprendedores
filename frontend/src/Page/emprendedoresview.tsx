import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit, Ban, Trash2, CheckCircle2, Plus } from 'lucide-react';

// Interfaces
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'EMPRENDEDOR' | 'MODERADOR';
    estado: 'ACTIVO' | 'SUSPENDIDO' | 'RECHAZADO' | 'PENDIENTE';
    }

    interface Metricas {
    activos: number;
    suspendidos: number;
    admins: number;
    rechazados: number;
    total: number;
    }

    const MOCK_USUARIOS: Usuario[] = [
    { id: 1, nombre: 'Lucía Pérez', email: 'lucia.perez@example.com', rol: 'EMPRENDEDOR', estado: 'ACTIVO' },
    { id: 2, nombre: 'Santiago Rossi', email: 'santiago.rossi@example.com', rol: 'EMPRENDEDOR', estado: 'ACTIVO' },
    { id: 3, nombre: 'Carlos Gómez', email: 'carlos.gomez@example.com', rol: 'ADMIN', estado: 'ACTIVO' },
    { id: 4, nombre: 'Laura Benítez', email: 'laura.benitez@example.com', rol: 'EMPRENDEDOR', estado: 'SUSPENDIDO' },
    { id: 5, nombre: 'Sofía Martínez', email: 'sofia.martinez@example.com', rol: 'MODERADOR', estado: 'ACTIVO' },
    { id: 6, nombre: 'Marcos Admin', email: 'marcos.admin@example.com', rol: 'ADMIN', estado: 'ACTIVO' },
    { id: 7, nombre: 'Pedro Mármol', email: 'pedro.marmol@example.com', rol: 'EMPRENDEDOR', estado: 'RECHAZADO' },
    { id: 8, nombre: 'Ana Clara', email: 'ana.clara@example.com', rol: 'EMPRENDEDOR', estado: 'SUSPENDIDO' },
    ];

    export const UsuariosView: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
    const [metricas, setMetricas] = useState<Metricas>({ activos: 0, suspendidos: 0, admins: 0, rechazados: 0, total: 0 });

    const [filtroEstadoCard, setFiltroEstadoCard] = useState<string>('TODOS');
    const [filtroRolSelect, setFiltroRolSelect] = useState<string>('TODOS');
    const [busquedaInput, setBusquedaInput] = useState<string>('');
    const [busquedaAplicada, setBusquedaAplicada] = useState<string>('');
    
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const elementosPorPagina = 5;

    const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);

    // Nuevo estado para el modal de creación
    const [isCrearModalOpen, setIsCrearModalOpen] = useState<boolean>(false);
    const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, 'id'>>({
        nombre: '',
        email: '',
        rol: 'EMPRENDEDOR',
        estado: 'ACTIVO'
    });

    useEffect(() => {
        const activos = usuarios.filter(u => u.estado === 'ACTIVO').length;
        const suspendidos = usuarios.filter(u => u.estado === 'SUSPENDIDO').length;
        const admins = usuarios.filter(u => u.rol === 'ADMIN').length;
        const rechazados = usuarios.filter(u => u.estado === 'RECHAZADO').length;

        setMetricas({
        activos,
        suspendidos,
        admins,
        rechazados,
        total: usuarios.length
        });
    }, [usuarios]);

    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(u => {
        const coincideBusqueda = 
            u.nombre.toLowerCase().includes(busquedaAplicada.toLowerCase()) ||
            u.email.toLowerCase().includes(busquedaAplicada.toLowerCase());

        const coincideRol = filtroRolSelect === 'TODOS' || u.rol === filtroRolSelect;

        let coincideCard = true;
        if (filtroEstadoCard === 'ADMIN') {
            coincideCard = u.rol === 'ADMIN';
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

    const handleToggleSuspender = (id: number) => {
        setUsuarios(prev => prev.map(u => {
        if (u.id === id) {
            const nuevoEstado = u.estado === 'SUSPENDIDO' ? 'ACTIVO' : 'SUSPENDIDO';
            return { ...u, estado: nuevoEstado };
        }
        return u;
        }));
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
        setUsuarios(prev => prev.filter(u => u.id !== id));
        }
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

    // Manejador para crear un usuario nuevo
    const handleCrearUsuario = (e: React.FormEvent) => {
        e.preventDefault();
        const idNuevo = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        setUsuarios(prev => [...prev, { id: idNuevo, ...nuevoUsuario }]);
        setIsCrearModalOpen(false);
        setNuevoUsuario({ nombre: '', email: '', rol: 'EMPRENDEDOR', estado: 'ACTIVO' });
    };

    const renderBadgeEstado = (estado: Usuario['estado']) => {
        switch (estado) {
        case 'ACTIVO':
            return <span className="badge bg-success-subtle text-success border border-success px-2 py-1">Activo</span>;
        case 'SUSPENDIDO':
            return <span className="badge bg-secondary-subtle text-secondary border border-secondary px-2 py-1">Suspendido</span>;
        case 'RECHAZADO':
            return <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1">Rechazado</span>;
        default:
            return <span className="badge bg-warning-subtle text-warning border border-warning px-2 py-1">Pendiente</span>;
        }
    };

    return (
        <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">Panel Emprendedor - Accesos Directos</h5>
            <button className="btn btn-success d-flex align-items-center gap-1" onClick={() => setIsCrearModalOpen(true)}>
            <Plus size={16} /> Nuevo Emprendedor
            </button>
        </div>

        {/* CARDS SUPERIORES INTERACTIVAS */}
        <div className="row g-3 mb-4">
            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-success border-4 ${filtroEstadoCard === 'ACTIVO' ? 'bg-success-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('ACTIVO')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Activos</span>
                <h2 className="fw-bold my-1 text-success">{metricas.activos}</h2>
                {filtroEstadoCard === 'ACTIVO' && <span className="badge bg-success style-micro">Filtro activo</span>}
                </div>
            </div>
            </div>

            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-secondary border-4 ${filtroEstadoCard === 'SUSPENDIDO' ? 'bg-secondary-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('SUSPENDIDO')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Suspendidos</span>
                <h2 className="fw-bold my-1 text-secondary">{metricas.suspendidos}</h2>
                {filtroEstadoCard === 'SUSPENDIDO' && <span className="badge bg-secondary style-micro">Filtro activo</span>}
                </div>
            </div>
            </div>

            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-warning border-4 ${filtroEstadoCard === 'ADMIN' ? 'bg-warning-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('ADMIN')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Admins</span>
                <h2 className="fw-bold my-1 text-warning">{metricas.admins}</h2>
                {filtroEstadoCard === 'ADMIN' && <span className="badge bg-warning text-dark style-micro">Filtro activo</span>}
                </div>
            </div>
            </div>

            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-danger border-4 ${filtroEstadoCard === 'RECHAZADO' ? 'bg-danger-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('RECHAZADO')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Rechazados</span>
                <h2 className="fw-bold my-1 text-danger">{metricas.rechazados}</h2>
                {filtroEstadoCard === 'RECHAZADO' && <span className="badge bg-danger style-micro">Filtro activo</span>}
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
                placeholder="Buscar usuario por nombre o email..." 
                value={busquedaInput}
                onChange={(e) => setBusquedaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                />
                </div>
                <div className="col-md-3">
                <select 
                    className="form-select"
                    value={filtroRolSelect}
                    onChange={(e) => {
                    setFiltroRolSelect(e.target.value);
                    setPaginaActual(1);
                    }}
                >
                    <option value="TODOS">Todos los roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EMPRENDEDOR">Emprendedor</option>
                    <option value="MODERADOR">Moderador</option>
                </select>
                </div>
                <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={handleBuscar}>
                    Buscar
                </button>
                </div>
            </div>
            </div>
        </div>

        {/* TABLA Y PAGINACIÓN DINÁMICA */}
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
                    {usuariosPaginados.length > 0 ? (
                    usuariosPaginados.map((usuario) => (
                        <tr key={usuario.id}>
                        <td className="fw-semibold">{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td className="text-capitalize">{usuario.rol.toLowerCase()}</td>
                        <td>{renderBadgeEstado(usuario.estado)}</td>
                        <td className="text-end">
                            <div className="d-flex align-items-center justify-content-end gap-1 flex-nowrap">
                            <button 
                                className="btn btn-sm btn-outline-primary px-2"
                                onClick={() => handleAbrirEdicion(usuario)}
                            >
                                <Edit size={14} /> Editar
                            </button>
                            
                            <button 
                                className={`btn btn-sm ${usuario.estado === 'SUSPENDIDO' ? 'btn-outline-success' : 'btn-outline-warning'} px-2`}
                                onClick={() => handleToggleSuspender(usuario.id)}
                            >
                                {usuario.estado === 'SUSPENDIDO' ? (
                                <><CheckCircle2 size={14} /> Activar</>
                                ) : (
                                <><Ban size={14} /> Suspender</>
                                )}
                            </button>

                            <button 
                                className="btn btn-sm btn-outline-danger px-2"
                                onClick={() => handleEliminar(usuario.id)}
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                        No se encontraron usuarios con los filtros aplicados.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>

            {/* PIE CON TOTALES Y PAGINADOR DINÁMICO */}
            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
            <span className="small text-muted">
                {usuariosFiltrados.length > 0 ? (
                <>Mostrando {((paginaActual - 1) * elementosPorPagina) + 1} - {Math.min(paginaActual * elementosPorPagina, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios</>
                ) : (
                'Sin resultados'
                )}
            </span>
            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}>
                    Anterior
                </button>
                </li>
                
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPaginaActual(num)}>
                    {num}
                    </button>
                </li>
                ))}

                <li className={`page-item ${paginaActual >= totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}>
                    Siguiente
                </button>
                </li>
            </ul>
            </div>
        </div>

        {/* MODAL DE EDICIÓN */}
        {usuarioAEditar && (
            <div className="modal fade show d-block tab-index-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                        <input 
                        type="text" 
                        className="form-control form-control-sm"
                        value={usuarioAEditar.nombre}
                        onChange={(e) => setUsuarioAEditar({ ...usuarioAEditar, nombre: e.target.value })}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Email</label>
                        <input 
                        type="email" 
                        className="form-control form-control-sm"
                        value={usuarioAEditar.email}
                        onChange={(e) => setUsuarioAEditar({ ...usuarioAEditar, email: e.target.value })}
                        required
                        />
                    </div>
                    <div className="row g-2">
                        <div className="col-md-6 mb-3">
                        <label className="form-label small fw-semibold">Rol</label>
                        <select 
                            className="form-select form-select-sm"
                            value={usuarioAEditar.rol}
                            onChange={(e) => setUsuarioAEditar({ ...usuarioAEditar, rol: e.target.value as Usuario['rol'] })}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="EMPRENDEDOR">Emprendedor</option>
                            <option value="MODERADOR">Moderador</option>
                        </select>
                        </div>
                        <div className="col-md-6 mb-3">
                        <label className="form-label small fw-semibold">Estado</label>
                        <select 
                            className="form-select form-select-sm"
                            value={usuarioAEditar.estado}
                            onChange={(e) => setUsuarioAEditar({ ...usuarioAEditar, estado: e.target.value as Usuario['estado'] })}
                        >
                            <option value="ACTIVO">Activo</option>
                            <option value="SUSPENDIDO">Suspendido</option>
                            <option value="RECHAZADO">Rechazado</option>
                            <option value="PENDIENTE">Pendiente</option>
                        </select>
                        </div>
                    </div>
                    </div>
                    <div className="modal-footer py-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setUsuarioAEditar(null)}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary">
                        Guardar Cambios
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        )}

        {/* MODAL DE CREACIÓN */}
        {isCrearModalOpen && (
            <div className="modal fade show d-block tab-index-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                <div className="modal-header">
                    <h6 className="modal-title fw-bold">Nuevo Emprendedor</h6>
                    <button type="button" className="btn-close" onClick={() => setIsCrearModalOpen(false)}></button>
                </div>
                <form onSubmit={handleCrearUsuario}>
                    <div className="modal-body">
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Nombre Completo</label>
                        <input 
                        type="text" 
                        className="form-control form-control-sm"
                        placeholder="Ej. María González"
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Email</label>
                        <input 
                        type="email" 
                        className="form-control form-control-sm"
                        placeholder="ejemplo@correo.com"
                        value={nuevoUsuario.email}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                        required
                        />
                    </div>
                    <div className="row g-2">
                        <div className="col-md-6 mb-3">
                        <label className="form-label small fw-semibold">Rol</label>
                        <select 
                            className="form-select form-select-sm"
                            value={nuevoUsuario.rol}
                            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value as Usuario['rol'] })}
                        >
                            <option value="EMPRENDEDOR">Emprendedor</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MODERADOR">Moderador</option>
                        </select>
                        </div>
                        <div className="col-md-6 mb-3">
                        <label className="form-label small fw-semibold">Estado Inicial</label>
                        <select 
                            className="form-select form-select-sm"
                            value={nuevoUsuario.estado}
                            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, estado: e.target.value as Usuario['estado'] })}
                        >
                            <option value="ACTIVO">Activo</option>
                            <option value="PENDIENTE">Pendiente</option>
                        </select>
                        </div>
                    </div>
                    </div>
                    <div className="modal-footer py-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsCrearModalOpen(false)}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-sm btn-success">
                        Crear Usuario
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

export default UsuariosView;