import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user?: {
    nombre?: string;
    email?: string;
    rol?: string;
  } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    // Agregamos navbar-dark y data-bs-theme="dark" para que el botón hamburguesa se vuelva blanco
    <nav 
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" 
      data-bs-theme="dark"
      style={{ backgroundColor: '#181E2E' }}
    >
      <div className="container">
        
        {/* Logo estilo VCP | gob */}
        <Link to="/" className="navbar-brand fw-bold fs-4 d-flex align-items-center text-white text-decoration-none">
          vcp<span style={{ color: '#00A3B5', fontWeight: '300' }}>|</span>gob
          {/* Cambiamos a text-white-50 para que resalte claramente en el fondo oscuro */}
          <span className="fs-6 text-white-50 ms-2 d-none d-sm-inline fw-normal">
            Vidriera Virtual
          </span>
        </Link>

        {/* Botón Hamburguesa ajustado para fondo oscuro */}
        <button
          className="navbar-toggler border-0 focus-ring-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarVCP"
          aria-controls="navbarVCP"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del Menú */}
        <div className="collapse navbar-collapse" id="navbarVCP">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white active">
                Inicio
              </Link>
            </li>
          </ul>

          {/* Estado de Autenticación */}
          <div className="d-flex align-items-lg-center flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
            {user ? (
              <>
                <span className="badge rounded-pill text-white bg-secondary bg-opacity-20 px-3 py-2 border border-secondary align-self-start align-self-lg-center">
                  {user.nombre || user.email}
                </span>

                {user.rol === 'ADMIN' && (
                  <Link to="/admin" className="btn btn-outline-light btn-sm w-100 w-lg-auto">
                    Panel Admin
                  </Link>
                )}

                <Link to="/mis-productos" className="btn btn-outline-light btn-sm w-100 w-lg-auto">
                  Mis Productos
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm w-100 w-lg-auto"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-sm text-white px-3 w-100 w-lg-auto"
                  style={{ backgroundColor: '#252D42', border: '1px solid #3B4764' }}
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="btn btn-sm text-white px-3 w-100 w-lg-auto"
                  style={{ backgroundColor: '#00A3B5' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;