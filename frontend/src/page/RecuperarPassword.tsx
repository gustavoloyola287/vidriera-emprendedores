import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import api from '../services/api';

export const RecuperarPassword: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailTrimmed = email.trim().toLowerCase();

        if (!emailTrimmed) {
            mostrarToast('Por favor ingresa tu correo electrónico.', 'warning');
            return;
        }

        setLoading(true);

        try {
            await api.patch('/auth/recover-password', {
                email: emailTrimmed,
            });

            setIsSubmitted(true);
            mostrarToast('¡Correo de recuperación enviado con éxito!', 'success');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                mostrarToast(err.response.data.message, 'danger');
            } else if (err.code === 'ERR_NETWORK') {
                mostrarToast('No se pudo conectar con el servidor.', 'danger');
            } else {
                mostrarToast('Ocurrió un error al procesar la solicitud. Intenta nuevamente.', 'danger');
            }
        } finally {
            setLoading(false);
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
        <div className="container d-flex flex-column justify-content-center align-items-center py-5 min-vh-100 position-relative">
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

            <h2 className="fw-bold mb-2 text-center" style={{ color: '#0066FF' }}>
                Recuperar Contraseña
            </h2>
            
            <p className="text-muted text-center mb-4" style={{ maxWidth: '450px' }}>
                Ingresa tu correo electrónico registrado y te enviaremos las instrucciones.
            </p>

            <div className="card shadow-sm p-4 w-100 border-0 rounded-4" style={{ maxWidth: '420px' }}>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="email" className="form-label fw-semibold text-secondary">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                className="form-control py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-100 py-2 fw-bold text-white mb-3"
                            style={{ backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-3">
                        <div className="mb-3 fs-1" style={{ color: '#0066FF' }}>✉️</div>
                        <h4 className="fw-bold mb-2 text-dark">¡Correo enviado!</h4>
                        <p className="text-muted small mb-4">
                            Revisá tu bandeja de entrada. Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña (no olvides revisar la carpeta de spam).
                        </p>
                    </div>
                )}

                <div className="text-center pt-2 border-top">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="btn btn-link text-decoration-none fw-semibold p-0"
                        style={{ color: '#0066FF' }}
                    >
                        ← Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;