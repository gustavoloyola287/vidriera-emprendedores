import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [clave, setClave] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    function validarDatos(): boolean {
        if (email.trim() === "") {
            setError("Ingrese su email");
            return false;
        }

        if (clave.trim() === "") {
            setError("Ingrese su contraseña");
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

        // Acá después conectamos con el backend y JWT
    }

    return (
        <div>
            <h1>Iniciar sesión</h1>

            <form onSubmit={manejarSubmit}>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={clave}
                        onChange={(event) => setClave(event.target.value)}
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Ingresando..." : "Iniciar sesión"}
                </button>

            </form>
        </div>
    );
}

export default Login;