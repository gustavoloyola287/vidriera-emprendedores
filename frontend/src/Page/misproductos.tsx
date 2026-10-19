import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export interface Producto {
    id: string | number;
    nombre: string;
    categoriaId?: number;
    nombreCategoria?: string;
    precio?: number; // Puede ser undefined en datos viejos, pero el formulario lo exigirá
    descripcion: string;
    imagenUrl?: string;
    estado: 'Activo' | 'Inactivo';
}

const API_BASE_URL = 'http://localhost:8080/api/productos';

export const MisProductos: React.FC = () => {
    // Estados principales
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorApi, setErrorApi] = useState<string | null>(null);

    // Estados de modales
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    // Estados de selección
    const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
    const [productoVer, setProductoVer] = useState<Producto | null>(null);
    const [productoEliminarId, setProductoEliminarId] = useState<string | number | null>(null);

    // Estados del Formulario (✅ Precio siempre obligatorio)
    const [nombre, setNombre] = useState('');
    const [categoriaId, setCategoriaId] = useState<number | ''>('');
    const [precio, setPrecio] = useState<string>(''); // Usamos string para el input, luego lo convertimos a number
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [errorImagen, setErrorImagen] = useState('');

    // Estado para el sistema de Toasts
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

    const getToken = () => localStorage.getItem('token');
    const getEmprendedorId = () => localStorage.getItem('emprendedorId');

    // 1. Obtener productos y categorías al montar
    useEffect(() => {
        fetchProductos();
        
        fetch(`${API_BASE_URL}/categorias`)
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error cargando categorías", err));
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        setErrorApi(null);
        const token = getToken();
        const emprendedorId = getEmprendedorId();

        if (!token || !emprendedorId) {
            setErrorApi('No se encontró la sesión del emprendedor.');
            mostrarToast('Error de autenticación', 'danger');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/emprendedor/${emprendedorId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar la lista de productos.');
            const data = await response.json();
            setProductos(data);
        } catch (err: any) {
            const msg = err.message || 'Error de conexión con el servidor.';
            setErrorApi(msg);
            mostrarToast(msg, 'danger');
        } finally {
            setLoading(false);
        }
    };

    // 2. Guardar / Editar Producto (POST / PUT)
    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorApi(null);

        const token = getToken();
        const emprendedorId = getEmprendedorId();

        if (!token || !emprendedorId) {
            setErrorApi('Error de autenticación. Iniciá sesión nuevamente.');
            mostrarToast('Error de autenticación', 'danger');
            setLoading(false);
            return;
        }

        if (!categoriaId) {
            mostrarToast('Debes seleccionar una categoría', 'warning');
            setLoading(false);
            return;
        }

        // ✅ Validar que el precio sea obligatorio y válido
        if (precio === '' || precio === null || Number(precio) < 0) {
            mostrarToast('El precio es obligatorio y debe ser mayor o igual a 0', 'warning');
            setLoading(false);
            return;
        }

        try {
            let response;

            // ✅ El precio SIEMPRE se envía como número
            const productoData = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                precio: Number(precio), 
                imagenUrl: imagenUrl,
                categoriaId: Number(categoriaId),
                emprendedorId: Number(emprendedorId)
            };

            if (productoEditar) {
                response = await fetch(`${API_BASE_URL}/${productoEditar.id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productoData),
                });
            } else {
                if (imagenUrl && imagenUrl.trim() !== '') {
                    // 📸 CON IMAGEN: Usamos FormData → MongoDB
                    const formData = new FormData();
                    formData.append('nombre', productoData.nombre);
                    formData.append('descripcion', productoData.descripcion);
                    formData.append('precio', String(productoData.precio)); // ✅ Precio siempre incluido
                    formData.append('idCategoria', String(productoData.categoriaId));
                    formData.append('idEmprendedor', String(productoData.emprendedorId));

                    const base64Response = await fetch(imagenUrl);
                    const blob = await base64Response.blob();
                    const file = new File([blob], 'producto.jpg', { type: blob.type });
                    formData.append('foto', file);

                    console.log('📸 Enviando producto CON imagen a MongoDB...');

                    response = await fetch(`${API_BASE_URL}/con-foto`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData,
                    });
                } else {
                    // 📝 SIN IMAGEN: JSON normal
                    console.log('📝 Enviando producto SIN imagen...');

                    response = await fetch(API_BASE_URL, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(productoData),
                    });
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Respuesta de error:', errorData);
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            await fetchProductos();
            setShowModal(false);
            mostrarToast(
                productoEditar ? '¡Producto actualizado!' : '¡Producto publicado con éxito!', 
                'success'
            );
        } catch (err: any) {
            console.error('Error al guardar:', err);
            const msg = err.message || 'Error al guardar cambios.';
            setErrorApi(msg);
            mostrarToast(msg, 'danger');
        } finally {
            setLoading(false);
        }
    };

    // 3. Eliminar Producto
    const handleConfirmarEliminar = async () => {
        if (productoEliminarId === null) return;
        setLoading(true);
        setErrorApi(null);
        const token = getToken();

        try {
            const response = await fetch(`${API_BASE_URL}/${productoEliminarId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('No se pudo eliminar el producto.');

            setProductoEliminarId(null);
            setShowDeleteModal(false);
            await fetchProductos();
            mostrarToast('El producto fue eliminado correctamente.', 'success');
        } catch (err: any) {
            const msg = err.message || 'Error al intentar eliminar.';
            setErrorApi(msg);
            mostrarToast(msg, 'danger');
        } finally {
            setLoading(false);
        }
    };

    // --- MANEJO DE INTERFAZ ---
    const handleAbrirModal = (prod?: Producto) => {
        setErrorImagen('');
        if (prod) {
            setProductoEditar(prod);
            setNombre(prod.nombre);
            setCategoriaId(prod.categoriaId || '');
            // ✅ Cargar precio de forma segura
            setPrecio(prod.precio !== undefined && prod.precio !== null ? String(prod.precio) : '');
            setDescripcion(prod.descripcion);
            setImagenUrl(prod.imagenUrl || '');
        } else {
            setProductoEditar(null);
            setNombre('');
            setCategoriaId(categorias.length > 0 ? categorias[0].id : '');
            setPrecio(''); // Resetear precio
            setDescripcion('');
            setImagenUrl('');
        }
        setShowModal(true);
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setErrorImagen('El archivo excede 2MB.');
            mostrarToast('El archivo excede 2MB.', 'warning');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrorImagen('Formato no válido. Usa JPG, PNG o WEBP.');
            mostrarToast('Formato no válido.', 'warning');
            return;
        }

        setErrorImagen('');
        const reader = new FileReader();
        reader.onloadend = () => setImagenUrl(reader.result as string);
        reader.readAsDataURL(file);
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
            {/* TOAST */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
                <div className={`toast align-items-center border-0 shadow-lg rounded-3 ${obtenerClaseToastBg(toastInfo.tipo)} ${toastInfo.visible ? 'show' : 'hide'}`} role="alert">
                    <div className="d-flex">
                        <div className="toast-body d-flex align-items-center gap-2">
                            {renderIconoToast(toastInfo.tipo)}
                            <span className="fw-semibold">{toastInfo.mensaje}</span>
                        </div>
                        <button type="button" className={`btn-close me-2 m-auto ${toastInfo.tipo === 'warning' ? '' : 'btn-close-white'}`} onClick={() => setToastInfo(prev => ({ ...prev, visible: false }))}></button>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark mb-0">Gestión de Productos</h3>
                <button className="btn btn-primary px-3" onClick={() => handleAbrirModal()}>+ Publicar Nuevo Producto</button>
            </div>

            {errorApi && (
                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                    {errorApi}
                    <button type="button" className="btn-close" onClick={() => setErrorApi(null)}></button>
                </div>
            )}

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="fw-bold">Imagen</th>
                            <th className="fw-bold">Producto</th>
                            <th className="fw-bold">Categoría</th>
                            <th className="fw-bold">Precio</th>
                            <th className="fw-bold">Estado</th>
                            <th className="fw-bold text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && productos.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-4"><Loader2 className="spinner-border text-primary me-2" size={24} />Cargando...</td></tr>
                        ) : productos.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-muted py-4">No tenés productos publicados. ¡Comenzá a cargar el primero!</td></tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        {prod.imagenUrl ? (
                                            <img src={prod.imagenUrl} alt={prod.nombre} className="rounded object-fit-cover" style={{ width: '48px', height: '48px' }} />
                                        ) : (
                                            <div className="rounded border d-flex align-items-center justify-content-center bg-light text-muted" style={{ width: '48px', height: '48px' }}><ImageIcon size={20} /></div>
                                        )}
                                    </td>
                                    <td className="fw-semibold">{prod.nombre}</td>
                                    <td className="text-secondary">{prod.nombreCategoria || 'Sin categoría'}</td>
                                    {/* ✅ Muestra el precio o un fallback seguro por si hay datos viejos */}
                                    <td className="fw-semibold">
                                        {prod.precio !== null && prod.precio !== undefined ? `$${Number(prod.precio).toLocaleString('es-AR')}` : 'Consultar'}
                                    </td>
                                    <td><span className={`badge px-2 py-1 ${prod.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{prod.estado}</span></td>
                                    <td className="text-end">
                                        <div className="d-inline-flex gap-2">
                                            <button className="btn btn-outline-info btn-sm p-1 rounded" onClick={() => { setProductoVer(prod); setShowViewModal(true); }} title="Ver"><Eye size={16} /></button>
                                            <button className="btn btn-outline-primary btn-sm p-1 rounded" onClick={() => handleAbrirModal(prod)} title="Editar"><Edit size={16} /></button>
                                            <button className="btn btn-outline-danger btn-sm p-1 rounded" onClick={() => { setProductoEliminarId(prod.id); setShowDeleteModal(true); }} title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORMULARIO */}
            {showModal && (
                <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1} style={{ overflowY: 'auto' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-0 pb-0 px-4 pt-4 position-relative">
                                <h5 className="modal-title fw-bold text-dark fs-5 text-center w-100">{productoEditar ? 'Editar Producto' : 'Publicar Nuevo Producto'}</h5>
                                <button type="button" className="btn-close position-absolute" style={{ right: '1.25rem', top: '1.25rem' }} onClick={() => setShowModal(false)} disabled={loading}></button>
                            </div>

                            <form onSubmit={handleGuardar}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Nombre del Producto *</label>
                                            <input type="text" className="form-control" maxLength={50} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Categoría *</label>
                                            <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')} required>
                                                <option value="">Selecciona una categoría</option>
                                                {categorias.map((cat: any) => (
                                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* ✅ PRECIO SIEMPRE VISIBLE Y OBLIGATORIO */}
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Precio ($) *</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                min={0} 
                                                step="0.01" 
                                                value={precio} 
                                                onChange={(e) => setPrecio(e.target.value)} 
                                                placeholder="0.00" 
                                                required 
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Descripción *</label>
                                            <textarea className="form-control" rows={3} maxLength={250} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                                            <small className="text-muted">{descripcion.length}/250 caracteres</small>
                                        </div>

                                        <div className="col-12 col-md-7">
                                            <label className="form-label fw-semibold">Imagen del Producto</label>
                                            <input type="file" className="form-control" accept="image/png, image/jpeg, image/webp" onChange={handleImagenChange} />
                                            {errorImagen && <small className="text-danger d-block mt-1">{errorImagen}</small>}
                                        </div>

                                        <div className="col-12 col-md-5 d-flex flex-column align-items-center">
                                            <label className="form-label fw-semibold mb-2">Previsualización</label>
                                            {imagenUrl ? (
                                                <img src={imagenUrl} alt="Vista previa" className="rounded border object-fit-cover shadow-sm" style={{ width: '100px', height: '100px' }} />
                                            ) : (
                                                <div className="border rounded d-flex flex-column align-items-center justify-content-center text-muted" style={{ width: '100px', height: '100px', backgroundColor: '#f8f9fa' }}>
                                                    <ImageIcon size={24} /><span style={{ fontSize: '0.7rem' }}>Sin imagen</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center gap-2">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)} disabled={loading}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary px-4" disabled={loading}>{loading ? 'Guardando...' : (productoEditar ? 'Guardar Cambios' : 'Publicar Producto')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR */}
            {showDeleteModal && (
                <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title fs-6 fw-bold">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} disabled={loading}></button>
                            </div>
                            <div className="modal-body text-center py-3">
                                <p className="mb-0">¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-light btn-sm" onClick={() => setShowDeleteModal(false)} disabled={loading}>Cancelar</button>
                                <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirmarEliminar} disabled={loading}>{loading ? 'Eliminando...' : 'Eliminar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL VER DETALLE */}
            {showViewModal && productoVer && (
                <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{productoVer.nombre}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body text-center">
                                {productoVer.imagenUrl ? (
                                    <img src={productoVer.imagenUrl} alt={productoVer.nombre} className="img-fluid rounded mb-3 object-fit-cover" style={{ maxHeight: '250px' }} />
                                ) : (
                                    <div className="border rounded d-flex flex-column align-items-center justify-content-center text-muted mx-auto mb-3" style={{ width: '120px', height: '120px', backgroundColor: '#f8f9fa' }}>
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                <p className="text-muted small mb-2">{productoVer.descripcion}</p>
                                <div className="d-flex justify-content-center gap-2">
                                    <span className="badge bg-light text-dark border">{productoVer.nombreCategoria || 'Sin categoría'}</span>
                                    <span className={`badge ${productoVer.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{productoVer.estado}</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowViewModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisProductos;