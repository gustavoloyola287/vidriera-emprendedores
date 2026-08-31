import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Asegura que los campos arranquen limpios cada vez que entra a la pantalla
    useEffect(() => {
        setEmail("");
        setClave("");
    }, []);

    function validarDatos(): boolean {
        if (email.trim() === '') {
        setError('Ingrese su email');
        return false;
        }

        if (clave.trim() === '') {
        setError('Ingrese su contraseña');
        return false;
        }

        setError(null);
        return true;
    }

    async function manejarSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validarDatos()) {
        return;
        }

        setCargando(true);
        setError("");

        try {
        setError("");

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: clave })
            });

            if (!response.ok) {
                const mensajeError = await response.text();
                throw new Error(mensajeError || 'Credenciales inválidas. Verificá tu email y contraseña.');
            }

            const datos = await response.json();

            // Actualiza el contexto de autenticación (main)
            if (datos.token) {
                login(datos.token);
                // También guardamos en localStorage para compatibilidad con código previo
                localStorage.setItem('token', datos.token);
            }

            const nombreGuardar = datos.nombreEmprendimiento || datos.nombreCompleto || datos.nombre || email;
            localStorage.setItem('nombreEmprendedor', nombreGuardar);

            if (datos.id) {
                localStorage.setItem('emprendedorId', datos.id);
            }

            // Limpiamos los campos del estado antes de navegar
            setEmail("");
            setClave("");

            // Redirigimos a la lista de productos (incoming)
            navigate('/productos');

        } catch (err: any) {
            if (err.message === 'Failed to fetch') {
                setError('No se pudo conectar con el servidor. Revisá tu conexión o si el backend está corriendo.');
            } else {
                setError(err.message || 'Ocurrió un error al conectar con el servidor.');
            }
        } finally {
            setCargando(false);
        }

        return (
            <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Iniciar sesión</h1>

                {/* autoComplete="off" evita sugerencias en el formulario */}
                <form onSubmit={manejarSubmit} autoComplete="off">

                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
                        <input
                            type="email"
                            name="email_login_field"
                            autoComplete="new-password"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Contraseña</label>
                        <input
                            type="password"
                            name="password_login_field"
                            autoComplete="new-password"
                            value={clave}
                            onChange={(event) => setClave(event.target.value)}
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>{error}</p>}

                    <button 
                        type="submit" 
                        disabled={cargando}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: cargando ? "#ccc" : "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: cargando ? "not-allowed" : "pointer",
                            fontSize: "16px"
                        }}
                    >
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
                        ¿No tienes cuenta? <a href="/registro">Regístrate acá</a>
                    </p>

                </form>
            </div>
        );
        </div>
    );
    };

export default Login;