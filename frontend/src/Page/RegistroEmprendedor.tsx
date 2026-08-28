import { useState } from "react";

function RegistroEmprendedor() {
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [nombreEmprendimiento, setNombreEmprendimiento] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [clave, setClave] = useState("");
    const [confirmarClave, setConfirmarClave] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    function validarDatos(): boolean {
        if (nombreCompleto.trim() === "") {
            setError("Ingrese su nombre completo");
            return false;
        }

        if (nombreEmprendimiento.trim() === "") {
            setError("Ingrese el nombre de su emprendimiento");
            return false;
        }

        if (email.trim() === "") {
            setError("Ingrese su email");
            return false;
        }

        if (telefono.trim() === "") {
            setError("Ingrese su teléfono");
            return false;
        }

        if (clave.trim() === "") {
            setError("Ingrese una contraseña");
            return false;
        }

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
                    />
                </div>

                {/* Mensaje de Error (Rojo) */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Mensaje de Éxito (Verde) */}
                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
}

export default RegistroEmprendedor;

