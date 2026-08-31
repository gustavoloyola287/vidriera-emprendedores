import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../Services/api'; // Asegurate de que la ruta sea correcta según tu estructura

export const RecuperarPassword: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const emailTrimmed = email.trim().toLowerCase();

        if (!emailTrimmed) {
            setError('Por favor ingresa tu correo electrónico.');
            return;
        }

        setLoading(true);

        try {
            // Petición real al backend usando tu instancia centralizada de Axios
            await api.patch('/auth/recover-password', {
                email: emailTrimmed,
            });

            setIsSubmitted(true);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.code === 'ERR_NETWORK') {
                setError('No se pudo conectar con el servidor.');
            } else {
                setError('Ocurrió un error al procesar la solicitud. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center py-5 min-vh-100">
            <h2 className="fw-bold mb-2 text-center" style={{ color: '#0066FF' }}>
                Recuperar Contraseña
            </h2>
            
            <p className="text-muted text-center mb-4" style={{ maxWidth: '450px' }}>
                Ingresa tu correo electrónico registrado y te enviaremos las instrucciones.
            </p>

            <div className="card shadow-sm p-4 w-100 border-0 rounded-4" style={{ maxWidth: '420px' }}>
                {error && (
                    <div className="alert alert-danger text-center mb-3 text-sm" role="alert">
                        {error}
                    </div>
                )}

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