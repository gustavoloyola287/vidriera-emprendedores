import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emprendedorService } from '../services/emprendedorService';
import type { Emprendedor } from '../types/Emprendedor';
import CardEmprendedor from '../components/CardEmprendedor';

export const EmprendedoresPage = () => {
    const [emprendedores, setEmprendedores] = useState<Emprendedor[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        emprendedorService.getAll()
            .then(data => setEmprendedores(data))
            .catch(err => console.error('Error al obtener emprendedores:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleVerPerfil = (id: number) => {
        navigate(`/emprendedores/${id}`);
    };

    if (loading) return <div className="p-8 text-center">Cargando emprendedores...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Emprendedores</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {emprendedores.map((emp) => (
                    <CardEmprendedor 
                        key={emp.id} 
                        emprendedor={emp} 
                        verPerfil={handleVerPerfil} 
                    />
                ))}
            </div>
        </div>
    );
};

export default EmprendedoresPage;