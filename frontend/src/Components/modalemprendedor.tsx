import React, { useState } from 'react';
import { Info, Loader2, Eye, EyeOff } from 'lucide-react';

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: 'ADMIN' | 'EMPRENDEDOR' | 'MODERADOR';
    estado: 'ACTIVO' | 'SUSPENDIDO' | 'RECHAZADO' | 'PENDIENTE';
    descripcion?: string;
}

interface ModalNuevoEmprendedorProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ModalNuevoEmprendedor: React.FC<ModalNuevoEmprendedorProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [nombreEmprendimiento, setNombreEmprendimiento] = useState('');
    const [rol, setRol] = useState<'ADMIN' | 'EMPRENDEDOR' | 'MODERADOR'>('EMPRENDEDOR');
    const [estado, setEstado] = useState<'ACTIVO' | 'SUSPENDIDO' | 'RECHAZADO' | 'PENDIENTE'>('ACTIVO');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const datosEmprendedor = {
                nombreCompleto: nombre,
                nombreEmprendimiento: nombreEmprendimiento,
                email: email,
                telefono: telefono,
                password: password,
                descripcion: descripcion,
                estado: estado,
                rol: rol === 'EMPRENDEDOR' ? 'ROLE_EMPRENDEDOR' : 
                    rol === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_MODERADOR'
            };

            const response = await fetch('http://localhost:8080/api/admin/emprendedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(datosEmprendedor)
            });

            if (!response.ok) {
                let mensajeError = 'Error al crear el emprendedor';
                try {
                    const errorData = await response.json();
                    mensajeError = errorData.message || errorData.error || mensajeError;
                } catch {
                    mensajeError = `Error HTTP: ${response.status} - ${response.statusText}`;
                }
                throw new Error(mensajeError);
            }

            const data = await response.json();
            console.log('✅ Emprendedor creado exitosamente:', data);

            handleReset();
            onSuccess();
            onClose();

        } catch (err: any) {
            console.error('❌ Error detallado al crear emprendedor (Dev Log):', err);
            setError(err.message || 'Error de conexión con el servidor. Por favor, intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setNombre('');
        setEmail('');
        setTelefono('');
        setPassword('');
        setNombreEmprendimiento('');
        setRol('EMPRENDEDOR');
        setEstado('ACTIVO');
        setDescripcion('');
        setImagen(null);
        setError(null);
    };

    return (
        <div
            className="modal fade show d-flex align-items-center justify-content-center"
            tabIndex={-1}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1050,
            }}
        >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '520px', width: '92%' }}>
                <div className="modal-content border-0 shadow-lg rounded-3 p-2">
                    {/* Cabecera */}
                    <div className="modal-header border-0 pb-1 pt-2 px-3">
                        <h5 className="modal-title fw-bold">Nuevo Emprendedor</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        {/* 🔽 Aquí se agregó el scroll interno con max-height y overflow-y */}
                        <div 
                            className="modal-body py-2 px-3" 
                            style={{ maxHeight: '70vh', overflowY: 'auto' }}
                        >
                            {error && (
                                <div className="alert alert-danger py-2 small mb-2" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Nombre Completo */}
                            <div className="mb-2">
                                <label className="form-label text-muted fw-semibold style-small mb-1">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Ej. María González"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email y Teléfono */}
                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <label className="form-label text-muted fw-semibold style-small mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label text-muted fw-semibold style-small mb-1">
                                        Teléfono de Contacto
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-sm"
                                        placeholder="+54 9 11 1234-5678"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contraseña con Ojo */}
                            <div className="mb-2">
                                <label className="form-label text-muted fw-semibold style-small mb-1">
                                    Contraseña <span className="text-danger">*</span>
                                </label>
                                <div className="input-group input-group-sm">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm px-2"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Nombre del Emprendimiento */}
                            <div className="mb-2">
                                <label className="form-label text-muted fw-semibold style-small mb-1">
                                    Nombre del Emprendimiento <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Ej. Delicias del Valle"
                                    value={nombreEmprendimiento}
                                    onChange={(e) => setNombreEmprendimiento(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Rol y Estado */}
                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <label className="form-label text-muted fw-semibold style-small mb-1">
                                        Rol
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value as Usuario['rol'])}
                                    >
                                        <option value="EMPRENDEDOR">Emprendedor</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MODERADOR">Moderador</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label text-muted fw-semibold style-small mb-1">
                                        Estado Inicial
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value as Usuario['estado'])}
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="SUSPENDIDO">Suspendido</option>
                                        <option value="RECHAZADO">Rechazado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Descripción del Emprendimiento */}
                            <div className="mb-2">
                                <div className="d-flex justify-content-between mb-1">
                                    <label className="form-label text-muted fw-semibold style-small mb-0">
                                        Descripción del Emprendimiento <span className="text-danger">*</span>
                                    </label>
                                    <span className="text-muted style-micro">{descripcion.length}/250</span>
                                </div>
                                <textarea
                                    className="form-control form-control-sm"
                                    rows={2}
                                    maxLength={250}
                                    placeholder="Contanos qué hacés, tus productos estrella, tu historia..."
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            {/* Logo / Imagen */}
                            <div className="mb-2">
                                <label className="form-label text-muted fw-semibold style-small mb-1">
                                    Imagen / Logo del Emprendimiento
                                </label>
                                <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>

                            {/* Requisitos de la imagen */}
                            <div className="alert alert-info border-0 bg-light p-2 mb-1 rounded-2 style-small text-muted">
                                <div className="d-flex gap-2 align-items-start">
                                    <Info size={16} className="text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-dark">Requisitos de la imagen:</strong>
                                        <ul className="mb-0 ps-3 mt-1 style-micro">
                                            <li>JPG, PNG o WEBP.</li>
                                            <li>Relación <strong>1:1</strong> (ej. 500x500 px).</li>
                                            <li>Máximo <strong>2 MB</strong>.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="modal-footer border-0 pt-1 pb-2 d-flex justify-content-center gap-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary px-3"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-sm btn-success px-3 d-flex align-items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="spinner-border spinner-border-sm" />
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Usuario'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevoEmprendedor;