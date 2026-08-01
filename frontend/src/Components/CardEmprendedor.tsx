import { type Emprendedor } from "../Types/Emprendedor";

interface CardEmprendedorProps{
    emprendedor:Emprendedor;
}
function CardEmprendedor (props: CardEmprendedorProps){
    return (
        <div>
            <h1>{props.emprendedor.nombreCompleto}</h1>
            <p>{props.emprendedor.descripcion}</p>
            <p>{props.emprendedor.nombreEmprendimiento}</p>
            <p>{props.emprendedor.email}</p>
            <p>{props.emprendedor.telefono}</p>
            <button>Ver Perfil</button>
        </div>
    );
}
export default CardEmprendedor;