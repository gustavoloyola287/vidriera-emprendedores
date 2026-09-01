import type { Emprendedor } from '../types/Emprendedor';

interface CardEmprendedorProps {
    emprendedor: Emprendedor;
    verPerfil: (id: number) => void;
}

function CardEmprendedor(props: CardEmprendedorProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold text-gray-800">{props.emprendedor.nombreEmprendimiento}</h2>
                <p className="text-sm font-medium text-gray-600">{props.emprendedor.nombreCompleto}</p>
                <p className="text-gray-500 mt-2 text-sm">{props.emprendedor.descripcion}</p>
            </div>
            <button 
                onClick={() => props.verPerfil(props.emprendedor.id)}
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
            >
                Ver Perfil
            </button>
        </div>
    );
}

export default CardEmprendedor;