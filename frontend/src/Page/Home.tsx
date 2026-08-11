import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Emprendedor } from "../Types/Emprendedor";
import CardEmprendedor from "../Components/CardEmprendedor";

function Home() {
    const [emprendedores, setEmprendedores] = useState<Emprendedor[]>([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const cargarEmprendedores = async () => {
            try {
                const respuesta = await fetch(
                    "http://localhost:8080/api/emprendedores"
                );

                if (!respuesta.ok) {
                    throw new Error("Error al obtener los emprendedores");
                }

                const datos: Emprendedor[] = await respuesta.json();
                setEmprendedores(datos);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar los emprendedores");
            }
        };

        cargarEmprendedores();
    }, []);

    const verPerfil = (id: number) => {
        navigate(`/emprendedor/${id}`);
    };

    return (
        <>
            <h1>Vidriera Virtual VCP</h1>

            <input
                type="text"
                placeholder="Buscar emprendimiento..."
            />

            {error && <p>{error}</p>}

            {emprendedores.map((emprendedor) => (
                <CardEmprendedor
                    key={emprendedor.id}
                    emprendedor={emprendedor}
                    verPerfil={verPerfil}
                />
            ))}
        </>
    );
}

export default Home;