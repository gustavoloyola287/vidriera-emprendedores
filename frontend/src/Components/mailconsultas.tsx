import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Clock, User, X, MessageSquareIcon } from 'lucide-react';

interface Mensaje {
    id: string;
    remitente: 'usuario' | 'emprendedor';
    texto: string;
    fecha: string;
    }

    interface ConsultaEmail {
    id: string;
    usuarioNombre: string;
    usuarioEmail: string;
    asunto: string;
    productoRelacionado?: string;
    mensajes: Mensaje[];
    leido: boolean;
    estado: 'pendiente' | 'respondido';
    }

    export const MailConsultas: React.FC = () => {
    const [consultas, setConsultas] = useState<ConsultaEmail[]>([
        {
        id: '1',
        usuarioNombre: 'Carlos Gómez',
        usuarioEmail: 'carlos.gomez@email.com',
        asunto: 'Consulta por talle y stock',
        productoRelacionado: 'Remera Oversize Grunge',
        leido: false,
        estado: 'pendiente',
        mensajes: [
            {
            id: 'm1',
            remitente: 'usuario',
            texto: 'Hola, quería saber si tienen disponibilidad en talle XL de la remera negra.',
            fecha: '10/05/2026 14:30',
            },
        ],
        },
        {
        id: '2',
        usuarioNombre: 'Mariana López',
        usuarioEmail: 'mariana.l@email.com',
        asunto: 'Tiempos de envío a Córdoba',
        productoRelacionado: 'Buzo Hoodie Custom',
        leido: true,
        estado: 'respondido',
        mensajes: [
            {
            id: 'm2',
            remitente: 'usuario',
            texto: 'Buenas tardes! ¿Cuánto tarda aproximadamente el envío al centro de Córdoba?',
            fecha: '09/05/2026 11:15',
            },
            {
            id: 'm3',
            remitente: 'emprendedor',
            texto: 'Hola Mariana! Los envíos dentro de Córdoba capital demoran entre 24 y 48 hs hábiles.',
            fecha: '09/05/2026 11:45',
            },
        ],
        },
    ]);

    const [consultaSeleccionada, setConsultaSeleccionada] = useState<ConsultaEmail | null>(null);
    const [respuestaTexto, setRespuestaTexto] = useState('');

    const abrirConsulta = (consulta: ConsultaEmail) => {
        const actualizadas = consultas.map((c) =>
        c.id === consulta.id ? { ...c, leido: true } : c,
        );
        setConsultas(actualizadas);
        setConsultaSeleccionada({ ...consulta, leido: true });
    };

    const enviarRespuesta = (e: React.FormEvent) => {
        e.preventDefault();
        if (!respuestaTexto.trim() || !consultaSeleccionada) return;

        const nuevoMensaje: Mensaje = {
        id: Date.now().toString(),
        remitente: 'emprendedor',
        texto: respuestaTexto,
        fecha: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        };

        const consultaActualizada: ConsultaEmail = {
        ...consultaSeleccionada,
        estado: 'respondido',
        mensajes: [...consultaSeleccionada.mensajes, nuevoMensaje],
        };

        setConsultas(consultas.map((c) => (c.id === consultaSeleccionada.id ? consultaActualizada : c)));
        setConsultaSeleccionada(consultaActualizada);
        setRespuestaTexto('');
    };

    return (
        <div className="container-fluid py-4">
        <div className="d-flex align-items-center gap-2 mb-4">
            <Mail className="text-primary" size={28} />
            <h3 className="fw-bold mb-0">Consultas Recibidas</h3>
        </div>

        <div className="row g-4">
            <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm p-3">
                <h6 className="fw-bold mb-3 text-muted">Bandeja de Entrada</h6>
                <div className="list-group list-group-flush">
                {consultas.map((consulta) => (
                    <button
                    key={consulta.id}
                    onClick={() => abrirConsulta(consulta)}
                    className={`list-group-item list-group-item-action p-3 text-start border-start border-4 mb-2 rounded-3 shadow-sm ${
                        !consulta.leido ? 'border-primary bg-light fw-bold' : 'border-0 bg-white'
                    }`}
                    >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-truncate" style={{ maxWidth: '180px' }}>
                        {consulta.usuarioNombre}
                        </span>
                        <span className="badge rounded-pill bg-secondary bg-opacity-10 text-dark small fw-normal">
                        {consulta.estado === 'respondido' ? (
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
                    <div className="fw-bold text-dark mb-1">{consulta.asunto}</div>
                    {consulta.productoRelacionado && (
                        <div className="small text-muted text-truncate">
                        Prod: {consulta.productoRelacionado}
                        </div>
                    )}
                    </button>
                ))}
                </div>
            </div>
            </div>

            <div className="col-12 col-lg-7">
            {consultaSeleccionada ? (
                <div className="card border-0 shadow-sm d-flex flex-column h-100">
                <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-start">
                    <div>
                    <h5 className="fw-bold mb-1">{consultaSeleccionada.asunto}</h5>
                    <div className="small text-muted d-flex align-items-center gap-2">
                        <User size={14} /> {consultaSeleccionada.usuarioNombre} ({consultaSeleccionada.usuarioEmail})
                    </div>
                    {consultaSeleccionada.productoRelacionado && (
                        <span className="badge bg-light text-dark border mt-2">
                        Producto: {consultaSeleccionada.productoRelacionado}
                        </span>
                    )}
                    </div>
                    <button
                    className="btn btn-sm btn-light rounded-circle"
                    onClick={() => setConsultaSeleccionada(null)}
                    >
                    <X size={18} />
                    </button>
                </div>

                <div className="card-body p-3 bg-light overflow-auto" style={{ maxHeight: '400px' }}>
                    <div className="d-flex flex-column gap-3">
                    {consultaSeleccionada.mensajes.map((msg) => {
                        const esEmprendedor = msg.remitente === 'emprendedor';
                        return (
                        <div
                            key={msg.id}
                            className={`d-flex flex-column ${esEmprendedor ? 'align-items-end' : 'align-items-start'}`}
                        >
                            <div
                            className={`p-3 rounded-3 shadow-sm ${
                                esEmprendedor ? 'bg-primary text-white' : 'bg-white text-dark border'
                            }`}
                            style={{ maxWidth: '85%' }}
                            >
                            <p className="mb-1 text-break">{msg.texto}</p>
                            <div
                                className={`d-flex align-items-center justify-content-end gap-1 small ${esEmprendedor ? 'text-white-50' : 'text-muted'}`}
                                style={{ fontSize: '11px' }}
                            >
                                <span>{msg.fecha}</span>
                                {esEmprendedor && <Mail size={12} />}
                            </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>

                <div className="card-footer bg-white p-3 border-top">
                    <form onSubmit={enviarRespuesta}>
                    <div className="input-group">
                        <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Escribe tu respuesta al cliente..."
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
                <MessageSquareIcon size={48} className="mb-2 opacity-50" />
                <h5>Selecciona una consulta</h5>
                <p className="mb-0">Haz clic en cualquier mensaje de la bandeja de entrada para responder.</p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
};

export { MailConsultas as default };