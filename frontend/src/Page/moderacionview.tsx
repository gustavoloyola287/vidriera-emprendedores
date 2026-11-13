import React, { useState, useEffect, useCallback } from 'react';
import {
    ShieldCheck, AlertTriangle, Check, X, Eye, MessageSquare,
    UserX, Package, Search, CheckCircle2, XCircle, Clock, Loader2
} from 'lucide-react';
import api from '../services/api';

// id ahora es string (ObjectId de Mongo)
export interface ModeracionItem {
    id: string;
    reportadoPor: string;
    usuarioAfectado: string;
    tipo: 'CONTENIDO' | 'COMENTARIO' | 'USUARIO';
    motivo: string;
    detalle: string;
    fecha: string;
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'; // ✅ siempre mayúsculas
}

// ✅ Solo para MOSTRAR en la UI. El valor interno nunca cambia.
const etiquetaEstado = (estado: ModeracionItem['estado']): string =>
    estado === 'PENDIENTE' ? 'Pendiente'
    : estado === 'APROBADO' ? 'Aprobado'
    : 'Rechazado';

const formatearFecha = (f: any): string => {
    if (!f) return '';
    if (typeof f === 'string') return f.replace('T', ' ').slice(0, 16);
    return new Date(f).toLocaleString('es-AR');
};

export const ModeracionView: React.FC = () => {
    const [items, setItems] = useState<ModeracionItem[]>([]);
    const [stats, setStats] = useState({ pendientes: 0, aprobados: 0, rechazados: 0 });
    const [cargando, setCargando] = useState(true);

    const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
    const [filtroEstado, setFiltroEstado] = useState<string>('PENDIENTE'); // ✅ mayúscula
    const [busqueda, setBusqueda] = useState<string>('');
    const [itemSeleccionado, setItemSeleccionado] = useState<ModeracionItem | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);

    const [toastInfo, setToastInfo] = useState<{ visible: boolean; mensaje: string; tipo: 'success' | 'warning' | 'danger' }>({ visible: false, mensaje: '', tipo: 'success' });
    const mostrarToast = (mensaje: string, tipo: 'success' | 'warning' | 'danger' = 'success') => {
        setToastInfo({ visible: true, mensaje, tipo });
        setTimeout(() => setToastInfo(p => ({ ...p, visible: false })), 4000);
    };

    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            const estadoParam = filtroEstado === 'Todos' ? '' : filtroEstado;
            const tipoParam = filtroTipo === 'Todos' ? '' : filtroTipo.toUpperCase();
            const [respItems, respStats] = await Promise.all([
                api.get('/api/admin/moderacion', { params: { estado: estadoParam, tipo: tipoParam } }),
                api.get('/api/admin/moderacion/stats'),
            ]);
            setItems(respItems.data.map((r: any) => ({
                ...r,
                fecha: formatearFecha(r.fecha),
                estado: (r.estado || 'PENDIENTE').toUpperCase(), // ✅ llega en mayúsculas
            })));
            setStats(respStats.data);
        } catch (e: any) {
            console.error(e);
            mostrarToast('No se pudo cargar la moderación', 'danger');
        } finally {
            setCargando(false);
        }
    }, [filtroEstado, filtroTipo]);

    useEffect(() => { cargar(); }, [cargar]);

    const handleAprobar = async (id: string) => {
        try {
            setActionId(id);
            await api.put(`/api/admin/moderacion/${id}/aprobar`);
            mostrarToast('Reporte aprobado y desestimado', 'success');
            if (itemSeleccionado?.id === id) setItemSeleccionado(null);
            await cargar();
        } catch (e: any) {
            mostrarToast(e?.response?.status === 403 ? 'No tenés permiso para moderar' : 'Error al aprobar', 'danger');
        } finally {
            setActionId(null);
        }
    };

    const handleRechazar = async (id: string) => {
        try {
            setActionId(id);
            await api.put(`/api/admin/moderacion/${id}/rechazar`);
            mostrarToast('Reporte rechazado y sanción aplicada', 'warning');
            if (itemSeleccionado?.id === id) setItemSeleccionado(null);
            await cargar();
        } catch (e: any) {
            mostrarToast(e?.response?.status === 403 ? 'No tenés permiso para moderar' : 'Error al rechazar', 'danger');
        } finally {
            setActionId(null);
        }
    };

    const itemsFiltrados = items.filter(item => {
        const coincideBusqueda =
            item.usuarioAfectado?.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.motivo?.toLowerCase().includes(busqueda.toLowerCase());
        return coincideBusqueda;
    });

    const pendientesCount = stats.pendientes;
    const aprobadosCount = stats.aprobados;
    const rechazadosCount = stats.rechazados;

    const obtenerClaseToastBg = (tipo: string) => tipo === 'success' ? 'bg-success text-white' : tipo === 'warning' ? 'bg-warning text-dark' : 'bg-danger text-white';
    const renderIconoToast = (tipo: string) => tipo === 'success' ? <CheckCircle2 size={18} /> : tipo === 'warning' ? <AlertTriangle size={18} /> : <XCircle size={18} />;

    return (
        <div className="container-fluid p-0 position-relative">
            {/* TOAST */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
                <div className={`toast align-items-center border-0 shadow-lg rounded-3 ${obtenerClaseToastBg(toastInfo.tipo)} ${toastInfo.visible ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body d-flex align-items-center gap-2">
                            {renderIconoToast(toastInfo.tipo)}
                            <span className="fw-semibold">{toastInfo.mensaje}</span>
                        </div>
                        <button type="button" className={`btn-close me-2 m-auto ${toastInfo.tipo === 'warning' ? '' : 'btn-close-white'}`} onClick={() => setToastInfo(p => ({ ...p, visible: false }))} aria-label="Close"></button>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                    <ShieldCheck className="text-primary" /> Centro de Moderación y Reportes
                </h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={cargando}>
                    {cargando ? <Loader2 size={14} className="spinner-border spinner-border-sm" /> : 'Recargar'}
                </button>
            </div>

            {/* Métricas desde /stats (agregación $group) */}
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

            {/* Filtros */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="row g-2">
                        <div className="col-md-5">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
                                <input type="text" className="form-control form-control-sm border-start-0" placeholder="Buscar por usuario o motivo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select form-select-sm" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                                <option value="Todos">Todos los tipos</option>
                                <option value="CONTENIDO">Contenido / Productos</option>
                                <option value="COMENTARIO">Comentarios</option>
                                <option value="USUARIO">Perfiles de Usuario</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select className="form-select form-select-sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                <option value="Todos">Todos los Estados</option>
                                <option value="PENDIENTE">Solo Pendientes</option>
                                <option value="APROBADO">Aprobados</option>
                                <option value="RECHAZADO">Rechazados</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla */}
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
                                {cargando ? (
                                    <tr><td colSpan={7} className="text-center py-4 text-muted">Cargando moderación…</td></tr>
                                ) : itemsFiltrados.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-4 text-muted">No hay casos de moderación en esta categoría.</td></tr>
                                ) : (
                                    itemsFiltrados.map((item) => (
                                        <tr key={item.id}>
                                            <td className="ps-3">
                                                <span className="d-flex align-items-center gap-1 fw-semibold style-micro text-uppercase">
                                                    {item.tipo === 'CONTENIDO' && <Package size={14} className="text-primary" />}
                                                    {item.tipo === 'COMENTARIO' && <MessageSquare size={14} className="text-warning" />}
                                                    {item.tipo === 'USUARIO' && <UserX size={14} className="text-danger" />}
                                                    {item.tipo.toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="fw-bold small">{item.usuarioAfectado}</td>
                                            <td className="small text-truncate" style={{ maxWidth: '220px' }}>{item.motivo}</td>
                                            <td className="small text-muted">{item.reportadoPor}</td>
                                            <td className="style-micro text-muted">{item.fecha}</td>
                                            <td>
                                                {/* ✅ compara en MAYÚSCULAS, muestra con etiquetaEstado() */}
                                                <span className={`badge ${
                                                    item.estado === 'PENDIENTE' ? 'bg-warning text-dark'
                                                    : item.estado === 'APROBADO' ? 'bg-success'
                                                    : 'bg-danger'
                                                }`}>
                                                    {etiquetaEstado(item.estado)}
                                                </span>
                                            </td>
                                            <td className="text-end pe-3">
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button className="btn btn-outline-secondary" onClick={() => setItemSeleccionado(item)} title="Ver detalle"><Eye size={14} /></button>
                                                    <button className="btn btn-outline-success" onClick={() => handleAprobar(item.id)} disabled={item.estado === 'APROBADO' || actionId === item.id} title="Aprobar"><Check size={14} /></button>
                                                    <button className="btn btn-outline-danger" onClick={() => handleRechazar(item.id)} disabled={item.estado === 'RECHAZADO' || actionId === item.id} title="Rechazar / Sancionar"><X size={14} /></button>
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

            {/* Modal de detalle */}
            {itemSeleccionado && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h6 className="modal-title fw-bold d-flex align-items-center gap-2">
                                    <AlertTriangle className="text-warning" size={18} /> Detalle del Incidente
                                </h6>
                                <button type="button" className="btn-close" onClick={() => setItemSeleccionado(null)}></button>
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
                                    <div className="p-2 bg-light rounded border small">{itemSeleccionado.detalle}</div>
                                </div>
                                <div className="small text-muted">Reportado por: <strong>{itemSeleccionado.reportadoPor}</strong></div>
                            </div>
                            <div className="modal-footer d-flex justify-content-between">
                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setItemSeleccionado(null)}>Cerrar</button>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRechazar(itemSeleccionado.id)} disabled={itemSeleccionado.estado === 'RECHAZADO'}><X size={14} /> Rechazar / Sancionar</button>
                                    <button type="button" className="btn btn-sm btn-success" onClick={() => handleAprobar(itemSeleccionado.id)} disabled={itemSeleccionado.estado === 'APROBADO'}><Check size={14} /> Aprobar / Desestimar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModeracionView;