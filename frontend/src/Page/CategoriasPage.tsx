import React, { useEffect, useState } from 'react';
import { productoService } from '../services/productoService';
import type { Producto, Categoria } from '../types/Producto';
import { ChevronDown, ChevronUp, Package, Utensils, Shirt, Palette, Sparkles } from 'lucide-react';

const ICONOS: Record<string, React.ElementType> = {
    gastronomia: Utensils,
    indumentaria: Shirt,
    artesania: Palette,
    artesanias: Palette,
};

export const CategoriasPage = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriaAbierta, setCategoriaAbierta] = useState<number | string | null>(null);
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

    const toggleCategoria = async (cat: Categoria | any, catId: number | string) => {
        if (categoriaAbierta === catId) {
            setCategoriaAbierta(null);
            setProductosCategoria([]);
            return;
        }

        setCategoriaAbierta(catId);

        if (typeof cat === 'object' && Array.isArray(cat.productos)) {
            setProductosCategoria(cat.productos);
            return;
        }

        setLoadingProductos(true);
        try {
            const productos = await productoService.getProductosPorCategoria(catId);
            setProductosCategoria(productos);
        } catch (err) {
            console.error('Error al obtener productos de la categoría:', err);
            setProductosCategoria([]);
        } finally {
            setLoadingProductos(false);
        }
    };

    const obtenerIcono = (nombre: string) => {
        const key = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const IconComponent = ICONOS[key] || Sparkles;
        return <IconComponent className="w-7 h-7 text-teal-600" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#002040' }}>
                        Categorías
                    </h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Explorá los productos de nuestros emprendedores según tu categoría de interés
                    </p>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando categorías...</div>
                ) : (
                    <div className="flex flex-col items-center gap-8">
                        
                        {/* Grilla Centrada de Tarjetas de Categoría */}
                        <div className="flex flex-wrap justify-center gap-6 w-full">
                            {categorias.map((cat, idx) => {
                                const catId = typeof cat === 'object' && cat?.id ? cat.id : idx;
                                const catNombre = typeof cat === 'object' ? cat.nombre : String(cat);
                                const catDesc = typeof cat === 'object' ? cat.descripcion : '';
                                const estaAbierto = categoriaAbierta === catId;

                                return (
                                    <button
                                        key={catId}
                                        onClick={() => toggleCategoria(cat, catId)}
                                        className={`flex flex-col items-center justify-between p-6 rounded-2xl bg-white border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer ${
                                            estaAbierto 
                                                ? 'border-teal-500 ring-2 ring-teal-500/20 scale-105' 
                                                : 'border-gray-200 hover:-translate-y-1'
                                        }`}
                                        style={{ width: '220px', minHeight: '180px' }}
                                    >
                                        <div className="p-3 rounded-full bg-teal-50 mb-3">
                                            {obtenerIcono(catNombre)}
                                        </div>

                                        <div className="text-center">
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">{catNombre}</h3>
                                            {catDesc && (
                                                <p className="text-xs text-gray-400 line-clamp-2">{catDesc}</p>
                                            )}
                                        </div>

                                        <div className="mt-3 text-teal-600 flex items-center gap-1 text-xs font-semibold">
                                            <span>{estaAbierto ? 'Ocultar' : 'Ver productos'}</span>
                                            {estaAbierto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {categoriaAbierta !== null && (
                            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 animate-fadeIn">
                                {loadingProductos ? (
                                    <div className="text-center py-8 text-gray-500">Cargando productos de la categoría...</div>
                                ) : productosCategoria.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {productosCategoria.map((prod, index) => (
                                            <div 
                                                key={prod.id ?? index}
                                                className="flex flex-col bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                                            >
                                                {prod.url_imagen ? (
                                                    <img 
                                                        src={prod.url_imagen} 
                                                        alt={prod.nombre} 
                                                        className="w-full h-44 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-400">
                                                        <Package className="w-10 h-10" />
                                                    </div>
                                                )}

                                                <div className="p-4 flex flex-col flex-grow justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 mb-1">{prod.nombre}</h4>
                                                        {prod.descripcion && (
                                                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                                                {prod.descripcion}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {prod.precio !== undefined && (
                                                        <p className="text-base font-extrabold text-teal-600">
                                                            ${prod.precio}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400 italic">
                                        No hay productos registrados en esta categoría.
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriasPage;