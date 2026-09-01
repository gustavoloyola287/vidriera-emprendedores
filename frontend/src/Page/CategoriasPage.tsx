import { useEffect, useState } from 'react';
import { productoService } from '../services/productoService';

export const CategoriasPage = () => {
            const [categorias, setCategorias] = useState<any[]>([]);
            const [loading, setLoading] = useState(true);

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

            return (
                <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Categorías</h1>

                    {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando categorías...</div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {categorias.map((cat, idx) => (
                        <div
                            key={typeof cat === 'object' && cat?.id ? cat.id : idx}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center font-bold text-lg text-gray-700"
                        >
                            {typeof cat === 'object' ? cat.nombre : cat}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            );
};

export default CategoriasPage;