import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Emprendedor } from "../Types/Emprendedor";

function DetalleEmprendedor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [emprendedor, setEmprendedor] = useState<Emprendedor | null>(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarEmprendedor = async () => {
            try {
                const respuesta = await fetch(
                    `http://localhost:8080/api/emprendedores/${id}`
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudo obtener el emprendedor");
                }

                const datos: Emprendedor = await respuesta.json();

                setEmprendedor(datos);
            } catch (error) {
                console.error(error);
                setError("No se pudo cargar el perfil del emprendedor");
            } finally {
                setCargando(false);
            }
        };

        cargarEmprendedor();
    }, [id]);

    if (cargando) {
        return <p>Cargando perfil...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!emprendedor) {
        return <p>No se encontró el emprendedor.</p>;
    }

    return (
        <div>
            <h1>{emprendedor.nombreEmprendimiento}</h1>

            <div>
                <h2>Emprendedor</h2>
                <p>{emprendedor.nombreCompleto}</p>
            </div>

            <div>
                <h2>Descripción</h2>
                <p>{emprendedor.descripcion}</p>
            </div>

            <div>
                <h2>Contacto</h2>
                <p>Email: {emprendedor.email}</p>
                <p>Teléfono: {emprendedor.telefono}</p>
            </div>

            <button type="button" onClick={() => navigate("/")}>
                Volver
            </button>
        </div>
    );
}

export default DetalleEmprendedor;