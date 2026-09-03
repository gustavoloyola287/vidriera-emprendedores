import React, { useState, useEffect } from 'react';
import { Search, Edit, Ban, Trash2 } from 'lucide-react';

// Interfaces para TypeScript
    interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: string;
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
    // 1. Estados para los datos del Backend
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [metricas, setMetricas] = useState<Metricas>({ activos: 0, suspendidos: 0, admins: 0, rechazados: 0, total: 0 });
    const [loading, setLoading] = useState<boolean>(true);

    // 2. Estados para los Filtros y Paginación
    const [filtroEstado, setFiltroEstado] = useState<string>('TODOS'); // 'TODOS' | 'ACTIVO' | 'SUSPENDIDO' | 'ADMIN' | 'RECHAZADO'
    const [filtroRol, setFiltroRol] = useState<string>('TODOS');
    const [busqueda, setBusqueda] = useState<string>('');
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const elementosPorPagina = 5;

    // 3. Cargar las métricas de las Cards al montar el componente
    useEffect(() => {
        // Ejemplo de llamada real: fetch('/api/admin/usuarios/stats').then(...)
        setMetricas({
        activos: 115,
        suspendidos: 25,
        admins: 4,
        rechazados: 6,
        total: 150
        });
    }, []);

    // 4. Cargar la lista de usuarios cada vez que cambia un filtro o la página
    useEffect(() => {
        setLoading(true);
        // Acá realizás la petición al backend enviando los filtros activos:
        // fetch(`/api/admin/usuarios?estado=${filtroEstado}&rol=${filtroRol}&search=${busqueda}&page=${paginaActual}`)
        
        // Simulación de carga:
        setTimeout(() => {
        setLoading(false);
        }, 300);
    }, [filtroEstado, filtroRol, paginaActual]);

    // Manejador del clic en las Cards superiores (Filtro rápido)
    const handleCardClick = (estadoOrol: string) => {
        if (filtroEstado === estadoOrol) {
        setFiltroEstado('TODOS'); // Si vuelve a hacer clic en la misma card, quita el filtro
        } else {
        setFiltroEstado(estadoOrol);
        }
        setPaginaActual(1); // Reiniciar a la primera página tras filtrar
    };

    return (
        <div className="container-fluid p-0">
        <h5 className="fw-bold mb-3">Panel Usuarios - Accesos Directos</h5>

        {/* CARDS SUPERIORES INTERACTIVAS */}
        <div className="row g-3 mb-4">
            {/* Card Activos */}
            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-success border-4 style-pointer ${filtroEstado === 'ACTIVO' ? 'bg-success-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('ACTIVO')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Activos</span>
                <h2 className="fw-bold my-1 text-success">{metricas.activos}</h2>
                {filtroEstado === 'ACTIVO' && <span className="badge bg-success style-micro">Filtro activo</span>}
                </div>
            </div>
            </div>

            {/* Card Suspendidos */}
            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-secondary border-4 ${filtroEstado === 'SUSPENDIDO' ? 'bg-secondary-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('SUSPENDIDO')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Suspendidos</span>
                <h2 className="fw-bold my-1 text-secondary">{metricas.suspendidos}</h2>
                {filtroEstado === 'SUSPENDIDO' && <span className="badge bg-secondary style-micro">Filtro activo</span>}
                </div>
            </div>
            </div>

            {/* Card Admins */}
            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-warning border-4 ${filtroEstado === 'ADMIN' ? 'bg-warning-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('ADMIN')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Admins</span>
                <h2 className="fw-bold my-1 text-warning">{metricas.admins}</h2>
                {filtroEstado === 'ADMIN' && <span className="badge bg-warning text-dark style-micro">Filtro activo</span>}
                </div>
            </div>
            </div>

            {/* Card Rechazados */}
            <div className="col-md-3">
            <div 
                className={`card border-0 shadow-sm border-start border-danger border-4 ${filtroEstado === 'RECHAZADO' ? 'bg-danger-subtle' : ''}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleCardClick('RECHAZADO')}
            >
                <div className="card-body p-3">
                <span className="text-muted small fw-semibold">Rechazados</span>
                <h2 className="fw-bold my-1 text-danger">{metricas.rechazados}</h2>
                {filtroEstado === 'RECHAZADO' && <span className="badge bg-danger style-micro">Filtro activo</span>}
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
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                </div>
                <div className="col-md-3">
                <select 
                    className="form-select"
                    value={filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value)}
                >
                    <option value="TODOS">Todos los roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EMPRENDEDOR">Emprendedor</option>
                    <option value="MODERADOR">Moderador</option>
                </select>
                </div>
                <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={() => setPaginaActual(1)}>
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
                    {/* Filas renderizadas dinámicamente */}
                    <tr>
                    <td className="fw-semibold">Lucía Pérez</td>
                    <td>lucia.perez@example.com</td>
                    <td>Usuario</td>
                    <td><span className="badge bg-success-subtle text-success border border-success">Activo</span></td>
                    <td className="text-end">
                        <div className="d-flex align-items-center justify-content-end gap-1 flex-nowrap">
                        <button className="btn btn-sm btn-outline-primary px-2"><Edit size={14} /> Editar</button>
                        <button className="btn btn-sm btn-outline-warning px-2"><Ban size={14} /> Suspender</button>
                        <button className="btn btn-sm btn-outline-danger px-2"><Trash2 size={14} /> Eliminar</button>
                        </div>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>

            {/* PIE CON TOTALES Y PAGINADOR DINÁMICO */}
            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
            <span className="small text-muted">
                Mostrando {((paginaActual - 1) * elementosPorPagina) + 1} - {Math.min(paginaActual * elementosPorPagina, metricas.total)} de {metricas.total} usuarios
            </span>
            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(prev => prev - 1)}>Anterior</button>
                </li>
                <li className="page-item active">
                <button className="page-link">{paginaActual}</button>
                </li>
                <li className={`page-item ${paginaActual * elementosPorPagina >= metricas.total ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(prev => prev + 1)}>Siguiente</button>
                </li>
            </ul>
            </div>
        </div>
        </div>
    );
};