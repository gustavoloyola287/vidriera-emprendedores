import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

        if (!emailTrimmed || !password) {
            mostrarToast('Por favor complete todos los campos.', 'warning');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: emailTrimmed,
                password,
            });

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

            mostrarToast('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

            // Redirección según Rol recibido del Backend
            const userRole = role?.toUpperCase();

            setTimeout(() => {
                if (userRole === 'ROLE_SUPER_ADMIN' || userRole === 'SUPER_ADMIN') {
                    navigate('/superadmindashboard');
                } else if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
                    navigate('/admindashboard');
                } else if (userRole === 'ROLE_EMPRENDEDOR' || userRole === 'EMPRENDEDOR') {
                    navigate('/emprendedordashboard');
                } else {
                    navigate('/');
                }
            }, 800);

        } catch (err: any) {
            if (err.response?.data?.message) {
                mostrarToast(err.response.data.message, 'danger');
            } else if (err.response?.status === 401) {
                mostrarToast('Credenciales inválidas. Por favor, verifique su email y contraseña.', 'danger');
            } else if (err.code === 'ERR_NETWORK') {
                mostrarToast('Error de conexión. Asegurate que el backend esté corriendo.', 'danger');
            } else {
                mostrarToast('Ocurrió un error inesperado al iniciar la sesión', 'danger');
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
        <div className="container py-5 position-relative">
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

            <div className="row justify-content-center align-items-center min-vh-75">
                <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                    <div className="card shadow border-0 rounded-3 p-4 bg-white">
                        <h2 className="text-center fw-bold mb-4" style={{ color: '#0066FF' }}>
                            Iniciar sesión
                        </h2>

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
                                <div className="input-group position-relative">
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
                                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-decoration-none text-muted border-0"
                                        style={{ zIndex: 5 }}
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