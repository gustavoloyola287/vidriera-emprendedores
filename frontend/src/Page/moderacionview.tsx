import React, { useState } from 'react';
import { 
    ShieldCheck, 
    AlertTriangle, 
    Check, 
    X, 
    Eye, 
    MessageSquare, 
    UserX, 
    Package, 
    Search,
    CheckCircle2,
    XCircle,
    Clock
    } from 'lucide-react';

    export interface ModeracionItem {
    id: number;
    reportadoPor: string;
    usuarioAfectado: string;
    tipo: 'contenido' | 'comentario' | 'usuario';
    motivo: string;
    detalle: string;
    fecha: string;
    estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
    }

    export const ModeracionView: React.FC = () => {
    // Datos simulados de moderación
    const [items, setItems] = useState<ModeracionItem[]>([
        {
        id: 1,
        reportadoPor: 'Sistema (Automático)',
        usuarioAfectado: 'Santiago Rossi',
        tipo: 'contenido',
        motivo: 'Imágenes con marca de agua no permitida',
        detalle: 'Publicación: "Vidrio templado 10mm". La foto contiene logos de terceros no autorizados.',
        fecha: '2026-09-06 14:30',
        estado: 'Pendiente'
        },
        {
        id: 2,
        reportadoPor: 'Laura Benítez',
        usuarioAfectado: 'Carlos G.',
        tipo: 'comentario',
        motivo: 'Lenguaje Inapropiado / Ofensivo',
        detalle: 'Comentario en publicación de artesanías: "Este producto es una estafa, no le compren".',
        fecha: '2026-09-06 11:15',
        estado: 'Pendiente'
        },
        {
        id: 3,
        reportadoPor: 'Marcos Admin',
        usuarioAfectado: 'Sofía Martínez',
        tipo: 'usuario',
        motivo: 'Perfil sospechoso de Spam',
        detalle: 'Intentos masivos de registro con datos repetidos y enlaces externos sospechosos.',
        fecha: '2026-09-05 18:00',
        estado: 'Rechazado'
        },
        {
        id: 4,
        reportadoPor: 'Usuario Anónimo',
        usuarioAfectado: 'Muebles Carlos Paz',
        tipo: 'contenido',
        motivo: 'Precio incorrecto / Engañoso',
        detalle: 'Mesa de madera publicada a $1 en lugar del precio real.',
        fecha: '2026-09-04 09:20',
        estado: 'Aprobado'
        }
    ]);

    const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
    const [filtroEstado, setFiltroEstado] = useState<string>('Pendiente');
    const [busqueda, setBusqueda] = useState<string>('');
    const [itemSeleccionado, setItemSeleccionado] = useState<ModeracionItem | null>(null);

    // Handlers para aprobar o rechazar
    const handleAprobar = (id: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, estado: 'Aprobado' } : item));
        if (itemSeleccionado?.id === id) setItemSeleccionado(null);
    };

    const handleRechazar = (id: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, estado: 'Rechazado' } : item));
        if (itemSeleccionado?.id === id) setItemSeleccionado(null);
    };

    // Filtrado de elementos
    const itemsFiltrados = items.filter(item => {
        const coincideTipo = filtroTipo === 'Todos' || item.tipo === filtroTipo;
        const coincideEstado = filtroEstado === 'Todos' || item.estado === filtroEstado;
        const coincideBusqueda = item.usuarioAfectado.toLowerCase().includes(busqueda.toLowerCase()) || 
                                item.motivo.toLowerCase().includes(busqueda.toLowerCase());
        return coincideTipo && coincideEstado && coincideBusqueda;
    });

    // Métricas
    const pendientesCount = items.filter(i => i.estado === 'Pendiente').length;
    const aprobadosCount = items.filter(i => i.estado === 'Aprobado').length;
    const rechazadosCount = items.filter(i => i.estado === 'Rechazado').length;

    return (
        <div className="container-fluid p-0">
        
        {/* Header y Métricas */}
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
            <ShieldCheck className="text-primary" /> Centro de Moderación y Reportes
            </h5>
        </div>

        <div className="row g-3 mb-4">
            <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 border-start border-4 border-warning">
                <div className="d-flex align-items-center justify-content-between">
                <div>
                    <span className="text-muted small text-uppercase fw-semibold">Casos Pendientes</span>
                    <h3 className="fw-bold my-1 text-warning">{pendientesCount}</h3>
                </div>
                <Clock className="text-warning" size={32} />
                </div>
            </div>
            </div>

            <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 border-start border-4 border-success">
                <div className="d-flex align-items-center justify-content-between">
                <div>
                    <span className="text-muted small text-uppercase fw-semibold">Aprobados / Validados</span>
                    <h3 className="fw-bold my-1 text-success">{aprobadosCount}</h3>
                </div>
                <CheckCircle2 className="text-success" size={32} />
                </div>
            </div>
            </div>

            <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 border-start border-4 border-danger">
                <div className="d-flex align-items-center justify-content-between">
                <div>
                    <span className="text-muted small text-uppercase fw-semibold">Rechazados / Sancionados</span>
                    <h3 className="fw-bold my-1 text-danger">{rechazadosCount}</h3>
                </div>
                <XCircle className="text-danger" size={32} />
                </div>
            </div>
            </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-3">
            <div className="row g-2">
                <div className="col-md-5">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                    <Search size={16} className="text-muted" />
                    </span>
                    <input
                    type="text"
                    className="form-control form-control-sm border-start-0"
                    placeholder="Buscar por usuario o motivo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                </div>

                <div className="col-md-3">
                <select
                    className="form-select form-select-sm"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                >
                    <option value="Todos">Todos los tipos</option>
                    <option value="contenido">Contenido / Productos</option>
                    <option value="comentario">Comentarios</option>
                    <option value="usuario">Perfiles de Usuario</option>
                </select>
                </div>

                <div className="col-md-4">
                <select
                    className="form-select form-select-sm"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Pendiente">Solo Pendientes</option>
                    <option value="Aprobado">Aprobados</option>
                    <option value="Rechazado">Rechazados</option>
                </select>
                </div>
            </div>
            </div>
        </div>

        {/* Tabla de Moderación */}
        <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                    <tr>
                    <th className="ps-3">Tipo</th>
                    <th>Usuario Implicado</th>
                    <th>Motivo del Reporte</th>
                    <th>Reportado por</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="text-end pe-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsFiltrados.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                        No hay casos de moderación en esta categoría.
                        </td>
                    </tr>
                    ) : (
                    itemsFiltrados.map((item) => (
                        <tr key={item.id}>
                        <td className="ps-3">
                            <span className="d-flex align-items-center gap-1 fw-semibold style-micro text-uppercase">
                            {item.tipo === 'contenido' && <Package size={14} className="text-primary" />}
                            {item.tipo === 'comentario' && <MessageSquare size={14} className="text-warning" />}
                            {item.tipo === 'usuario' && <UserX size={14} className="text-danger" />}
                            {item.tipo}
                            </span>
                        </td>
                        <td className="fw-bold small">{item.usuarioAfectado}</td>
                        <td className="small text-truncate" style={{ maxWidth: '220px' }}>
                            {item.motivo}
                        </td>
                        <td className="small text-muted">{item.reportadoPor}</td>
                        <td className="style-micro text-muted">{item.fecha}</td>
                        <td>
                            <span className={`badge ${
                            item.estado === 'Pendiente' ? 'bg-warning text-dark' :
                            item.estado === 'Aprobado' ? 'bg-success' : 'bg-danger'
                            }`}>
                            {item.estado}
                            </span>
                        </td>
                        <td className="text-end pe-3">
                            <div className="btn-group btn-group-sm" role="group">
                            {/* Ver Detalle */}
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setItemSeleccionado(item)}
                                title="Ver detalle del caso"
                            >
                                <Eye size={14} />
                            </button>

                            {/* Aprobar / Desestimar Reporte */}
                            <button
                                className="btn btn-outline-success"
                                onClick={() => handleAprobar(item.id)}
                                disabled={item.estado === 'Aprobado'}
                                title="Aprobar (No requiere sanción)"
                            >
                                <Check size={14} />
                            </button>

                            {/* Rechazar / Aplicar Sanción */}
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => handleRechazar(item.id)}
                                disabled={item.estado === 'Rechazado'}
                                title="Rechazar / Aplicar Sanción"
                            >
                                <X size={14} />
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

        {/* Modal de Detalle del Reporte */}
        {itemSeleccionado && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                    <h6 className="modal-title fw-bold d-flex align-items-center gap-2">
                    <AlertTriangle className="text-warning" size={18} /> Detalle del Incidente #{itemSeleccionado.id}
                    </h6>
                    <button
                    type="button"
                    className="btn-close"
                    onClick={() => setItemSeleccionado(null)}
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                    <span className="text-muted style-micro text-uppercase d-block mb-1">Usuario / Publicación Afectada</span>
                    <h6 className="fw-bold mb-0">{itemSeleccionado.usuarioAfectado}</h6>
                    </div>

                    <div className="row g-2 mb-3">
                    <div className="col-6">
                        <span className="text-muted style-micro text-uppercase d-block">Tipo</span>
                        <span className="badge bg-secondary text-uppercase">{itemSeleccionado.tipo}</span>
                    </div>
                    <div className="col-6">
                        <span className="text-muted style-micro text-uppercase d-block">Fecha</span>
                        <span className="small fw-semibold">{itemSeleccionado.fecha}</span>
                    </div>
                    </div>

                    <div className="mb-3">
                    <span className="text-muted style-micro text-uppercase d-block mb-1">Motivo principal</span>
                    <p className="fw-semibold small text-danger mb-0">{itemSeleccionado.motivo}</p>
                    </div>

                    <div className="mb-3">
                    <span className="text-muted style-micro text-uppercase d-block mb-1">Detalle del reporte</span>
                    <div className="p-2 bg-light rounded border small">
                        {itemSeleccionado.detalle}
                    </div>
                    </div>

                    <div className="small text-muted">
                    Reportado por: <strong>{itemSeleccionado.reportadoPor}</strong>
                    </div>
                </div>

                <div className="modal-footer d-flex justify-content-between">
                    <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setItemSeleccionado(null)}
                    >
                    Cerrar
                    </button>
                    <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRechazar(itemSeleccionado.id)}
                        disabled={itemSeleccionado.estado === 'Rechazado'}
                    >
                        <X size={14} /> Rechazar / Sancionar
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => handleAprobar(itemSeleccionado.id)}
                        disabled={itemSeleccionado.estado === 'Aprobado'}
                    >
                        <Check size={14} /> Aprobar / Desestimar
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}

        </div>
    );
};