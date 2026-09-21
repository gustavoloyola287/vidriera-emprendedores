import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, Shield, X, User, Plus } from 'lucide-react';

interface Mensaje {
    id: string;
    remitente: 'admin' | 'emprendedor';
    texto: string;
    fecha: string;
}

interface MensajeInterno {
    id: string;
    adminNombre: string;
    emprendedorNombre?: string;
    asunto: string;
    categoria?: 'Soporte' | 'Aprobación' | 'Notificación' | 'General';
    mensajes: Mensaje[];
    leido: boolean;
    estado: 'pendiente' | 'respondido';
}

interface ChatInternoProps {
    esAdmin?: boolean; // Define si la vista es para el Admin (true) o para el Emprendedor (false)
}

export const ChatInterno: React.FC<ChatInternoProps> = ({ esAdmin = true }) => {
    const [mensajesInternos, setMensajesInternos] = useState<MensajeInterno[]>([
        {
            id: '1',
            adminNombre: 'Soporte Plataforma (Admin)',
            emprendedorNombre: 'Marcos Pérez',
            asunto: 'Revisión de productos publicados',
            categoria: 'Aprobación',
            leido: false,
            estado: 'pendiente',
            mensajes: [
                {
                    id: 'm1',
                    remitente: 'admin',
                    texto: 'Hola Marcos, revisamos tu nuevo producto "Buzo Hoodie Custom". Ten en cuenta que la imagen tiene baja resolución. ¿Podrías actualizarla a 500x500 px?',
                    fecha: '10/05/2026 14:30',
                },
            ],
        },
        {
            id: '2',
            adminNombre: 'Administración General',
            emprendedorNombre: 'Laura Gómez',
            asunto: 'Verificación de cuenta completada',
            categoria: 'Notificación',
            leido: true,
            estado: 'respondido',
            mensajes: [
                {
                    id: 'm2',
                    remitente: 'admin',
                    texto: '¡Bienvenido a la plataforma! Tu perfil fue aprobado correctamente y tu vidriera ya se encuentra activa.',
                    fecha: '09/05/2026 11:15',
                },
                {
                    id: 'm3',
                    remitente: 'emprendedor',
                    texto: '¡Muchas gracias! Ya empecé a cargar mis primeros productos.',
                    fecha: '09/05/2026 11:45',
                },
            ],
        },
    ]);

    const [conversacionSeleccionada, setConversacionSeleccionada] = useState<MensajeInterno | null>(null);
    const [respuestaTexto, setRespuestaTexto] = useState('');

    // Estado para la creación de un nuevo mensaje
    const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
    const [nuevoEmprendedorNombre, setNuevoEmprendedorNombre] = useState('');
    const [nuevoAsunto, setNuevoAsunto] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState<'Soporte' | 'Aprobación' | 'Notificación' | 'General'>('General');
    const [nuevoTextoMensaje, setNuevoTextoMensaje] = useState('');

    const abrirConversacion = (conv: MensajeInterno) => {
        const actualizadas = mensajesInternos.map((m) =>
            m.id === conv.id ? { ...m, leido: true } : m
        );
        setMensajesInternos(actualizadas);
        setConversacionSeleccionada({ ...conv, leido: true });
    };

    const enviarRespuesta = (e: React.FormEvent) => {
        e.preventDefault();
        if (!respuestaTexto.trim() || !conversacionSeleccionada) return;

        const nuevoMensaje: Mensaje = {
            id: Date.now().toString(),
            remitente: esAdmin ? 'admin' : 'emprendedor',
            texto: respuestaTexto,
            fecha: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        };

        const conversacionActualizada: MensajeInterno = {
            ...conversacionSeleccionada,
            estado: 'respondido',
            mensajes: [...conversacionSeleccionada.mensajes, nuevoMensaje],
        };

        setMensajesInternos(
            mensajesInternos.map((m) => (m.id === conversacionSeleccionada.id ? conversacionActualizada : m))
        );
        setConversacionSeleccionada(conversacionActualizada);
        setRespuestaTexto('');
    };

    const crearNuevoMensaje = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoAsunto.trim() || !nuevoTextoMensaje.trim()) return;

        const nuevaConversacion: MensajeInterno = {
            id: Date.now().toString(),
            adminNombre: 'Soporte Plataforma (Admin)',
            emprendedorNombre: esAdmin ? (nuevoEmprendedorNombre.trim() || 'Emprendedor') : 'Mi Emprendimiento',
            asunto: nuevoAsunto,
            categoria: esAdmin ? nuevaCategoria : 'Soporte',
            leido: true,
            estado: 'pendiente',
            mensajes: [
                {
                    id: `m-${Date.now()}`,
                    remitente: esAdmin ? 'admin' : 'emprendedor',
                    texto: nuevoTextoMensaje,
                    fecha: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                },
            ],
        };

        setMensajesInternos([nuevaConversacion, ...mensajesInternos]);
        setConversacionSeleccionada(nuevaConversacion);

        // Limpiar formulario y cerrar modal
        setNuevoEmprendedorNombre('');
        setNuevoAsunto('');
        setNuevoTextoMensaje('');
        setNuevaCategoria('General');
        setMostrarModalNuevo(false);
    };

    return (
        <div className="container-fluid py-4 position-relative">
            {/* Banner / Cabecera Informativa */}
            <div className="card border-0 shadow-sm p-4 mb-4 bg-white text-center rounded-3">
                <div className="d-flex justify-content-center mb-2">
                    <MessageSquare size={36} className="text-primary" />
                </div>
                <h4 className="fw-bold mb-1">
                    {esAdmin ? 'Gestión de Mensajes y Soporte' : 'Feedback y Mensajes de Administración'}
                </h4>
                <p className="text-muted mb-0 small">
                    {esAdmin 
                        ? 'Atiende las consultas, notificaciones y requerimientos de los emprendedores de la plataforma.' 
                        : 'Canal directo de soporte, aprobaciones y consultas con el equipo de la plataforma.'}
                </p>
            </div>

            <div className="row g-4">
                {/* Bandeja de Mensajes */}
                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold text-muted mb-0">Bandeja de Entrada</h6>
                            <button 
                                className="btn btn-primary btn-sm d-flex align-items-center gap-1 rounded-2 shadow-sm"
                                onClick={() => setMostrarModalNuevo(true)}
                            >
                                <Plus size={16} /> Nuevo mensaje
                            </button>
                        </div>

                        <div className="list-group list-group-flush">
                            {mensajesInternos.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => abrirConversacion(conv)}
                                    className={`list-group-item list-group-item-action p-3 text-start border-start border-4 mb-2 rounded-3 shadow-sm ${
                                        !conv.leido ? 'border-primary bg-light fw-bold' : 'border-0 bg-white'
                                    }`}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="small text-truncate fw-semibold" style={{ maxWidth: '180px' }}>
                                            {esAdmin ? conv.emprendedorNombre || 'Emprendedor' : conv.adminNombre}
                                        </span>
                                        <span className="badge rounded-pill bg-secondary bg-opacity-10 text-dark small fw-normal">
                                            {conv.estado === 'respondido' ? (
                                                <span className="text-success d-flex align-items-center gap-1">
                                                    <CheckCircle2 size={12} /> Respondido
                                                </span>
                                            ) : (
                                                <span className="text-warning d-flex align-items-center gap-1">
                                                    <Clock size={12} /> Pendiente
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="fw-bold text-dark mb-1">{conv.asunto}</div>
                                    {conv.categoria && (
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                                            {conv.categoria}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detalle del Chat */}
                <div className="col-12 col-lg-7">
                    {conversacionSeleccionada ? (
                        <div className="card border-0 shadow-sm d-flex flex-column h-100">
                            <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="fw-bold mb-1">{conversacionSeleccionada.asunto}</h5>
                                    <div className="small text-muted d-flex align-items-center gap-2">
                                        {esAdmin ? (
                                            <>
                                                <User size={14} className="text-primary" /> {conversacionSeleccionada.emprendedorNombre || 'Emprendedor'}
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={14} className="text-primary" /> {conversacionSeleccionada.adminNombre}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-light rounded-circle"
                                    onClick={() => setConversacionSeleccionada(null)}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Historial de Mensajes */}
                            <div className="card-body p-3 bg-light overflow-auto" style={{ maxHeight: '400px' }}>
                                <div className="d-flex flex-column gap-3">
                                    {conversacionSeleccionada.mensajes.map((msg) => {
                                        const esPropio = esAdmin 
                                            ? msg.remitente === 'admin' 
                                            : msg.remitente === 'emprendedor';

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`d-flex flex-column ${esPropio ? 'align-items-end' : 'align-items-start'}`}
                                            >
                                                <div
                                                    className={`p-3 rounded-3 shadow-sm ${
                                                        esPropio ? 'bg-primary text-white' : 'bg-white text-dark border'
                                                    }`}
                                                    style={{ maxWidth: '85%' }}
                                                >
                                                    <p className="mb-1 text-break">{msg.texto}</p>
                                                    <div
                                                        className={`d-flex align-items-center justify-content-end gap-1 small ${
                                                            esPropio ? 'text-white-50' : 'text-muted'
                                                        }`}
                                                        style={{ fontSize: '11px' }}
                                                    >
                                                        <span>{msg.fecha}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Formulario para Responder */}
                            <div className="card-footer bg-white p-3 border-top">
                                <form onSubmit={enviarRespuesta}>
                                    <div className="input-group">
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            placeholder={esAdmin ? "Escribe una respuesta para el emprendedor..." : "Escribe tu respuesta a la administración..."}
                                            value={respuestaTexto}
                                            onChange={(e) => setRespuestaTexto(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary d-flex align-items-center justify-content-center px-4"
                                            disabled={!respuestaTexto.trim()}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm p-5 text-center h-100 d-flex flex-column justify-content-center align-items-center text-muted">
                            <MessageSquare size={48} className="mb-2 opacity-50" />
                            <h5>Selecciona una conversación</h5>
                            <p className="mb-0">
                                {esAdmin 
                                    ? 'Haz clic en cualquier mensaje para responder la consulta del emprendedor.' 
                                    : 'Haz clic en cualquier mensaje para ver el historial y responder al Administrador.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para Crear Nuevo Mensaje */}
            {mostrarModalNuevo && (
                <div 
                    className="modal show d-block" 
                    tabIndex={-1} 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    {esAdmin ? 'Nuevo mensaje a Emprendedor' : 'Crear nueva consulta o ticket'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setMostrarModalNuevo(false)}
                                />
                            </div>
                            <form onSubmit={crearNuevoMensaje}>
                                <div className="modal-body p-4">
                                    {esAdmin && (
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small">Nombre del Emprendedor</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Ej. Marcos Pérez"
                                                value={nuevoEmprendedorNombre}
                                                onChange={(e) => setNuevoEmprendedorNombre(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Asunto</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Ej. Consulta sobre facturación / Consulta de producto"
                                            value={nuevoAsunto}
                                            onChange={(e) => setNuevoAsunto(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {esAdmin && (
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small">Categoría</label>
                                            <select 
                                                className="form-select"
                                                value={nuevaCategoria}
                                                onChange={(e) => setNuevaCategoria(e.target.value as any)}
                                            >
                                                <option value="General">General</option>
                                                <option value="Soporte">Soporte</option>
                                                <option value="Aprobación">Aprobación</option>
                                                <option value="Notificación">Notificación</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Mensaje</label>
                                        <textarea 
                                            className="form-control" 
                                            rows={4}
                                            placeholder="Escribe el detalle del mensaje aquí..."
                                            value={nuevoTextoMensaje}
                                            onChange={(e) => setNuevoTextoMensaje(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-top">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => setMostrarModalNuevo(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary d-flex align-items-center gap-2 px-4"
                                        disabled={!nuevoAsunto.trim() || !nuevoTextoMensaje.trim()}
                                    >
                                        <Send size={16} /> Enviar
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

export default ChatInterno;