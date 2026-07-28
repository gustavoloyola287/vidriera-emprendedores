import { Emprendedor } from "../Types/Emprendedor";
interface DetalleEmprendedorprops  {
    emprendedor : Emprendedor;
}
function DetalleEmprendedorprops (props: DetalleEmprendedorprops){

    return(
        <div>
            <div><img src="" alt="" /></div>
            <div><h1>props.emprendedor.nombre</h1></div>
            <p>props.emprendedor.descripcion</p>
        </div>
    );

}
