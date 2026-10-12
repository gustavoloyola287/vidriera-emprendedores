    import React, { useState, useEffect } from 'react';
import { Star, Loader2, MessageSquare, AlertCircle, Send, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Calificacion {
    id: number;
    clienteNombre: string;
    estrellas: number;
    comentario: string;
    fecha: string;
    respuesta?: string;
}

export default function OpinionesYCalificaciones() {
    const [promedio, setPromedio] = useState<number>(0);
    const [totalReseñas, setTotalReseñas] = useState<number>(0);
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [idRespondiendo, setIdRespondiendo] = useState<number | null>(null);
    const [textoRespuesta, setTextoRespuesta] = useState<string>('');
    const [enviandoRespuesta, setEnviandoRespuesta] = useState<boolean>(false);

    // ✅ Toast Dinámico (Soporta tipo: éxito, advertencia y error)
    const [toastInfo, setToastInfo] = useState<{
        visible: boolean;
        mensaje: string;
        tipo: 'success' | 'warning' | 'danger';
    }>({
        visible: false,
        mensaje: '',
        tipo: 'success'
    });

    useEffect(() => {
        const fetchCalificaciones = async () => {
            try {
                // Simulación de carga (Mock)
                setTimeout(() => {
                    const dataMock = {
                        promedio: 4.8,
                        totalReseñas: 12,
                        opiniones: [
                            { 
                                id: 1, 
                                clienteNombre: "Lucía Gómez", 
                                estrellas: 5, 
                                comentario: "¡Excelente atención y los productos son de primera calidad! Súper recomendable.", 
                                fecha: "10/10/2026",
                                respuesta: "¡Muchas gracias Lucía! Te esperamos nuevamente en el stand." 
                            },
                            { 
                                id: 2, 
                                clienteNombre: "Carlos Pérez", 
                                estrellas: 4, 
                                comentario: "Muy buen producto, tardó un poquito en el stand pero valió la pena.", 
                                fecha: "08/10/2026",
                                respuesta: undefined 
                            },
                        ]
                    };
                    setPromedio(dataMock.promedio);
                    setTotalReseñas(dataMock.totalReseñas);
                    setCalificaciones(dataMock.opiniones);
                    setCargando(false);
                }, 800);

            } catch (err: any) {
                console.error("Error al obtener calificaciones:", err);
                setError(err.message || "No se pudo conectar con el servidor.");
                setCargando(false);
            }
        };

        fetchCalificaciones();
    }, []);

    // ✅ Función para disparar el Toast con color personalizado
    const mostrarToast = (mensaje: string, tipo: 'success' | 'warning' | 'danger' = 'success') => {
        setToastInfo({ visible: true, mensaje, tipo });
        setTimeout(() => {
            setToastInfo(prev => ({ ...prev, visible: false }));
        }, 4000);
    };

    const handleEnviarRespuesta = async (idOpinion: number) => {
        if (!textoRespuesta.trim()) {
            mostrarToast("La respuesta no puede estar vacía.", "warning");
            return;
        }

        setEnviandoRespuesta(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600)); // Simula delay

            // Ejemplo de simulación de error aleatorio o validación de negocio
            // if (textoRespuesta.length < 5) {
            //     throw new Error("La respuesta es demasiado corta.");
            // }

            setCalificaciones(prev => prev.map(item => {
                if (item.id === idOpinion) {
                    return { ...item, respuesta: textoRespuesta };
                }
                return item;
            }));

            setIdRespondiendo(null);
            setTextoRespuesta('');
                        
            // ✅ Toast Verde de Éxito
                Refactor:  mostrarToast("¡Respuesta enviada y publicada con éxito!", "success");

        } catch (err: any) {
            console.error("Error al responder opinión:", err);
            // ✅ Toast Rojo de Error Fallido
            mostrarToast(err.message || "Error al procesar la respuesta con el servidor.", "danger");
        } finally {
            setEnviandoRespuesta(false);
        }
    };

    const renderEstrellas = (cantidad: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                className={index < cantidad ? "text-warning fill-warning" : "text-muted opacity-25"}
            />
        ));
    };

    // Selección de clases de Bootstrap según el tipo de Toast
    const obtenerClaseToastBg = (tipo: 'success' | 'warning' | 'danger') => {
        switch (tipo) {
            case 'success': return 'bg-success text-white';
            case 'warning': return 'bg-warning text-dark'; // Amarillo
            case 'danger': return 'bg-danger text-white';   // Rojo
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

    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5 min-vh-50">
                <Loader2 size={32} className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-4 position-relative">
            {/* ✅ TOAST EMERGENTE FLOTANTE MULTIESTADO (Esquina inferior derecha) */}
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

            <h2 className="fw-bold mb-1 text-dark">Opiniones y Calificaciones</h2>
            <p className="text-muted small mb-4">
                Visualizá el promedio de calificaciones, las reseñas de tus compradores e interactuá respondiendo públicamente.
            </p>

            {error && (
                <div className="alert alert-danger small d-flex align-items-center gap-2" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* Tarjeta de Resumen / Promedio General */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-light">
                <div className="row align-items-center text-center text-md-start">
                    <div className="col-md-4 border-end-md mb-3 mb-md-0">
                        <span className="text-muted text-uppercase fw-semibold style-micro d-block mb-1">
                            Puntuación Promedio
                        </span>
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                            <h1 className="display-4 fw-bold text-dark mb-0">{promedio.toFixed(1)}</h1>
                            <div>
                                <div className="d-flex mb-1">
                                    {renderEstrellas(Math.round(promedio))}
                                </div>
                                <span className="text-muted small">Basado en {totalReseñas} opiniones</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 ps-md-4">
                        <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                            <MessageSquare size={20} />
                            <h5 className="mb-0 fw-bold">Reputación y Atención al Cliente</h5>
                        </div>
                        <p className="text-muted small mb-0">
                            Responder a las reseñas de los clientes mejora la reputación de tu stand y afianza el vínculo con la comunidad de la feria municipal.
                        </p>
                    </div>
                </div>
            </div>

            {/* Listado de Reseñas */}
            <h5 className="fw-bold text-secondary mb-3">Reseñas de los Compradores</h5>
            {calificaciones.length === 0 ? (
                <div className="card border-0 shadow-sm p-4 text-center text-muted rounded-3">
                    Aún no tenés calificaciones registradas.
                </div>
            ) : (
                <div className="row g-3">
                    {calificaciones.map((item) => (
                        <div className="col-12" key={item.id}>
                            <div className="card border-0 shadow-sm p-3 rounded-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 className="fw-bold mb-0 text-dark">{item.clienteNombre}</h6>
                                        <span className="text-muted style-micro">{item.fecha}</span>
                                    </div>
                                    <div className="d-flex">
                                        {renderEstrellas(item.estrellas)}
                                    </div>
                                </div>
                                <p className="text-secondary small mb-2">
                                    "{item.comentario}"
                                </p>

                                {item.respuesta ? (
                                    <div className="bg-light p-2 rounded-2 border-start border-primary border-3 mt-2 ms-3">
                                        <span className="fw-semibold text-primary style-micro d-block mb-1">
                                            Tu respuesta:
                                        </span>
                                        <p className="text-muted small mb-0">{item.respuesta}</p>
                                    </div>
                                ) : (
                                    <div className="mt-2 text-end">
                                        {idRespondiendo !== item.id ? (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary py-1 px-3 style-small"
                                                onClick={() => {
                                                    setIdRespondiendo(item.id);
                                                    setTextoRespuesta('');
                                                }}
                                            >
                                                Responder opinión
                                            </button>
                                        ) : (
                                            <div className="mt-2 text-start bg-white p-3 border rounded-3 shadow-sm">
                                                <label className="form-label text-muted fw-semibold style-small mb-1">
                                                    Escribe tu respuesta pública:
                                                </label>
                                                <textarea
                                                    className="form-control form-control-sm mb-2"
                                                    rows={2}
                                                    placeholder="Agradece el comentario o aclara cualquier duda..."
                                                    value={textoRespuesta}
                                                    onChange={(e) => setTextoRespuesta(e.target.value)}
                                                ></textarea>
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary px-3"
                                                        onClick={() => setIdRespondiendo(null)}
                                                        disabled={enviandoRespuesta}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary px-3 d-flex align-items-center gap-1"
                                                        onClick={() => handleEnviarRespuesta(item.id)}
                                                        disabled={enviandoRespuesta}
                                                    >
                                                        {enviandoRespuesta ? (
                                                            <>
                                                                <Loader2 size={14} className="spinner-border spinner-border-sm" />
                                                                Enviando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send size={14} /> Enviar Respuesta
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
