import { type Emprendedor } from "../Types/Emprendedor";

interface CardEmprendedorProps{
    emprendedor:Emprendedor;
}
function CardEmprendedor (props: CardEmprendedorProps){
    return (
        <div>
            <img src={props.emprendedor.imagenUrl} alt={props.emprendedor.nombre} />
            <h1>{props.emprendedor.nombre}</h1>
            <p>{props.emprendedor.descripcion}</p>
            <button>Ver Perfil</button>
        </div>
    );
}
export default CardEmprendedor;