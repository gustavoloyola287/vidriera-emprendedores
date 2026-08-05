import { type Emprendedor } from "../Types/Emprendedor";

interface CardEmprendedorProps{
    emprendedor:Emprendedor;
    verPerfil: (id: number) => void;
}
function CardEmprendedor (props: CardEmprendedorProps){
    return (
        <div>
            <h2>{props.emprendedor.nombreEmprendimiento}</h2>
            <p>{props.emprendedor.nombreCompleto}</p>
            <p>{props.emprendedor.descripcion}</p>
            <button onClick={() => props.verPerfil(props.emprendedor.id)}>Ver Perfil
            </button>
        </div>
    );
}
export default CardEmprendedor;