import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../Services/api';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const emailTrimmed = email.trim().toLowerCase();

            if (!emailTrimmed || !password) {
            setError('Por favor complete todos los campos.');
            return;
            }

            setLoading(true);

            try {
            const response = await api.post('/auth/login', {
                email: emailTrimmed,
                password,
            });

            // Ajustá estos nombres de propiedades según las propiedades exactas que retorna tu backend
            const { token, id, emprendedorId, nombre, nombreEmprendimiento, emprendimiento } = response.data;

            // 1. Guardar Token y Datos de sesión
            localStorage.setItem('token', token);

            const idFinal = emprendedorId || id;
            const nombreFinal = nombreEmprendimiento || emprendimiento || nombre;

            if (idFinal) {
                localStorage.setItem('emprendedorId', idFinal.toString());
            }
            if (nombreFinal) {
                localStorage.setItem('nombreEmprendedor', nombreFinal);
            }

            // 2. Actualizar estado global y redirigir
            login(token);
            navigate('/');
            } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.code === 'ERR_NETWORK') {
                setError('No se pudo conectar con el servidor.');
            } else {
                setError('Credenciales inválidas o error inesperado.');
            }
            } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-75">
            <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card shadow border-0 rounded-3 p-4 bg-white">
                <h2 className="text-center fw-bold mb-4" style={{ color: '#0066FF' }}>
                Iniciar sesión
                </h2>

                {error && (
                <div className="alert alert-danger py-2 text-center text-sm" role="alert">
                    {error}
                </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3 text-start">
                    <label htmlFor="loginEmail" className="form-label fw-semibold text-secondary">
                    Email
                    </label>
                    <input
                    id="loginEmail"
                    type="email"
                    className="form-control"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    />
                </div>

                <div className="mb-4 text-start">
                    <label htmlFor="loginPassword" className="form-label fw-semibold text-secondary">
                    Contraseña
                    </label>
                    <input
                    id="loginPassword"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    />
                </div>

                <button
                    type="submit"
                    className="btn w-100 py-2 fw-bold text-white"
                    style={{ backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                    disabled={loading}
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                <div className="mt-4 text-center">
                    <Link
                    to="/recuperar-password"
                    className="text-decoration-none fw-semibold text-sm"
                    style={{ color: '#0066FF' }}
                    >
                    ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Login;