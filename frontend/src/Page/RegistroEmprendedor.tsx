import { useState } from "react";

function RegistroEmprendedor() {
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [nombreEmprendimiento, setNombreEmprendimiento] = useState("");
    const [descripcionEmprendimiento, setDescripcionEmprendimiento] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [clave, setClave] = useState("");
    const [confirmarClave, setConfirmarClave] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    function validarDatos(): boolean {
        // 1. Nombre completo
        if (nombreCompleto.trim() === "") {
            setError("Ingrese su nombre completo");
            return false;
        }

        // 2. Nombre del emprendimiento
        if (nombreEmprendimiento.trim() === "") {
            setError("Ingrese el nombre de su emprendimiento");
            return false;
        }

        // 3. Descripción del emprendimiento
        if (descripcionEmprendimiento.trim() === "") {
            setError("Ingrese una breve descripción de su emprendimiento");
            return false;
        }
        if (descripcionEmprendimiento.trim().length < 10) {
            setError("La descripción debe tener al menos 10 caracteres");
            return false;
        }

        // 4. Email (Existencia y Formato Regex)
        if (email.trim() === "") {
            setError("Ingrese su email");
            return false;
        }
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email.trim())) {
            setError("Ingrese un formato de email válido (ej: usuario@dominio.com)");
            return false;
        }

        // 5. Teléfono (Solo números y longitud mínima)
        if (telefono.trim() === "") {
            setError("Ingrese su teléfono");
            return false;
        }
        const regexTelefono = /^[0-9\s+-]{6,15}$/;
        if (!regexTelefono.test(telefono.trim())) {
            setError("Ingrese un número de teléfono válido (solo números, entre 6 y 15 dígitos)");
            return false;
        }

        // 6. Contraseña (Existencia y Longitud)
        if (clave.trim() === "") {
            setError("Ingrese una contraseña");
            return false;
        }
        if (clave.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }

        // 7. Confirmación de Contraseña
        if (clave !== confirmarClave) {
            setError("Las contraseñas no coinciden");
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
        setError("");

        try {
            const respuesta = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreCompleto,
                    nombreEmprendimiento,
                    email,
                    telefono,
                    password: clave
                })
            });
        try {
            const respuesta = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreCompleto,
                    nombreEmprendimiento,
                    descripcionEmprendimiento, // 👈 Nuevo campo enviado al backend
                    email,
                    telefono,
                    password: clave
                })
            });

            if (!respuesta.ok) {
                const mensajeError = await respuesta.text(); 
                throw new Error(mensajeError || "El email ya está registrado o los datos son inválidos.");
            }
            if (!respuesta.ok) {
                const mensajeError = await respuesta.text(); 
                throw new Error(mensajeError || "El email ya está registrado o los datos son inválidos.");
            }

            setMensaje("¡Registro exitoso! Ya podés iniciar sesión.");
            
            // Limpiar formulario al registrar con éxito
            setNombreCompleto("");
            setNombreEmprendimiento("");
            setEmail("");
            setTelefono("");
            setClave("");
            setConfirmarClave("");
            setMensaje("¡Registro exitoso! Ya podés iniciar sesión.");
            
            // Limpieza opcional del formulario tras registro exitoso
            setNombreCompleto("");
            setNombreEmprendimiento("");
            setDescripcionEmprendimiento("");
            setEmail("");
            setTelefono("");
            setClave("");
            setConfirmarClave("");

        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("No se pudo conectar con el servidor. Revisá tu conexión o si el backend está corriendo.");
            } else {
                setError(err.message);
            }
        } finally {
            setCargando(false);
        }
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
        <div>
            <h1>Registrar emprendedor</h1>

            <form onSubmit={manejarSubmit}>
                <div>
                    <label htmlFor="nombreCompleto">Nombre completo</label>
                    <input
                        id="nombreCompleto"
                        name="nombreCompleto"
                        type="text"
                        value={nombreCompleto}
                        onChange={(event) => setNombreCompleto(event.target.value)}
                        onChange={(event) => setNombreCompleto(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="nombreEmprendimiento">Nombre del emprendimiento</label>
                    <input
                        id="nombreEmprendimiento"
                        name="nombreEmprendimiento"
                        type="text"
                        value={nombreEmprendimiento}
                        onChange={(event) => setNombreEmprendimiento(event.target.value)}
                        onChange={(event) => setNombreEmprendimiento(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="descripcionEmprendimiento">Descripción del emprendimiento</label>
                    <textarea
                        id="descripcionEmprendimiento"
                        name="descripcionEmprendimiento"
                        rows={3}
                        value={descripcionEmprendimiento}
                        onChange={(event) => setDescripcionEmprendimiento(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={telefono}
                        onChange={(event) => setTelefono(event.target.value)}
                        onChange={(event) => setTelefono(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="clave">Contraseña</label>
                    <input
                        id="clave"
                        name="password"
                        type="password"
                        value={clave}
                        onChange={(event) => setClave(event.target.value)}
                        onChange={(event) => setClave(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="confirmarClave">Confirmar contraseña</label>
                    <input
                        id="confirmarClave"
                        name="confirmarClave"
                        type="password"
                        value={confirmarClave}
                        onChange={(event) => setConfirmarClave(event.target.value)}
                        onChange={(event) => setConfirmarClave(event.target.value)}
                    />
                </div>

                {/* Mensaje de Error (Rojo) */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Mensaje de Éxito (Verde) */}
                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
}

export default RegistroEmprendedor;