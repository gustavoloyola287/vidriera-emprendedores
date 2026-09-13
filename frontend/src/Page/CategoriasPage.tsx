import { useEffect, useState } from 'react';
import { productoService } from '../services/productoService';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Producto {
    id: number;
    nombre: string;
    precio?: number;
    descripcion?: string;
}

export const CategoriasPage = () => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para controlar qué categoría está expandida
    const [categoriaAbierta, setCategoriaAbierta] = useState<number | string | null>(null);
    
    // Estado para almacenar los productos de la categoría abierta y su indicador de carga
    const [productosCategoria, setProductosCategoria] = useState<Producto[]>([]);
    const [loadingProductos, setLoadingProductos] = useState(false);

    useEffect(() => {
        productoService.getCategorias()
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategorias(data);
                }
            })
            .catch((err) => console.error('Error al obtener categorías:', err))
            .finally(() => setLoading(false));
    }, []);

    const toggleCategoria = async (cat: any, catId: number | string) => {
        // Si la categoría presionada ya está abierta, la cerramos
        if (categoriaAbierta === catId) {
            setCategoriaAbierta(null);
            setProductosCategoria([]);
            return;
        }

        setCategoriaAbierta(catId);

        // Si la categoría ya trae un listado de productos desde el backend, lo usamos directamente
        if (typeof cat === 'object' && Array.isArray(cat.productos)) {
            setProductosCategoria(cat.productos);
            return;
        }

        // Si no trae productos incluidos, se realiza la petición al backend
        setLoadingProductos(true);
        try {
            const productos = await productoService.getAll();
            setProductosCategoria(productos.filter((producto: any) => {
                const categoriaProducto = producto.categoriaId ?? producto.categoria?.id ?? producto.categoria;
                return String(categoriaProducto) === String(catId);
            }));
        } catch (err) {
            console.error('Error al obtener productos de la categoría:', err);
            setProductosCategoria([]);
        } finally {
            setLoadingProductos(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Categorías</h1>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando categorías...</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {categorias.map((cat, idx) => {
                            const catId = typeof cat === 'object' && cat?.id ? cat.id : idx;
                            const catNombre = typeof cat === 'object' ? cat.nombre : cat;
                            const estaAbierto = categoriaAbierta === catId;

                            return (
                                <div 
                                    key={catId} 
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all"
                                >
                                    {/* Cabecera interactiva del Acordeón */}
                                    <button
                                        onClick={() => toggleCategoria(cat, catId)}
                                        className="w-full p-5 flex justify-between items-center text-left font-bold text-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <span>{catNombre}</span>
                                        {estaAbierto ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        )}
                                    </button>

                                    {/* Contenido desplegable */}
                                    {estaAbierto && (
                                        <div className="p-5 border-t border-gray-100 bg-gray-50">
                                            {loadingProductos ? (
                                                <div className="text-center py-4 text-gray-500 text-sm">
                                                    Cargando productos...
                                                </div>
                                            ) : productosCategoria.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                    {productosCategoria.map((prod) => (
                                                        <div 
                                                            key={prod.id} 
                                                            className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
                                                        >
                                                            <h3 className="font-semibold text-gray-800">{prod.nombre}</h3>
                                                            {prod.precio !== undefined && (
                                                                <p className="text-sm font-medium text-emerald-600 mt-1">
                                                                    ${prod.precio}
                                                                </p>
                                                            )}
                                                            {prod.descripcion && (
                                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                    {prod.descripcion}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-gray-400 text-sm italic">
                                                    No hay productos registrados en esta categoría.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriasPage;