import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

const API_URL = 'http://localhost:8080/api/categorias';

const MOCK_CATEGORIAS_INICIALES: Categoria[] = [
    { id: 1, nombre: 'Gastronomía', descripcion: 'Comidas, repostería y bebidas artesanales' },
    { id: 2, nombre: 'Indumentaria', descripcion: 'Ropa, calzado y accesorios' },
    { id: 3, nombre: 'Artesanías', descripcion: 'Productos hechos a mano y decoración' }
];

export const CategoriasView: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ nombre: string; descripcion: string }>({ nombre: '', descripcion: '' });

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URL, {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' }
            });

            if (res.ok) {
                const data = await res.json();
                setCategorias(data);
            } else {
                throw new Error('Respuesta no OK del servidor');
            }
        } catch (error) {
            console.warn('Backend no disponible. Usando datos locales de prueba.');
            setCategorias((prev) => (prev.length > 0 ? prev : MOCK_CATEGORIAS_INICIALES));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre.trim()) return;

        const isEditing = editandoId !== null;
        const url = isEditing ? `${API_URL}/${editandoId}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await fetchCategorias();
            } else {
                throw new Error('Error al guardar en el backend');
            }
        } catch (error) {
            console.warn('Operación realizada localmente en el frontend.');

            if (isEditing) {
                setCategorias((prev) =>
                    prev.map((cat) =>
                        cat.id === editandoId
                            ? { ...cat, nombre: formData.nombre, descripcion: formData.descripcion }
                            : cat
                    )
                );
            } else {
                const maxId = categorias.reduce((max, c) => (c.id > max ? c.id : max), 0);
                const nuevaCat: Categoria = {
                    id: maxId + 1,
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                };
                setCategorias((prev) => [...prev, nuevaCat]);
            }
        } finally {
            setFormData({ nombre: '', descripcion: '' });
            setEditandoId(null);
        }
    };

    const handleEditar = (cat: Categoria) => {
        setEditandoId(cat.id);
        setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' }
            });

            if (res.ok) {
                await fetchCategorias();
            } else {
                throw new Error('Error al eliminar del backend');
            }
        } catch (error) {
            console.warn('Eliminación realizada localmente.');
            setCategorias((prev) => prev.filter((cat) => cat.id !== id));
        }
    };

    const handleCancelar = () => {
        setEditandoId(null);
        setFormData({ nombre: '', descripcion: '' });
    };

    return (
        <div className="w-100 p-4">
            <h4 className="fw-bold mb-4" style={{ color: '#002040' }}>Gestión de Categorías</h4>

            <div className="row g-4 align-items-start">
                {/* Formulario con mayor espacio proporcional */}
                <div className="col-12 col-md-5 col-lg-5 col-xl-4">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h6 className="fw-bold mb-3" style={{ color: '#002040' }}>
                            {editandoId !== null ? 'Modificar Categoría' : 'Nueva Categoría'}
                        </h6>
                        <form onSubmit={handleGuardar}>
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej. Gastronomía, Indumentaria..."
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Descripción</label>
                                <textarea
                                    className="form-control"
                                    rows={5}
                                    style={{ minHeight: '130px', resize: 'vertical' }}
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Breve descripción opcional..."
                                />
                            </div>

                            <div className="d-flex flex-wrap gap-2 pt-2">
                                <button type="submit" className="btn btn-primary btn-sm px-3 flex-fill d-flex align-items-center justify-content-center gap-1 py-2">
                                    {editandoId !== null ? <Check size={16} /> : <Plus size={16} />}
                                    {editandoId !== null ? 'Guardar' : 'Agregar'}
                                </button>
                                {editandoId !== null && (
                                    <button type="button" className="btn btn-outline-secondary btn-sm px-3 flex-fill d-flex align-items-center justify-content-center gap-1 py-2" onClick={handleCancelar}>
                                        <X size={16} /> Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tabla de Listado */}
                <div className="col-12 col-md-7 col-lg-7 col-xl-8">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h6 className="fw-bold mb-3" style={{ color: '#002040' }}>Categorías Existentes</h6>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr className="border-bottom text-muted small">
                                        <th style={{ width: '50px' }}>ID</th>
                                        <th style={{ width: '30%' }}>Nombre</th>
                                        <th>Descripción</th>
                                        <th className="text-end" style={{ width: '90px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-3">Cargando categorías...</td></tr>
                                    ) : categorias.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-3 text-muted">No existen categorías creadas.</td></tr>
                                    ) : (
                                        categorias.map((cat) => (
                                            <tr key={cat.id}>
                                                <td className="fw-semibold text-muted">{cat.id}</td>
                                                <td className="fw-bold" style={{ color: '#002040' }}>{cat.nombre}</td>
                                                <td className="text-muted small">{cat.descripcion || '-'}</td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-1">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm p-1"
                                                            onClick={() => handleEditar(cat)}
                                                            title="Editar"
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm p-1"
                                                            onClick={() => handleEliminar(cat.id)}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};