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

    function manejarSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validarDatos()) {
            return;
        }

        setCargando(true);
        setMensaje("");

        // Acá después conectamos con el backend
        // mediante POST /auth/register

        console.log({
            nombreCompleto,
            nombreEmprendimiento,
            email,
            telefono,
            clave
        });

        setMensaje("Datos válidos. Listo para registrar.");
        setCargando(false);
    }

    return (
        <div>
            <h1>Registrar emprendedor</h1>

            <form onSubmit={manejarSubmit}>

                <div>
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        value={nombreCompleto}
                        onChange={(event) =>
                            setNombreCompleto(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Nombre del emprendimiento</label>
                    <input
                        type="text"
                        value={nombreEmprendimiento}
                        onChange={(event) =>
                            setNombreEmprendimiento(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        value={telefono}
                        onChange={(event) =>
                            setTelefono(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={clave}
                        onChange={(event) =>
                            setClave(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Confirmar contraseña</label>
                    <input
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

