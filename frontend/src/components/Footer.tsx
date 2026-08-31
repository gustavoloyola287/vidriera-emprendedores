import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-site">
      <div className="footer-grid">
        
        {/* Marca / Branding */}
        <div className="footer-brand">
          {/* <h2>EXPO<span>X</span></h2> */}
          {/**<div className="footer-subtitulo">CARRERAS</div> */}
          <div className="linea-bicolor">
            <div className="celeste"></div>
            <div className="amarillo"></div>
          </div>
          <p className="footer-text">
            Plataforma de la Vidriera de Emprendedores. Conectando talento local con oportunidades de desarrollo y empleo.
          </p>
        </div>

        {/* Navegación */}
        <div className="footer-col">
          {/**<h3>Navegación</h3> */}
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/emprendedores">Emprendedores</Link></li>
            <li><Link to="/categorias">Categorías</Link></li>
          </ul>
        </div>

        {/* Accesos */}
        <div className="footer-col">
          {/**<h3>Accesos</h3> */}
          <ul>
            <li><Link to="/login">Ingresar</Link></li>
            <li><Link to="/registro">Registrarse</Link></li>
          </ul>
        </div>

        {/* Institucional */}
        <div className="footer-col">
         {/**<h3>Institucional</h3> */}
          <p className="footer-text">Universidad Provincial de Córdoba (UPC) - ISAUI Sede Regional Villa Carlos Paz</p>
        </div>

      </div>

      {/* Pie inferior */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Vidriera de Emprendedores. Todos los derechos reservados.</p>
        <span className="badge-expo">Empleo & Emprendedurismo</span>
      </div>
    </footer>
  );
};

export default Footer;