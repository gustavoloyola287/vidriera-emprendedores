import React, { useState } from 'react';
import { Eye, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export interface Producto {
    id: string | number;
    nombre: string;
    tipoClasificacion: 'CATEGORIA' | 'RUBRO';
    clasificacionNombre: string;
    precioHabilitado: boolean;
    precio?: number;
    descripcion: string;
    imagenUrl?: string;
    estado: 'Activo' | 'Inactivo';
}

export const MisProductos: React.FC = () => {
    // Estados de lista y modales
    const [productos, setProductos] = useState<Producto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    // Estados de selección
    const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
    const [productoVer, setProductoVer] = useState<Producto | null>(null);
    const [productoEliminarId, setProductoEliminarId] = useState<string | number | null>(null);

    // Estados del Formulario
    const [nombre, setNombre] = useState('');
    const [tipoClasificacion, setTipoClasificacion] = useState<'CATEGORIA' | 'RUBRO'>('CATEGORIA');
    const [clasificacionNombre, setClasificacionNombre] = useState('');
    const [precioHabilitado, setPrecioHabilitado] = useState(true);
    const [precio, setPrecio] = useState<number | ''>('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [errorImagen, setErrorImagen] = useState('');

    // Abrir Modal para Crear o Editar
    const handleAbrirModal = (prod?: Producto) => {
        setErrorImagen('');
        if (prod) {
            setProductoEditar(prod);
            setNombre(prod.nombre);
            setTipoClasificacion(prod.tipoClasificacion);
            setClasificacionNombre(prod.clasificacionNombre);
            setPrecioHabilitado(prod.precioHabilitado);
            setPrecio(prod.precio !== undefined ? prod.precio : '');
            setDescripcion(prod.descripcion);
            setImagenUrl(prod.imagenUrl || '');
        } else {
            setProductoEditar(null);
            setNombre('');
            setTipoClasificacion('CATEGORIA');
            setClasificacionNombre('');
            setPrecioHabilitado(true);
            setPrecio('');
            setDescripcion('');
            setImagenUrl('');
        }
        setShowModal(true);
    };

    // Manejo de carga e validación de imagen
    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setErrorImagen('El archivo excede el tamaño máximo permitido de 2MB.');
            return;
        }

        // Validar formato
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrorImagen('Formato no válido. Utiliza JPG, PNG o WEBP.');
            return;
        }

        setErrorImagen('');
        // Previsualización local
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagenUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Guardar (Crear / Editar)
    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();

        const nuevoProducto: Producto = {
            id: productoEditar ? productoEditar.id : Date.now(),
            nombre,
            tipoClasificacion,
            clasificacionNombre,
            precioHabilitado,
            precio: precioHabilitado && precio !== '' ? Number(precio) : undefined,
            descripcion,
            imagenUrl,
            estado: productoEditar ? productoEditar.estado : 'Activo',
        };

        if (productoEditar) {
            setProductos(productos.map((p) => (p.id === productoEditar.id ? nuevoProducto : p)));
        } else {
            setProductos([...productos, nuevoProducto]);
        }

        setShowModal(false);
    };

    // Confirmar Eliminación
    const handleConfirmarEliminar = () => {
        if (productoEliminarId !== null) {
            setProductos(productos.filter((p) => p.id !== productoEliminarId));
            setProductoEliminarId(null);
        }
        setShowDeleteModal(false);
    };

    return (
        <div className="container py-4">
            {/* Header del módulo */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark mb-0">Gestión de Productos</h3>
                <button className="btn btn-primary px-3" onClick={() => handleAbrirModal()}>
                    + Publicar Nuevo Producto
                </button>
            </div>

            {/* Listado de Productos */}
            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" className="fw-bold">Imagen</th>
                            <th scope="col" className="fw-bold">Producto</th>
                            <th scope="col" className="fw-bold">Clasificación</th>
                            <th scope="col" className="fw-bold">Precio</th>
                            <th scope="col" className="fw-bold">Estado</th>
                            <th scope="col" className="fw-bold text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        {prod.imagenUrl ? (
                                            <img
                                                src={prod.imagenUrl}
                                                alt={prod.nombre}
                                                className="rounded object-fit-cover"
                                                style={{ width: '48px', height: '48px' }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded border d-flex align-items-center justify-content-center bg-light text-muted"
                                                style={{ width: '48px', height: '48px' }}
                                            >
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="fw-semibold">{prod.nombre}</td>
                                    <td className="text-secondary">
                                        <span className="badge bg-light text-dark border me-1">
                                            {prod.tipoClasificacion}
                                        </span>
                                        {prod.clasificacionNombre}
                                    </td>
                                    <td className="fw-semibold">
                                        {prod.precioHabilitado && prod.precio !== undefined ? (
                                            `$${prod.precio}`
                                        ) : (
                                            <span className="text-muted fst-italic">No publicado</span>
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge px-2 py-1 ${
                                                prod.estado === 'Activo' ? 'bg-success' : 'bg-secondary'
                                            }`}
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            {prod.estado}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-inline-flex gap-2">
                                            <button
                                                className="btn btn-outline-info btn-sm p-1 rounded"
                                                onClick={() => {
                                                    setProductoVer(prod);
                                                    setShowViewModal(true);
                                                }}
                                                title="Ver Detalle"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="btn btn-outline-primary btn-sm p-1 rounded"
                                                onClick={() => handleAbrirModal(prod)}
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm p-1 rounded"
                                                onClick={() => {
                                                    setProductoEliminarId(prod.id);
                                                    setShowDeleteModal(true);
                                                }}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

{/* MODAL FORMULARIO: ALTA / EDICIÓN */}
{showModal && (
    <div 
        className="modal show d-block bg-dark bg-opacity-50" 
        tabIndex={-1}
        style={{ overflowX: 'hidden', overflowY: 'auto' }}
    >
        <div className="modal-dialog modal-dialog-centered modal-lg px-2">
            <div className="modal-content border-0 shadow overflow-hidden">
                
                {/* Header: Título Centrado y Botón 'X' Posicionado */}
                <div className="modal-header border-0 pb-0 px-4 pt-4 position-relative d-flex justify-content-center align-items-center">
                    <h5 className="modal-title fw-bold text-dark fs-5 text-center m-0 w-100">
                        {productoEditar ? 'Editar Producto' : 'Publicar Nuevo Producto'}
                    </h5>
                    <button
                        type="button"
                        className="btn-close position-absolute"
                        style={{ right: '1.25rem', top: '1.25rem', zIndex: 10 }}
                        onClick={() => setShowModal(false)}
                    ></button>
                </div>

                <form onSubmit={handleGuardar} className="w-100 m-0">
                    <div className="modal-body p-3 p-md-4">
                        {/* Contenedor Grid con flex/box-sizing forzado */}
                        <div className="row g-3 align-items-start m-0 w-100">
                            
                            {/* Nombre del Producto */}
                            <div className="col-12 col-md-6 px-2">
                                <label className="form-label fw-semibold text-dark mb-1">
                                    Nombre del Producto*
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    maxLength={15}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Máx. 15 caracteres"
                                    required
                                />
                                <small className="text-muted d-block mt-1">
                                    {nombre.length}/15 caracteres
                                </small>
                            </div>

                            {/* Clasificación */}
                            <div className="col-12 col-md-6 px-2">
                                <div className="row g-2 m-0 w-100">
                                    <div className="col-6 p-0 pe-1">
                                        <label className="form-label fw-semibold text-dark mb-1">
                                            Clasificar por
                                        </label>
                                        <select
                                            className="form-select"
                                            value={tipoClasificacion}
                                            onChange={(e) =>
                                                setTipoClasificacion(
                                                    e.target.value as 'CATEGORIA' | 'RUBRO'
                                                )
                                            }
                                        >
                                            <option value="CATEGORIA">Categoría</option>
                                            <option value="RUBRO">Rubro</option>
                                        </select>
                                    </div>
                                    <div className="col-6 p-0 ps-1">
                                        <label className="form-label fw-semibold text-dark mb-1 text-truncate d-block">
                                            Nombre de {tipoClasificacion}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={clasificacionNombre}
                                            onChange={(e) => setClasificacionNombre(e.target.value)}
                                            placeholder="Ej. Calzados..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visibilidad de Precio */}
                            <div className="col-12 col-md-6 px-2">
                                <label className="form-label fw-semibold text-dark mb-1 d-block">
                                    Visibilidad de Precio
                                </label>
                                <div className="form-check form-switch mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="precioSwitch"
                                        checked={precioHabilitado}
                                        onChange={(e) => setPrecioHabilitado(e.target.checked)}
                                    />
                                    <label className="form-check-label ms-1" htmlFor="precioSwitch">
                                        {precioHabilitado
                                            ? 'Precio visible'
                                            : 'Ocultar precio (Consultar)'}
                                    </label>
                                </div>
                            </div>

                            {/* Campo Precio */}
                            <div className="col-12 col-md-6 px-2">
                                {precioHabilitado ? (
                                    <>
                                        <label className="form-label fw-semibold text-dark mb-1">
                                            Precio ($)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min={0}
                                            value={precio}
                                            onChange={(e) =>
                                                setPrecio(
                                                    e.target.value ? Number(e.target.value) : ''
                                                )
                                            }
                                            placeholder="0.00"
                                            required={precioHabilitado}
                                        />
                                    </>
                                ) : (
                                    <div style={{ height: '62px' }} />
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="col-12 px-2">
                                <label className="form-label fw-semibold text-dark mb-1">
                                    Descripción*
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    maxLength={250}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Describe tu producto (máximo 250 caracteres)..."
                                    required
                                ></textarea>
                                <small className="text-muted d-block mt-1">
                                    {descripcion.length}/250 caracteres
                                </small>
                            </div>

                            {/* Carga de Imagen */}
                            <div className="col-12 col-md-7 px-2">
                                <label className="form-label fw-semibold text-dark mb-1">
                                    Imagen del Producto
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleImagenChange}
                                />
                                {errorImagen && (
                                    <small className="text-danger d-block mt-1">{errorImagen}</small>
                                )}
                                <small className="text-muted d-block mt-1">
                                    Formatos: JPG, PNG, WEBP. Máx: 2MB.
                                </small>
                            </div>

                            {/* Previsualización */}
                            <div className="col-12 col-md-5 px-2 d-flex flex-column align-items-center">
                                <label className="form-label fw-semibold text-dark mb-2">
                                    Previsualización
                                </label>
                                {imagenUrl ? (
                                    <img
                                        src={imagenUrl}
                                        alt="Vista previa"
                                        className="rounded border object-fit-cover shadow-sm"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                ) : (
                                    <div
                                        className="border rounded d-flex flex-column align-items-center justify-content-center text-muted"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            backgroundColor: '#f8f9fa',
                                        }}
                                    >
                                        <ImageIcon size={24} />
                                        <span style={{ fontSize: '0.7rem' }}>Sin imagen</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer: Botones centrados */}
                    <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-light px-4"
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary px-4">
                            {productoEditar ? 'Guardar Cambios' : 'Publicar Producto'}
                        </button>
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
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center py-3">
                                <p className="mb-0">
                                    ¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={handleConfirmarEliminar}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE / VER PRODUCTO */}
            {showViewModal && productoVer && (
                <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{productoVer.nombre}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowViewModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                {productoVer.imagenUrl ? (
                                    <img
                                        src={productoVer.imagenUrl}
                                        alt={productoVer.nombre}
                                        className="img-fluid rounded mb-3 object-fit-cover"
                                        style={{ maxHeight: '250px' }}
                                    />
                                ) : (
                                    <div
                                        className="border rounded d-flex flex-column align-items-center justify-content-center text-muted mx-auto mb-3"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            backgroundColor: '#f8f9fa',
                                        }}
                                    >
                                        <ImageIcon size={32} />
                                        <span style={{ fontSize: '0.8rem' }}>Sin imagen</span>
                                    </div>
                                )}
                                <div className="mb-2">
                                    <span className="badge bg-secondary me-2">
                                        {productoVer.tipoClasificacion}: {productoVer.clasificacionNombre}
                                    </span>
                                    <span className="fw-bold text-success fs-5">
                                        {productoVer.precioHabilitado && productoVer.precio !== undefined
                                            ? `$${productoVer.precio}`
                                            : 'Precio a consultar'}
                                    </span>
                                </div>
                                <p
                                    className="text-muted text-start border p-2 rounded bg-light mt-3 mb-0"
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    {productoVer.descripcion}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};