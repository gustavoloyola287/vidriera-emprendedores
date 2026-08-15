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

        // Acá después conectamos con el backend
        // mediante POST /auth/register

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

    // 1. Detección de Error HTTP (Ej: 400 Bad Request)
    if (!respuesta.ok) {
        const mensajeError = await respuesta.text(); 
        // Lanzamos el error para que salte al catch
        throw new Error(mensajeError || "El email ya está registrado o los datos son inválidos.");
    }

    // Si llega acá, es un status 200/201 OK
    setMensaje("¡Registro exitoso! Ya podés iniciar sesión.");

} catch (err: any) {
    // 2. Detección de Error de Red o Excepción
    // Si err proviene de red, dirá "Failed to fetch"
    if (err.message === "Failed to fetch") {
        setError("No se pudo conectar con el servidor. Revisá tu conexión o si el backend está corriendo.");
    } else {
        // Muestra el mensaje del backend (Ej: 400 Bad Request)
        setError(err.message);
    }
} finally {
    setCargando(false);
}
        setMensaje("Datos válidos. Listo para registrar.");
        setCargando(false);
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
                        onChange={(event) =>
                            setNombreCompleto(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="nombreEmprendimiento">Nombre del emprendimiento</label>
                    <input
                        id="nombreEmprendimiento"
                        name="nombreEmprendimiento"
                        type="text"
                        value={nombreEmprendimiento}
                        onChange={(event) =>
                            setNombreEmprendimiento(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={telefono}
                        onChange={(event) =>
                            setTelefono(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="clave">Contraseña</label>
                    <input
                        id="clave"
                        name="password"
                        type="password"
                        value={clave}
                        onChange={(event) =>
                            setClave(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="confirmarClave">Confirmar contraseña</label>
                    <input
                        id="confirmarClave"
                        name="confirmarClave"
                        type="password"
                        value={confirmarClave}
                        onChange={(event) =>
                            setConfirmarClave(event.target.value)
                        }
                    />
                </div>

                {error && <p>{error}</p>}

                {mensaje && <p>{mensaje}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Registrando..." : "Registrarse"}
                </button>

            </form>
        </div>
    );
}

export default RegistroEmprendedor;

