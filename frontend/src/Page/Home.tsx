import { Emprendedor } from "../Types/Emprendedor";
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
return <div>(<h1>Vidriera virtual VCP</h1>)
    </div>;
<input type="Texto"
placeholder="Buscar emprendimiento "/>
{emprendedores.map ((emprendedor)=>((
    <div key={emprendedor.id}>
        <h2>{emprendedor.nombre}</h2>
        <p>{emprendedor.descripcion}</p>
    </div>
))}
}
export default Home