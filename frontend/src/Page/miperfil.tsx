import React, { useState } from 'react';
import { Loader2, Send, CheckCircle2, AlertTriangle, XCircle, Camera } from 'lucide-react';

export interface EmprendedorPerfil {
    id: number;
    fotoperfil: File | null;
    nombreCompleto: string;
    descripcion: string;
    nombreEmprendimiento: string;
    email: string;
    telefono: string;
}

export const MiPerfil: React.FC = () => {
    // Estado inicial del perfil (Simulando datos actuales del emprendedor)
    const [formData, setFormData] = useState<EmprendedorPerfil>({
        id: 1,
        fotoperfil: null,
        nombreCompleto: "María González",
        descripcion: "Elaboración artesanal de budines, tortas y panificados regionales sin TАС.",
        nombreEmprendimiento: "Delicias del Valle",
        email: "deliciasdelvalle@correo.com",
        telefono: "3541123456"
    });

    const [previewImagen, setPreviewImagen] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(false);

    // Estado para el sistema de Toasts multiestado
    const [toastInfo, setToastInfo] = useState<{
        visible: boolean;
        mensaje: string;
        tipo: 'success' | 'warning' | 'danger';
    }>({
        visible: false,
        mensaje: '',
        tipo: 'success'
    });

    const mostrarToast = (mensaje: string, tipo: 'success' | 'warning' | 'danger' = 'success') => {
        setToastInfo({ visible: true, mensaje, tipo });
        setTimeout(() => {
            setToastInfo(prev => ({ ...prev, visible: false }));
        }, 4000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const archivo = e.target.files[0];
            setFormData(prev => ({ ...prev, fotoperfil: archivo }));
            setPreviewImagen(URL.createObjectURL(archivo));
        }
    };

    // Validaciones y Envío para Moderación
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.nombreEmprendimiento.trim() || !formData.nombreCompleto.trim()) {
            mostrarToast("Los campos de nombres son obligatorios.", "warning");
            return;
        }

        if (formData.descripcion.trim().length < 10) {
            mostrarToast("La descripción del emprendimiento debe tener al menos 10 caracteres.", "warning");
            return;
        }

        setCargando(true);

        try {
            // Aquí iría el fetch a Spring Boot enviando los datos (o FormData si incluye imagen)
            // const response = await fetch('http://localhost:8080/api/emprendedor/perfil/actualizar', {
            //     method: 'PUT',
            //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            //     body: JSON.stringify(formData)
            // });
            // if (!response.ok) throw new Error("Error al enviar los cambios");

            await new Promise((resolve) => setTimeout(resolve, 800)); // Simula delay de red

            // Toast verde de éxito indicando que pasó a moderación
            mostrarToast("¡Cambios enviados! Quedaron pendientes de aprobación por el municipio.", "success");

        } catch (err: any) {
            console.error("Error al actualizar perfil:", err);
            mostrarToast(err.message || "No se pudo conectar con el servidor para actualizar el perfil.", "danger");
        } finally {
            setCargando(false);
        }
    };

    const obtenerClaseToastBg = (tipo: 'success' | 'warning' | 'danger') => {
        switch (tipo) {
            case 'success': return 'bg-success text-white';
            case 'warning': return 'bg-warning text-dark';
            case 'danger': return 'bg-danger text-white';
            default: return 'bg-success text-white';
        }
    };

    const renderIconoToast = (tipo: 'success' | 'warning' | 'danger') => {
        switch (tipo) {
            case 'success': return <CheckCircle2 size={18} />;
            case 'warning': return <AlertTriangle size={18} />;
            case 'danger': return <XCircle size={18} />;
            default: return <CheckCircle2 size={18} />;
        }
    };

    return (
        <div className="container py-4 position-relative">
            {/* ✅ TOAST EMERGENTE FLOTANTE */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
                <div 
                    className={`toast align-items-center border-0 shadow-lg rounded-3 ${obtenerClaseToastBg(toastInfo.tipo)} ${toastInfo.visible ? 'show' : 'hide'}`} 
                    role="alert" 
                    aria-live="assertive" 
                    aria-atomic="true"
                >
                    <div className="d-flex">
                        <div className="toast-body d-flex align-items-center gap-2">
                            {renderIconoToast(toastInfo.tipo)}
                            <span className="fw-semibold">{toastInfo.mensaje}</span>
                        </div>
                        <button 
                            type="button" 
                            className={`btn-close me-2 m-auto ${toastInfo.tipo === 'warning' ? '' : 'btn-close-white'}`} 
                            onClick={() => setToastInfo(prev => ({ ...prev, visible: false }))}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            </div>

            <h2 className="fw-bold mb-1 text-dark">Mi Perfil Público</h2>
            <p className="text-muted small mb-4">
                Modificá la información de tu emprendimiento. Tené en cuenta que cualquier cambio pasará por una breve revisión de moderación antes de actualizarse en la feria.
            </p>

            <div className="card border-0 shadow-sm p-4 rounded-4">
                <form onSubmit={handleSubmit}>
                    {/* Foto de Perfil / Logo */}
                    <div className="mb-4 text-center text-md-start d-flex flex-column flex-md-row align-items-center gap-4">
                        <div className="position-relative">
                            <div 
                                className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden shadow-sm"
                                style={{ width: '90px', height: '90px' }}
                            >
                                {previewImagen ? (
                                    <img src={previewImagen} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <Camera size={32} className="text-muted" />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="form-label fw-semibold text-secondary small">
                                Logo o Imagen del Emprendimiento
                            </label>
                            <input
                                type="file"
                                className="form-control form-control-sm"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                            />
                            <span className="text-muted style-micro d-block mt-1">
                                Formatos permitidos: JPG, PNG o WEBP (Máx. 2MB).
                            </span>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6 text-start">
                            <label className="form-label fw-semibold text-secondary small">
                                Nombre del Emprendimiento <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombreEmprendimiento"
                                value={formData.nombreEmprendimiento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 text-start">
                            <label className="form-label fw-semibold text-secondary small">
                                Nombre Completo del Titular <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombreCompleto"
                                value={formData.nombreCompleto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6 text-start">
                            <label className="form-label fw-semibold text-secondary small">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                className="form-control bg-light"
                                name="email"
                                value={formData.email}
                                disabled // El email por seguridad suele no editarse libremente
                            />
                        </div>

                        <div className="col-md-6 text-start">
                            <label className="form-label fw-semibold text-secondary small">
                                Teléfono de Contacto <span className="text-danger">*</span>
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4 text-start">
                        <div className="d-flex justify-content-between mb-1">
                            <label className="form-label fw-semibold text-secondary small mb-0">
                                Descripción del Emprendimiento <span className="text-danger">*</span>
                            </label>
                            <span className="text-muted style-micro">{formData.descripcion.length}/250</span>
                        </div>
                        <textarea
                            className="form-control"
                            rows={3}
                            maxLength={250}
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 fw-bold"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <Loader2 size={16} className="spinner-border spinner-border-sm" />
                                    Enviando a moderación...
                                </>
                            ) : (
                                <>
                                    <Send size={16} /> Guardar y Enviar a Revisión
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MiPerfil;