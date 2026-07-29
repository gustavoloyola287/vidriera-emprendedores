import { Emprendedor } from "../Types/Emprendedor";
interface DetalleEmprendedorprops  {
    emprendedor : Emprendedor;
}
function DetalleEmprendedor (props: DetalleEmprendedorprops){

    return(
        <div>
            <div><img src={props.emprendedor.imagenUrl} alt={props.emprendedor.nombre} /></div>
            <div><h1>{props.emprendedor.nombre}</h1>
            <p>{props.emprendedor.descripcion}</p>
            </div>
            <div>
                <h2>contacto</h2>
            <p>{props.emprendedor.contacto}</p>
                <h3>Redes Sociales</h3>
            <p>{props.emprendedor.redesSociales}</p>
            </div>
            <div><button>volver</button></div>
        </div>
    );

}
export default DetalleEmprendedor
