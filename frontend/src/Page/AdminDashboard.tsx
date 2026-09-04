import React, { useState } from 'react';
import { 
        Users, 
    ShieldCheck, 
    Package, 
    LogOut, 
    Home, 
    Settings, 
    Bell, 
    Check, 
    X,
    Tags
    } from 'lucide-react';
    import { UsuariosView } from './emprendedoresview';

    export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'inicio' | 'emprendedores' | 'productos' | 'moderacion' | 'categorias' | 'ajustes' | 'usuarios'>('inicio');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    return (
        <div className="d-flex flex-column vh-100 bg-light">
        {/* Top Header */}
        <header className="navbar navbar-expand navbar-dark  px-3 shadow-sm" style={{backgroundColor:'#0f2b48'}}>
            <div className="d-flex align-items-center gap-2">
            <button className="btn btn-dark d-md-none p-1">
                <span className="navbar-toggler-icon"></span>
            </button>
            <span className="navbar-brand mb-0 h1 fw-bold fs-5">Administración</span>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3 text-white">
            <button className="btn btn-link text-white p-0 position-relative">
                <Bell size={20} />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>
            <div className="d-flex align-items-center gap-2">
                <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                <span className="fw-bold fs-7">M</span>
                </div>
                <span className="small fw-semibold d-none d-sm-inline">Marcos Admin</span>
            </div>
            </div>
        </header>

        <div className="d-flex flex-grow-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="bg-white border-end d-flex flex-column justify-content-between p-3" style={{ width: '240px' }}>
            <ul className="nav nav-pills flex-column gap-1">
                <li className="nav-item">
                <button 
                    className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'inicio' ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => setActiveTab('inicio')}
                >
                    <Home size={18} /> Inicio
                </button>
                </li>
                <li className="nav-item">
                <button 
                    className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'emprendedores' ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => setActiveTab('emprendedores')}
                >
                    <Users size={18} /> Emprendedores
                </button>
                </li>
                <li className="nav-item">
                <button 
                    className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'productos' ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => setActiveTab('productos')}
                >
                    <Package size={18} /> Productos
                </button>
                </li>
                <li className="nav-item">
                <button 
                    className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'moderacion' ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => setActiveTab('moderacion')}
                >
                    <ShieldCheck size={18} /> Moderación
                </button>
                </li>
                <li className="nav-item">
                <button 
                    className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'categorias' ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => setActiveTab('categorias')}
                >
                    <Tags size={18} /> Categorías
                </button>
                </li>
                <li className="nav-item">
                <button 
                    className={`nav-link w-100 d-flex align-items-center gap-2 text-start ${activeTab === 'ajustes' ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => setActiveTab('ajustes')}
                >
                    <Settings size={18} /> Ajustes
                </button>
                </li>
            </ul>

            <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100 border-0">
                <LogOut size={18} /> Cerrar sesión
            </button>
            </aside>

            {/* Dynamic Content */}
            <main className="flex-grow-1 p-4 overflow-auto">
            {activeTab === 'inicio' && (
                <div className="container-fluid p-0">
                {/* Banner */}
                <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
                    <h5 className="alert-heading fw-bold mb-1 fs-6">Bienvenido admin: Marcos</h5>
                    <p className="mb-0 small">Aquí podrás Administrar Emprendedores, Moderar Contenidos y Gestionar Productos.</p>
                </div>

                {/* Accesos Directos */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                        <div>
                            <Users className="text-primary mb-2" size={32} />
                            <h6 className="card-subtitle text-muted mb-1">Emprendedores</h6>
                            <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('emprendedores')}>Abrir</button>
                        </div>
                        <span className="display-6 fw-bold">10</span>
                        </div>
                    </div>
                    </div>

                    <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                        <div>
                            <ShieldCheck className="text-primary mb-2" size={32} />
                            <h6 className="card-subtitle text-muted mb-1">Moderar</h6>
                            <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('moderacion')}>Abrir</button>
                        </div>
                        <span className="display-6 fw-bold">5</span>
                        </div>
                    </div>
                    </div>

                    <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                        <div>
                            <Package className="text-primary mb-2" size={32} />
                            <h6 className="card-subtitle text-muted mb-1">Productos</h6>
                            <button className="btn btn-sm btn-primary mt-2 px-3" onClick={() => setActiveTab('productos')}>Abrir</button>
                        </div>
                        <span className="display-6 fw-bold">30</span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Métricas de Emprendedores */}
                <h6 className="fw-bold mb-3">Emprendedores totales: 150</h6>
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                        <span className="text-muted text-uppercase fw-semibold style-micro">ACTIVOS</span>
                        <h3 className="fw-bold my-1">25</h3>
                        </div>
                    </div>
                    </div>
                    <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                        <span className="text-muted text-uppercase fw-semibold style-micro">SUSPENDIDOS</span>
                        <h3 className="fw-bold my-1">5</h3>
                        </div>
                    </div>
                    </div>
                    <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                        <span className="text-muted text-uppercase fw-semibold style-micro">ADMINS</span>
                        <h3 className="fw-bold my-1">2</h3>
                        </div>
                    </div>
                    </div>
                    <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                        <span className="text-muted text-uppercase fw-semibold style-micro">RECHAZADOS</span>
                        <h3 className="fw-bold my-1">3</h3>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Moderación Reciente */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Moderación Reciente</h6>
                        <select className="form-select form-select-sm w-auto">
                        <option value="contenido">Contenido</option>
                        <option value="usuarios">Usuarios</option>
                        </select>
                    </div>

                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
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
                            <td>Santiago Rossi</td>
                            <td>Publicación de vidrio templado 10mm</td>
                            <td><span className="badge bg-warning text-dark">Pendiente</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-success me-1"><Check size={14} /> Aprobar</button>
                                <button className="btn btn-sm btn-danger"><X size={14} /> Rechazar</button>
                            </td>
                            </tr>
                            <tr>
                            <td>Laura Benítez</td>
                            <td>Comentario ofensivo reportado</td>
                            <td><span className="badge bg-success">Revisado</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-success me-1"><Check size={14} /> Aprobar</button>
                                <button className="btn btn-sm btn-danger"><X size={14} /> Rechazar</button>
                            </td>
                            </tr>
                            <tr>
                            <td>Carlos G.</td>
                            <td>Espejo biselado Premium x5</td>
                            <td><span className="badge bg-warning text-dark">Pendiente</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-success me-1"><Check size={14} /> Aprobar</button>
                                <button className="btn btn-sm btn-danger"><X size={14} /> Rechazar</button>
                            </td>
                            </tr>
                            <tr>
                            <td>Sofía Martínez</td>
                            <td>Imagen de perfil no autorizada</td>
                            <td><span className="badge bg-success">Revisado</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-success me-1"><Check size={14} /> Aprobar</button>
                                <button className="btn btn-sm btn-danger"><X size={14} /> Rechazar</button>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
            )}

            {activeTab === 'emprendedores' && <UsuariosView />}
            </main>
        </div>
        </div>
    );
};