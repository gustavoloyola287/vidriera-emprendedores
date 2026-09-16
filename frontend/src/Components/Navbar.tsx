import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky-top shadow-sm w-100">
      {/* Navbar Principal Azul Oscuro */}
      <nav 
        className="navbar navbar-expand-lg navbar-dark" 
        data-bs-theme="dark"
        style={{ backgroundColor: '#112940' }}
      >
        <div className="container">
          
          {/* Logo Identidad Carlospacense + Nombre */}
          <Link to="/" className="navbar-brand fw-bold fs-4 d-flex align-items-center text-white text-decoration-none gap-2">
            {/*<img 
              src="/logo-identidad-carlospacense.png" 
              alt="Identidad Carlospacense" 
              height="38" 
              className="d-inline-block align-text-top"
              onError={(e) => {
                // Fallback por si la imagen aún no está en la carpeta public
                (e.target as HTMLElement).style.display = 'none';
              }}
            />*/}
            <span className="fs-6 text-white-50 ms-1 d-none d-sm-inline fw-normal">
              Vidriera Virtual
            </span>
          </Link>

          {/* Botón Hamburguesa para Mobile */}
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

          {/* Contenido del Menú Desplegable */}
          <div className="collapse navbar-collapse" id="navbarVCP">
            {/* Navegación Principal */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-2">
              <li className="nav-item">
                <Link to="/" className="nav-link text-white fw-semibold position-relative nav-link-custom">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/emprendedores" className="nav-link text-white fw-semibold position-relative nav-link-custom">
                  Emprendedores
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/categorias" className="nav-link text-white fw-semibold position-relative nav-link-custom">
                  Categorías
                </Link>
              </li>
            </ul>

            {/* Botones Estáticos de Acceso */}
            <div className="d-flex align-items-lg-center flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
              <Link
                to="/login"
                className="btn btn-sm text-white px-3 w-100 w-lg-auto"
                style={{ backgroundColor: '#252D42', border: '1px solid #3B4764' }}
              >
                Ingresar
              </Link>
              {/*<Link
                to="/registro"
                className="btn btn-sm text-white px-3 w-100 w-lg-auto"
                style={{ backgroundColor: '#00A3B5' }}
              >
                Registrarse
              </Link>*/}
            </div>
          </div>

        </div>
      </nav>

      {/* Franja Tricolor (Celeste, Blanco, Amarillo) con el Sol en el centro */}
      <div className="position-relative w-100 overflow-visible" style={{ height: '10px' }}>
        <div className="row g-0 h-100">
          <div className="col-4" style={{ backgroundColor: '#55cbe7' }}></div>
          <div className="col-4 bg-white"></div>
          <div className="col-4" style={{ backgroundColor: '#f7e167' }}></div>
        </div>

                {/* Horizonte con el Sol asomando */}
        <div className="position-relative w-100" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>

          <div 
            className="position-absolute"
            style={{
              
              transform: 'rotate(180deg)',
              top: '-20px', /* Posiciona el medio círculo sobre el borde inferior */
              width: '44px',
              height: '22px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            {/* Arco exterior Amarillo */}
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f7e167', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {/* Arco intermedio Negro */}
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Centro Rojo */}
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#d9383a' }}></div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </header>
  );
};

export default Navbar;