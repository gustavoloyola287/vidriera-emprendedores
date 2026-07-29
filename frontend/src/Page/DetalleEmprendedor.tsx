import { Emprendedor } from "../Types/Emprendedor";
interface DetalleEmprendedorprops  {
    emprendedor : Emprendedor;
}
function DetalleEmprendedorprops (props: DetalleEmprendedorprops){

    return(
        <div>
            <div><img src={props.emprendedor.imagenUrl} alt={props.emprendedor.nombre} /></div>
            <div><h1>{props.emprendedor.nombre}</h1></div>
            <p>{props.emprendedor.descripcion}</p>
            <p>{props.emprendedor.contacto}</p>
            <p>{props.emprendedor.redesSociales}</p>
        </div>
    );

}
