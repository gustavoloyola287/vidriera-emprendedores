import { type Emprendedor } from "../Types/Emprendedor";
import CardEmprendedor from "../Components/CardEmprendedor";
function Home (){
const emprendedores : Emprendedor [] = [
    {
    id: 1,
    nombreCompleto: "Panadería Ana",
    descripcion: "Tortas artesanales",
    nombreEmprendimiento: "Panadería Ana",
    email: "panaderiaana@email.com",
    telefono: "351123456"

    },
    {
    id: 2,
    nombreCompleto: "Tejidos Marta",
    descripcion: "Amigurumis tejidos a mano",
    nombreEmprendimiento: "Tejidos Marta",
    email: "tejidosmarta@email.com",
    telefono: "351987654"
    }
];
const verPerfil = (id: number) => {
    console.log("Ver perfil del emprendedor con ID:", id);
    
}
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
    emprendedor = {emprendedor}
    verPerfil = {verPerfil}
    />
    
    
))}
</div>
);
}
export default Home