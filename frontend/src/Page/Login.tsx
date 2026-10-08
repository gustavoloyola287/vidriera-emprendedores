import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

        // ✅ Ahora el backend SÍ devuelve role, id y nombre
        const { token, role, id, nombre } = response.data;

        if (token) {
            localStorage.setItem('token', token);
        }
        if (role) {
            localStorage.setItem('role', role);
        }
        if (id) {
            localStorage.setItem('emprendedorId', id.toString());
        }
        if (nombre) {
            localStorage.setItem('nombreEmprendedor', nombre);
        }
        
        // Actualizar estado global
        login(token);

        // Redirección según Rol recibido del Backend
        const userRole = role?.toUpperCase();

        if (userRole === 'ROLE_SUPER_ADMIN' || userRole === 'SUPER_ADMIN') {
            navigate('/superadmindashboard');
        } else if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
            navigate('/admindashboard');
        } else if (userRole === 'ROLE_EMPRENDEDOR' || userRole === 'EMPRENDEDOR') {
            navigate('/emprendedordashboard');
        } else {
            navigate('/');
        }

    } catch (err: any) {
        if (err.response?.data?.message) {
            setError(err.response.data.message);
        } else if (err.response?.status === 401) {
            setError('Credenciales inválidas. Por favor, verifique su email y contraseña.');
        } else if (err.code === 'ERR_NETWORK') {
            setError('Error de conexión. Asegurate que el backend esté corriendo.');
        } else {
            setError('Ocurrió un error inesperado al iniciar la sesión');
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

                        <form onSubmit={handleSubmit} noValidate autoComplete="off">
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
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            <div className="mb-4 text-start">
                                <label htmlFor="loginPassword" className="form-label fw-semibold text-secondary">
                                    Contraseña
                                </label>
                                <div className="input-group">
                                <input
                                    id="loginPassword"
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                </div>
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