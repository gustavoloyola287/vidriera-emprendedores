import { type Emprendedor } from "../Types/Emprendedor";
interface DetalleEmprendedorProps  {
    emprendedor : Emprendedor;
}
function DetalleEmprendedor (props: DetalleEmprendedorProps){

    return(
        <div>
            
            <div><h1>{props.emprendedor.nombreCompleto}</h1>
            <p>{props.emprendedor.descripcion}</p>
            </div>
            <div>
                <h2>contacto</h2>
            <p>{props.emprendedor.email}</p>
            <p>{props.emprendedor.telefono}</p>
            </div>
            <div><button>volver</button></div>
        </div>
    );

}
export default DetalleEmprendedor
