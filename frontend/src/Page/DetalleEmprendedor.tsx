import { Emprendedor } from "../Types/Emprendedor";
interface DetalleEmprendedorprops  {
    emprendedor : Emprendedor;
}
function DetalleEmprendedorprops (props: DetalleEmprendedorprops){

    return(
        <div>
            <div><img src={props.emprendedor.imagenUrl} alt={props.emprendedor.nombre} /></div>
            <div><h1>{props.emprendedor.nombre}</h1>
            <p>{props.emprendedor.descripcion}</p>
            </div>
            <div>
            <p><h2>{props.emprendedor.contacto}</h2></p>
            <p>{props.emprendedor.redesSociales}</p>
            </div>
            <div><button>volver</button></div>
        </div>
    );

}
