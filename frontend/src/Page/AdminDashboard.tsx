import React, { useState } from 'react';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inicio' | 'usuarios' | 'moderacion'>('inicio');

    return (
        <div className="d-flex min-vh-100 bg-light">
        {/* 1. SIDEBAR LATERAL */}
        <aside className="bg-white border-end d-flex flex-column" style={{ width: '260px' }}>
            <div className="p-4 border-bottom">
            <h1 className="h5 fw-bold mb-0 text-primary d-flex align-items-center gap-2">
                <i className="bi bi-shop"></i> Vidriera Virtual VCP
            </h1>
            <span className="badge bg-primary-subtle text-primary mt-1">Panel Administrador</span>
            </div>

            <nav className="p-3 flex-grow-1">
            <ul className="nav nav-pills flex-column gap-2">
                <li className="nav-item">
                <button
                    onClick={() => setActiveTab('inicio')}
                    className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${activeTab === 'inicio' ? 'active bg-primary' : 'text-dark'}`}
                >
                    <i className="bi bi-house-door"></i> Inicio
                </button>
                </li>
                <li className="nav-item">
                <button
                    onClick={() => setActiveTab('usuarios')}
                    className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${activeTab === 'usuarios' ? 'active bg-primary' : 'text-dark'}`}
                >
                    <i className="bi bi-people"></i> Usuarios
                </button>
                </li>
                <li className="nav-item">
                <button
                    onClick={() => setActiveTab('moderacion')}
                    className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${activeTab === 'moderacion' ? 'active bg-primary' : 'text-dark'}`}
                >
                    <i className="bi bi-shield-exclamation"></i> Moderación
                    <span className="badge bg-danger rounded-pill ms-auto">5</span>
                </button>
                </li>
                <li className="nav-item">
                <button className="nav-link w-100 text-start d-flex align-items-center gap-2 text-dark">
                    <i className="bi bi-box-seam"></i> Productos
                </button>
                </li>
                <li className="nav-item">
                <button className="nav-link w-100 text-start d-flex align-items-center gap-2 text-dark">
                    <i className="bi bi-tags"></i> Categorías
                </button>
                </li>
            </ul>
            </nav>

            <div className="p-3 border-top">
            <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>
            </div>
        </aside>

        {/* 2. CONTENIDO PRINCIPAL */}
        <main className="flex-grow-1 p-4 overflow-auto">
            {/* ENCABEZADO SUPERIOR */}
            <header className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 className="h4 fw-bold text-dark mb-1">Bienvenido, Marcos</h2>
                <p className="text-muted small mb-0">Gestión global de usuarios, productos y solicitudes del sistema municipal.</p>
            </div>
            <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">Última sesión: 12/05/2026</span>
                <div className="position-relative">
                <i className="bi bi-bell fs-5 text-secondary"></i>
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                </div>
            </div>
            </header>

            {/* TARJETAS MÉTRICAS DE USUARIOS (150 TOTALES) */}
            <section className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-success">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <span className="text-muted small fw-semibold">Activos</span>
                    <h3 className="fw-bold mb-0 text-success">25</h3>
                    </div>
                    <div className="bg-success-subtle text-success p-3 rounded-circle">
                    <i className="bi bi-person-check fs-4"></i>
                    </div>
                </div>
                </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-warning">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <span className="text-muted small fw-semibold">Suspendidos</span>
                    <h3 className="fw-bold mb-0 text-warning">5</h3>
                    </div>
                    <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                    <i className="bi bi-person-clock fs-4"></i>
                    </div>
                </div>
                </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-primary">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <span className="text-muted small fw-semibold">Administradores</span>
                    <h3 className="fw-bold mb-0 text-primary">2</h3>
                    </div>
                    <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                    <i className="bi bi-key fs-4"></i>
                    </div>
                </div>
                </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-danger">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    <span className="text-muted small fw-semibold">Rechazados</span>
                    <h3 className="fw-bold mb-0 text-danger">3</h3>
                    </div>
                    <div className="bg-danger-subtle text-danger p-3 rounded-circle">
                    <i className="bi bi-person-x fs-4"></i>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* VISTA SEGÚN LA SECCIÓN SELECCIONADA */}
            {activeTab === 'inicio' && (
            <div className="row g-4">
                {/* ACCESOS DIRECTOS */}
                <div className="col-12 col-lg-5">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                    <h5 className="fw-bold mb-3">Accesos Directos</h5>
                    <div className="row g-3">
                    <div className="col-4">
                        <button 
                        onClick={() => setActiveTab('usuarios')}
                        className="btn btn-outline-primary w-100 p-3 rounded-4 d-flex flex-column align-items-center gap-2"
                        >
                        <i className="bi bi-people fs-3"></i>
                        <span className="small fw-semibold">Usuarios</span>
                        </button>
                    </div>
                    <div className="col-4">
                        <button 
                        onClick={() => setActiveTab('moderacion')}
                        className="btn btn-outline-primary w-100 p-3 rounded-4 d-flex flex-column align-items-center gap-2"
                        >
                        <i className="bi bi-shield-exclamation fs-3"></i>
                        <span className="small fw-semibold">Moderación</span>
                        </button>
                    </div>
                    <div className="col-4">
                        <button className="btn btn-outline-primary w-100 p-3 rounded-4 d-flex flex-column align-items-center gap-2">
                        <i className="bi bi-box-seam fs-3"></i>
                        <span className="small fw-semibold">Productos</span>
                        </button>
                    </div>
                    </div>
                </div>
                </div>

                {/* MODERACIÓN RÁPIDA */}
                <div className="col-12 col-lg-7">
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Moderación de Contenidos</h5>
                    <select className="form-select form-select-sm w-auto">
                        <option>Todo</option>
                        <option>Spam</option>
                        <option>Pendiente</option>
                    </select>
                    </div>
                    <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Usuario</th>
                            <th>Contenido</th>
                            <th>Estado</th>
                            <th className="text-end">Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="fw-semibold">María G.</td>
                            <td><span className="badge bg-warning text-dark">Spam detectado</span></td>
                            <td><span className="badge bg-info-subtle text-info border">Revisado</span></td>
                            <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-eye"></i></button>
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-x-circle"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-semibold">Juan P.</td>
                            <td><span className="badge bg-secondary">Foto inapropiada</span></td>
                            <td><span className="badge bg-warning-subtle text-warning border">Pendiente</span></td>
                            <td className="text-end">
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-eye"></i></button>
                            <button className="btn btn-sm btn-outline-success"><i className="bi bi-check-circle"></i></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* TABLA DE USUARIOS (PANEL USUARIOS) */}
            {activeTab === 'usuarios' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <h5 className="fw-bold mb-0">Panel de Usuarios</h5>
                
                {/* FILTROS Y BÚSQUEDA */}
                <div className="d-flex flex-wrap gap-2">
                    <select className="form-select form-select-sm w-auto">
                    <option value="">Filtrar Rol</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="EMPRENDEDOR">Emprendedor</option>
                    </select>

                    <div className="input-group input-group-sm" style={{ width: '220px' }}>
                    <input type="text" className="form-control" placeholder="Buscar usuario..." />
                    <button className="btn btn-primary"><i className="bi bi-search"></i></button>
                    </div>

                    <select className="form-select form-select-sm w-auto">
                    <option value="">Estado</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="SUSPENDIDO">Suspendido</option>
                    </select>

                    <button className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                    <i className="bi bi-person-plus"></i> Agregar
                    </button>
                </div>
                </div>

                {/* TABLA PRINCIPAL DE USUARIOS CON DATOS SENSIBLES SOLAMENTE PARA EL ADMIN */}
                <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre Completo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="fw-bold text-primary">Marcosze.10</td>
                        <td>Marcos Argañaraz</td>
                        <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle">Administrador</span></td>
                        <td><span className="badge bg-success-subtle text-success border border-success-subtle">Activo</span></td>
                        <td className="text-end">
                        <button className="btn btn-sm btn-light text-primary me-1" title="Ver detalle sensible (DNI, Tel, Email)">
                            <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-warning me-1" title="Editar">
                            <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-danger" title="Dar de baja / Sancionar">
                            <i className="bi bi-trash"></i>
                        </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="fw-bold text-primary">Daniela.cakes</td>
                        <td>Daniela González</td>
                        <td><span className="badge bg-secondary-subtle text-dark border">Emprendedora</span></td>
                        <td><span className="badge bg-success-subtle text-success border border-success-subtle">Activo</span></td>
                        <td className="text-end">
                        <button className="btn btn-sm btn-light text-primary me-1" title="Ver detalle sensible">
                            <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-warning me-1" title="Editar">
                            <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-danger" title="Dar de baja / Sancionar">
                            <i className="bi bi-trash"></i>
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>

                {/* PAGINACIÓN */}
                <nav className="d-flex justify-content-between align-items-center mt-3">
                <span className="small text-muted">Mostrando 1 a 2 de 150 usuarios</span>
                <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled"><a className="page-link" href="#">Anterior</a></li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item"><a className="page-link" href="#">Siguiente</a></li>
                </ul>
                </nav>
            </div>
            )}
        </main>
        </div>
    );
};

export default AdminDashboard;