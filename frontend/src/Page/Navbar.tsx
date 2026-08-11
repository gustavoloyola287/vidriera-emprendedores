import { Link } from "react-router-dom";

function Navbar() {
    const usuarioAutenticado = false;

    return (
        <nav>
            <h2>Vidriera Virtual VCP</h2>

            <div>
                <Link to="/">Inicio</Link>

                {!usuarioAutenticado && (
                    <>
                        <Link to="/login">Iniciar sesión</Link>
                        <Link to="/registro">Registrarse</Link>
                    </>
                )}

                {usuarioAutenticado && (
                    <>
                        <Link to="/perfil">Mi perfil</Link>
                        <button type="button">
                            Cerrar sesión
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

