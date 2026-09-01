import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegistroEmprendedor() {
    const navigate = useNavigate();

    // Campos Personales / Privados
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [clave, setClave] = useState("");
    const [confirmarClave, setConfirmarClave] = useState("");

    // Campos Públicos del Emprendimiento / Stand
    const [nombreEmprendimiento, setNombreEmprendimiento] = useState("");
    const [descripcionEmprendimiento, setDescripcionEmprendimiento] = useState("");
    const [numeroStand, setNumeroStand] = useState("");
    const [diasYHorarios, setDiasYHorarios] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    function validarDatos(): boolean {
        // 1. Nombre completo
        if (nombreCompleto.trim() === "") {
            setError("Ingrese su nombre completo.");
            return false;
        }

        // 2. Nombre del emprendimiento
        if (nombreEmprendimiento.trim() === "") {
            setError("Ingrese el nombre de su emprendimiento.");
            return false;
        }

        // 3. Ubicación y horarios en feria
        if (numeroStand.trim() === "") {
            setError("Ingrese el número o identificador de su puesto/stand.");
            return false;
        }

        if (diasYHorarios.trim() === "") {
            setError("Ingrese los días y horarios en los que atiende en la feria.");
            return false;
        }

        // 4. Descripción del emprendimiento
        if (descripcionEmprendimiento.trim() === "") {
            setError("Ingrese una breve descripción de su emprendimiento.");
            return false;
        }
        if (descripcionEmprendimiento.trim().length < 10) {
            setError("La descripción debe tener al menos 10 caracteres.");
            return false;
        }

        // 5. Email
        if (email.trim() === "") {
            setError("Ingrese su email de contacto privado.");
            return false;
        }
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email.trim())) {
            setError("Ingrese un formato de email válido.");
            return false;
        }

        // 6. Teléfono
        if (telefono.trim() === "") {
            setError("Ingrese su teléfono personal.");
            return false;
        }
        const regexTelefono = /^[0-9\s+-]{6,15}$/;
        if (!regexTelefono.test(telefono.trim())) {
            setError("Ingrese un número de teléfono válido (solo números, entre 6 y 15 dígitos).");
            return false;
        }

        // 7. Contraseña
        if (clave.trim() === "") {
            setError("Ingrese una contraseña.");
            return false;
        }
        if (clave.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }

        // 8. Confirmación
        if (clave !== confirmarClave) {
            setError("Las contraseñas no coinciden.");
            return false;
        }

        setError("");
        return true;
    }

    async function manejarSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validarDatos()) {
            return;
        }

        setCargando(true);
        setMensaje("");
        setError("");

        try {
            const respuesta = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreCompleto,
                    nombreEmprendimiento,
                    descripcionEmprendimiento,
                    numeroStand,
                    diasYHorarios,
                    email,
                    telefono,
                    password: clave
                })
            });

            if (!respuesta.ok) {
                const mensajeError = await respuesta.text();
                throw new Error(mensajeError || "El email ya está registrado o los datos son inválidos.");
            }

            setMensaje("¡Registro exitoso! Ya podés iniciar sesión.");
            
            // Limpieza del formulario
            setNombreCompleto("");
            setNombreEmprendimiento("");
            setDescripcionEmprendimiento("");
            setNumeroStand("");
            setDiasYHorarios("");
            setEmail("");
            setTelefono("");
            setClave("");
            setConfirmarClave("");

            // Redirección al login tras 2 segundos
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("No se pudo conectar con el servidor. Revisá tu conexión o si el backend está corriendo.");
            } else {
                setError(err.message);
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="container py-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-sm p-4 w-100 border-0 rounded-4" style={{ maxWidth: '650px' }}>
                <h2 className="fw-bold mb-1 text-center" style={{ color: '#0066FF' }}>
                    Registro de Emprendedor
                </h2>
                <p className="text-muted text-center small mb-4">
                    Completá tus datos para publicar tus productos y ubicar tu stand en la feria municipal.
                </p>

                {error && (
                    <div className="alert alert-danger text-center mb-3 text-sm" role="alert">
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div className="alert alert-success text-center mb-3 text-sm" role="alert">
                        {mensaje}
                    </div>
                )}

                <form onSubmit={manejarSubmit}>
                    {/* SECCIÓN 1: DATOS PÚBLICOS DEL STAND */}
                    <h5 className="fw-bold fs-6 text-secondary mb-3 border-bottom pb-2">
                        1. Información Pública del Emprendimiento
                    </h5>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6 text-start">
                            <label htmlFor="nombreEmprendimiento" className="form-label fw-semibold text-secondary small">
                                Nombre del Emprendimiento
                            </label>
                            <input
                                id="nombreEmprendimiento"
                                type="text"
                                className="form-control"
                                placeholder="Ej: Peponas Cakes"
                                value={nombreEmprendimiento}
                                onChange={(e) => setNombreEmprendimiento(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6 text-start">
                            <label htmlFor="numeroStand" className="form-label fw-semibold text-secondary small">
                                N° de Stand / Puesto en Feria
                            </label>
                            <input
                                id="numeroStand"
                                type="text"
                                className="form-control"
                                placeholder="Ej: Stand 12 - Sector A"
                                value={numeroStand}
                                onChange={(e) => setNumeroStand(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="diasYHorarios" className="form-label fw-semibold text-secondary small">
                            Días y Horarios en la Feria
                        </label>
                        <input
                            id="diasYHorarios"
                            type="text"
                            className="form-control"
                            placeholder="Ej: Sábados y Domingos de 16:00 a 21:00 hs"
                            value={diasYHorarios}
                            onChange={(e) => setDiasYHorarios(e.target.value)}
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="descripcionEmprendimiento" className="form-label fw-semibold text-secondary small">
                            Descripción del Emprendimiento
                        </label>
                        <textarea
                            id="descripcionEmprendimiento"
                            className="form-control"
                            rows={3}
                            placeholder="Contanos brevemente qué productos ofrecés..."
                            value={descripcionEmprendimiento}
                            onChange={(e) => setDescripcionEmprendimiento(e.target.value)}
                        />
                    </div>

                    {/* SECCIÓN 2: DATOS PRIVADOS DE FISCALIZACIÓN Y CUENTA */}
                    <h5 className="fw-bold fs-6 text-secondary mb-3 border-bottom pb-2 pt-2">
                        2. Datos Personales y de Cuenta (Privados) 
                    </h5>
                    <p className="form-text text-muted small mb-3">
                        🔒 Estos datos no serán visibles públicamente en el catálogo. Se utilizarán únicamente para autenticación y gestión interna del municipio.
                    </p>

                    <div className="mb-3 text-start">
                        <label htmlFor="nombreCompleto" className="form-label fw-semibold text-secondary small">
                            Nombre Completo del Titular
                        </label>
                        <input
                            id="nombreCompleto"
                            type="text"
                            className="form-control"
                            placeholder="Ej: Marcos Argañaraz"
                            value={nombreCompleto}
                            onChange={(e) => setNombreCompleto(e.target.value)}
                        />
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6 text-start">
                            <label htmlFor="email" className="form-label fw-semibold text-secondary small">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="correo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6 text-start">
                            <label htmlFor="telefono" className="form-label fw-semibold text-secondary small">
                                Teléfono de Contacto
                            </label>
                            <input
                                id="telefono"
                                type="tel"
                                className="form-control"
                                placeholder="Ej: 3541123456"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6 text-start">
                            <label htmlFor="clave" className="form-label fw-semibold text-secondary small">
                                Contraseña
                            </label>
                            <input
                                id="clave"
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6 text-start">
                            <label htmlFor="confirmarClave" className="form-label fw-semibold text-secondary small">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmarClave"
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={confirmarClave}
                                onChange={(e) => setConfirmarClave(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="btn w-100 py-2 fw-bold text-white mb-3"
                        style={{ backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                    >
                        {cargando ? "Registrando..." : "Registrarse como Emprendedor"}
                    </button>
                </form>

                <div className="text-center pt-2 border-top">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="btn btn-link text-decoration-none fw-semibold p-0"
                        style={{ color: '#0066FF' }}
                    >
                        ¿Ya tenés una cuenta? Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegistroEmprendedor;