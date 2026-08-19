import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

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

    const manejarSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validarDatos()) {
        return;
        }

        setCargando(true);

        try {
        // Petición al backend en Spring Boot
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: clave }), // Mapeamos clave -> password para la API
        });

        if (response.ok) {
            const data = await response.json();

            // 1. Guardamos el token en el AuthContext global
            login(data.token);

            // 2. Redirigimos al inicio/panel
            navigate('/');
        } else {
            setError('Credenciales incorrectas. Verificá tu correo y contraseña.');
        }
        } catch (err) {
        console.error('Error al conectar con el servidor:', err);
        setError('Ocurrió un error al conectar con el servidor.');
        } finally {
        setCargando(false); // Liberamos el botón cuando finaliza la petición
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
        <h2>Iniciar Sesión</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={manejarSubmit}>
            <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
            </div>

            <div style={{ marginBottom: '1rem' }}>
            <label>Contraseña</label>
            <input
                type="password"
                value={clave}
                onChange={(event) => setClave(event.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
            </div>

            <button
            type="submit"
            disabled={cargando}
            style={{ padding: '0.5rem 1rem', cursor: cargando ? 'not-allowed' : 'pointer' }}
            >
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
        </form>
        </div>
    );
    };

export default Login;