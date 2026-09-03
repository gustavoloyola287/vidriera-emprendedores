import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api'; // Instancia centralizada de Axios

export const RestablecerPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 1. Obtenemos el token desde la URL (?token=XYZ)
    const token = searchParams.get('token');

    // 2. Estados locales del formulario y UI
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // 3. Manejador de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError('Falta el token de recuperación en la URL.');
            return;
        }

        // Validaciones de negocio en el Frontend
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
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
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.code === 'ERR_NETWORK') {
                setError('No se pudo conectar con el servidor.');
            } else {
                setError('El enlace de recuperación es inválido o ha expirado.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center py-5 min-vh-100">
            <h2 className="fw-bold mb-2 text-center" style={{ color: '#0066FF' }}>
                Nueva Contraseña
            </h2>

            <p className="text-muted text-center mb-4" style={{ maxWidth: '450px' }}>
                Ingresa tu nueva clave de acceso para actualizar tu cuenta.
            </p>

            <div className="card shadow-sm p-4 w-100 border-0 rounded-4" style={{ maxWidth: '420px' }}>
                {error && (
                    <div className="alert alert-danger text-center mb-3 text-sm" role="alert">
                        {error}
                    </div>
                )}

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