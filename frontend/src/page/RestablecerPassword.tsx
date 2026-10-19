import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import  api from '../services/api'; // Instancia centralizada de Axios

export const RestablecerPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. Obtenemos el token desde la URL (?token=XYZ)
    const token = searchParams.get('token');

    // 2. Estados locales del formulario y UI
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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

    // 3. Manejador de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            mostrarToast('Falta el token de recuperación en la URL.', 'danger');
            return;
        }

        // Validaciones de negocio en el Frontend
        if (password !== confirmPassword) {
            mostrarToast('Las contraseñas no coinciden.', 'warning');
            return;
        }

        if (password.length < 6) {
            mostrarToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
            return;
        }

        setLoading(true);

        try {
            // Petición real al backend
            await api.post('/auth/reset-password', {
                token: token,
                newPassword: password,
            });

            setIsSuccess(true);
            mostrarToast('¡Contraseña actualizada con éxito!', 'success');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                mostrarToast(err.response.data.message, 'danger');
            } else if (err.code === 'ERR_NETWORK') {
                mostrarToast('No se pudo conectar con el servidor.', 'danger');
            } else {
                mostrarToast('El enlace de recuperación es inválido o ha expirado.', 'danger');
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
                Nueva Contraseña
            </h2>

            <p className="text-muted text-center mb-4" style={{ maxWidth: '450px' }}>
                Ingresa tu nueva clave de acceso para actualizar tu cuenta.
            </p>

            <div className="card shadow-sm p-4 w-100 border-0 rounded-4" style={{ maxWidth: '420px' }}>
                {!isSuccess ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="password" className="form-label fw-semibold text-secondary">
                                Nueva Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="form-control py-2"
                            />
                        </div>

                        <div className="mb-3 text-start">
                            <label htmlFor="confirmPassword" className="form-label fw-semibold text-secondary">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="form-control py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn w-100 py-2 fw-bold text-white mb-3"
                            style={{ backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                        >
                            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-3">
                        <div className="mb-3 fs-1 text-success">✓</div>
                        <h4 className="fw-bold mb-2 text-dark">¡Contraseña actualizada!</h4>
                        <p className="text-muted small mb-4">
                            Tu clave ha sido modificada con éxito. Ya podés iniciar sesión con tus nuevas credenciales.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="btn w-100 py-2 fw-bold text-white"
                            style={{ backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                        >
                            Ir al Inicio de Sesión
                        </button>
                    </div>
                )}

                <div className="text-center pt-2 border-top mt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="btn btn-link text-decoration-none fw-semibold p-0"
                        style={{ color: '#0066FF' }}
                    >
                        ← Cancelar y volver al login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestablecerPassword;