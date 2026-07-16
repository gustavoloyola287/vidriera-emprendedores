import { Emprendedor } from "../Types/Emprendedor";
import CardEmprendedor from "../Components/CardEmprendedor";
function Home (){
const emprendedores : Emprendedor [] = [
    {
    id: 1,
    nombre: "Panadería Ana",
    descripcion: "Tortas artesanales",
    imagenUrl: "",
    contacto: "351123456",
    redesSociales: "@panaderiaana",
    activo: true
    },
    {
    id: 2,
    nombre: "Tejidos Marta",
    descripcion: "Amigurumis tejidos a mano",
    imagenUrl: "",
    contacto: "351987654",
    redesSociales: "@tejidosmarta",
    activo: true
    }
];
return (
    <div>

    <h1>Vidriera Virtual VCP</h1>

    <input
        type="text"
        placeholder="Buscar emprendimiento..."
    />

    {emprendedores.map((emprendedor) => (
    <CardEmprendedor
    key= {emprendedor.id}
    emprendedor = {emprendedor}    />
    
    
))}
</div>
);
}
export default Home