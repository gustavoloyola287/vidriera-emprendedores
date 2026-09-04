import React, { useState, useRef, useEffect } from 'react';
import { 
Send, 
CheckCheck,
Package
} from 'lucide-react';

    interface Mensaje {
    id: number;
    emisor: 'cliente' | 'emprendedor';
    texto: string;
    fecha: string;
    }

    interface Consulta {
    id: number;
    clienteNombre: string;
    productoNombre: string;
    ultimoMensaje: string;
    fecha: string;
    leido: boolean;
    mensajes: Mensaje[];
    }

    export const ConsultasConChat: React.FC = () => {
    const [consultas, setConsultas] = useState<Consulta[]>([
        {
        id: 1,
        clienteNombre: 'Juan Pérez',
        productoNombre: 'Maceta Artesanal de Cerámica',
        ultimoMensaje: '¿Tienen stock disponible en color verde oliva?',
        fecha: 'Hace 10 min',
        leido: false,
        mensajes: [
            { id: 101, emisor: 'cliente', texto: 'Hola! ¿Tienen stock disponible en color verde oliva?', fecha: '10:30 AM' }
        ]
        },
        {
        id: 2,
        clienteNombre: 'María Gómez',
        productoNombre: 'Set de Mates Grabados',
        ultimoMensaje: '¿Hacen envíos a domicilio en la zona céntrica?',
        fecha: 'Hace 2 horas',
        leido: true,
        mensajes: [
            { id: 102, emisor: 'cliente', texto: '¿Hacen envíos a domicilio en la zona céntrica?', fecha: '08:15 AM' },
            { id: 103, emisor: 'emprendedor', texto: 'Hola María! Sí, hacemos envíos sin cargo en zona centro.', fecha: '08:45 AM' }
        ]
        }
    ]);

    const [consultaSeleccionada, setConsultaSeleccionada] = useState<Consulta | null>(null);
    const [nuevoTexto, setNuevoTexto] = useState('');
    
    // Referencia para scroll automático al final del chat
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (consultaSeleccionada) {
        scrollToBottom();
        }
    }, [consultaSeleccionada?.mensajes]);

    const abrirChat = (consulta: Consulta) => {
        setConsultaSeleccionada(consulta);
        setConsultas(prev =>
        prev.map(c => (c.id === consulta.id ? { ...c, leido: true } : c))
        );
    };

    const handleEnviarRespuesta = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoTexto.trim() || !consultaSeleccionada) return;

        const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const nuevoMensaje: Mensaje = {
        id: Date.now(),
        emisor: 'emprendedor',
        texto: nuevoTexto,
        fecha: horaActual
        };

        const consultaActualizada = {
        ...consultaSeleccionada,
        ultimoMensaje: `Tú: ${nuevoTexto}`,
        mensajes: [...consultaSeleccionada.mensajes, nuevoMensaje]
        };

        setConsultaSeleccionada(consultaActualizada);
        setConsultas(prev =>
        prev.map(c => (c.id === consultaSeleccionada.id ? consultaActualizada : c))
        );

        setNuevoTexto('');
    };

    return (
        <div className="card border-0 shadow-sm p-4">
        <h5 className="fw-bold mb-1">Consultas y Notificaciones</h5>
        <p className="text-muted mb-4">Mensajes enviados por los clientes desde la vidriera pública.</p>

        {/* LISTA DE CONSULTAS */}
        <div className="list-group">
            {consultas.map((consulta) => (
            <button
                key={consulta.id}
                onClick={() => abrirChat(consulta)}
                className={`list-group-item list-group-item-action p-3 text-start border-start border-4 mb-2 rounded-3 shadow-sm ${
                !consulta.leido ? 'border-primary bg-light fw-bold' : 'border-transparent bg-white'
                }`}
            >
                <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fs-6 text-dark">{consulta.clienteNombre}</span>
                {!consulta.leido ? (
                    <span className="badge bg-primary">Nuevo</span>
                ) : (
                    <small className="text-muted">{consulta.fecha}</small>
                )}
                </div>
                <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                <Package size={14} /> Producto: {consulta.productoNombre}
                </div>
                <p className="mb-0 text-secondary text-truncate" style={{ maxWidth: '600px' }}>
                {consulta.ultimoMensaje}
                </p>
            </button>
            ))}
        </div>

        {/* MODAL / VENTANA DE CHAT */}
        {consultaSeleccionada && (
            <div 
            className="modal fade show d-block" 
            tabIndex={-1} 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                
                {/* CABECERA */}
                <div className="modal-header bg-primary text-white">
                    <div>
                    <h6 className="modal-title fw-bold">{consultaSeleccionada.clienteNombre}</h6>
                    <small className="opacity-75">
                        Consulta por: {consultaSeleccionada.productoNombre}
                    </small>
                    </div>
                    <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setConsultaSeleccionada(null)}
                    ></button>
                </div>

                {/* HISTORIAL DE MENSAJES */}
                <div 
                    className="modal-body bg-light overflow-auto p-3" 
                    style={{ maxHeight: '400px', minHeight: '300px' }}
                >
                    {consultaSeleccionada.mensajes.map((msg) => {
                    const esEmprendedor = msg.emisor === 'emprendedor';
                    return (
                        <div 
                        key={msg.id} 
                        className={`d-flex flex-column mb-3 ${esEmprendedor ? 'align-items-end' : 'align-items-start'}`}
                        >
                        <div 
                            className={`p-3 rounded-3 shadow-sm ${
                            esEmprendedor 
                                ? 'bg-primary text-white rounded-bottom-end-0' 
                                : 'bg-white text-dark border rounded-bottom-start-0'
                            }`}
                            style={{ maxWidth: '75%' }}
                        >
                            <p className="mb-1">{msg.texto}</p>
                            <div className={`d-flex align-items-center justify-content-end gap-1 small ${esEmprendedor ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                            <span>{msg.fecha}</span>
                            {esEmprendedor && <CheckCheck size={14} />}
                            </div>
                        </div>
                        </div>
                    );
                    })}
                    {/* Elemento de anclaje para autoscroll */}
                    <div ref={chatEndRef} />
                </div>

                {/* FORMULARIO DE RESPUESTA */}
                <div className="modal-footer bg-white border-top">
                    <form onSubmit={handleEnviarRespuesta} className="d-flex w-100 gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Escribí tu respuesta..."
                        value={nuevoTexto}
                        onChange={(e) => setNuevoTexto(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary d-flex align-items-center gap-1">
                        <Send size={16} /> Enviar
                    </button>
                    </form>
                </div>

                </div>
            </div>
            </div>
        )}
        </div>
    );
    };

export default ConsultasConChat;