import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer 
        style={{ backgroundColor: '#181E2E', fontFamily: 'Jost, Poppins, sans-serif' }} 
        className="text-white py-3 border-top border-secondary border-opacity-25 mt-auto"
        >
        <div className="container">
            <div className="row align-items-center gy-3">
            
            {/* Marca / Municipio */}
            <div className="col-12 col-md-4 text-center text-md-start">
                <h6 className="fw-bold mb-1" style={{ color: '#00A3B5' }}>
                Vidriera de Emprendedores
                </h6>
                <p className="small text-white-50 mb-0" style={{ fontSize: '0.8rem' }}>
                Impulsando el talento en Villa Carlos Paz.
                </p>
            </div>

            {/* Redes Sociales (Ubicadas en el centro) */}
            <div className="col-12 col-md-4 text-center">
                <span className="d-block text-white-50 small mb-1" style={{ fontSize: '0.75rem' }}>
                Seguinos en redes
                </span>
                <div className="d-flex justify-content-center gap-3 fs-5">
                <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-white-50 text-decoration-none hover-cyan"
                    aria-label="Facebook"
                >
                    <i className="bi bi-facebook"></i>
                </a>
                <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-white-50 text-decoration-none hover-cyan"
                    aria-label="Instagram"
                >
                    <i className="bi bi-instagram"></i>
                </a>
                <a 
                    href="https://wa.me/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-white-50 text-decoration-none hover-cyan"
                    aria-label="WhatsApp"
                >
                    <i className="bi bi-whatsapp"></i>
                </a>
                </div>
            </div>

            {/* Contacto (Desplazado a la derecha) */}
            <div className="col-12 col-md-4 text-center text-md-end">
                <p className="text-white-50 small mb-0" style={{ fontSize: '0.85rem' }}>
                📍 Municipalidad de Villa Carlos Paz
                </p>
                <p className="text-white-50 small mb-0" style={{ fontSize: '0.85rem' }}>
                ✉️ empleo@villacarlospaz.gov.ar
                </p>
            </div>

            </div>

            {/* Copyright Line */}
            <div className="text-center pt-2 mt-2 border-top border-secondary border-opacity-10 text-white-50" style={{ fontSize: '0.75rem' }}>
            © 2026 Municipalidad de Villa Carlos Paz — Secretaría de Empleo y Emprendedurismo
            </div>
        </div>

        <style>{`
            .hover-cyan:hover {
            color: #00A3B5 !important;
            transition: color 0.2s ease-in-out;
            }
        `}</style>
        </footer>
    );
    };

export default Footer;