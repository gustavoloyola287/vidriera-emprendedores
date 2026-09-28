import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productoService, type FotoProducto } from "../services/productoService";
import { type Emprendedor } from "../types/Emprendedor";
import type { Producto } from "../types/Producto";

export function DetalleEmprendedor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [emprendedor, setEmprendedor] = useState<Emprendedor | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    // Estado para el modal de ver galería completa de un producto
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [fotosGaleria, setFotosGaleria] = useState<FotoProducto[]>([]);
    const [cargandoGaleria, setCargandoGaleria] = useState(false);

    useEffect(() => {
        if (!id) return;

        const cargarDatos = async () => {
            setCargando(true);
            try {
                // 1. Cargar Datos del Emprendedor
                const resEmprendedor = await fetch(`http://localhost:8080/api/emprendedores/${id}`);
                if (!resEmprendedor.ok) {
                    throw new Error("No se pudo obtener el emprendedor");
                }
                const datosEmprendedor: Emprendedor = await resEmprendedor.json();
                setEmprendedor(datosEmprendedor);

                // 2. Cargar Productos del Emprendedor
                const listaProductos = await productoService.getByEmprendedor(Number(id));

                // 3. Enriquecer productos con la primera foto de FotoController
                const productosConFoto = await Promise.all(
                    listaProductos.map(async (prod) => {
                        if (!prod.id) return prod;
                        try {
                            const fotos = await productoService.getFotosByProducto(prod.id);
                            return {
                                ...prod,
                                fotoPrincipal: fotos.length > 0
                                    ? { ...fotos[0], id: String(fotos[0].id) }
                                    : prod.fotoPrincipal
                            };
                        } catch (err) {
                            console.warn(`Error al cargar fotos del producto #${prod.id}`, err);
                        }
                        return prod;
                    })
                );

                setProductos(productosConFoto);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el perfil del emprendedor o sus productos");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [id]);

    // Función para construir el enlace a WhatsApp con mensaje automático
    const obtenerLinkWhatsApp = (nombreProducto?: string) => {
        if (!emprendedor?.telefono) return "#";

        // Formatear el teléfono limpiando espacios, guiones y paréntesis
        const telefonoLimpio = emprendedor.telefono.replace(/\D/g, "");

        const textoMensaje = nombreProducto
            ? `Hola ${emprendedor.nombreEmprendimiento}, vi tu producto "${nombreProducto}" en la plataforma y me gustaría recibir más información.`
            : `Hola ${emprendedor.nombreEmprendimiento}, vi tu emprendimiento en la plataforma y quisiera ponerme en contacto.`;

        return `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(textoMensaje)}`;
    };

    // Abrir modal con la galería completa de fotos de un producto
    const handleVerGaleria = async (prod: Producto) => {
        setProductoSeleccionado(prod);
        setCargandoGaleria(true);
        try {
            if (prod.id) {
                const fotos = await productoService.getFotosByProducto(prod.id);
                setFotosGaleria(fotos);
            }
        } catch (err) {
            console.error("Error al obtener fotos de la galería:", err);
        } finally {
            setCargandoGaleria(false);
        }
    };

    const formatearImagenSrc = (foto?: { imagenBase64?: string; rutaFoto?: string }) => {
        if (!foto) return "https://via.placeholder.com/200";
        if (foto.imagenBase64) {
            return foto.imagenBase64.startsWith("data:")
                ? foto.imagenBase64
                : `data:image/jpeg;base64,${foto.imagenBase64}`;
        }
        if (foto.rutaFoto) {
            return foto.rutaFoto.startsWith("http")
                ? foto.rutaFoto
                : `http://localhost:8080/${foto.rutaFoto}`;
        }
        return "https://via.placeholder.com/200";
    };

    if (cargando) {
        return <div className="text-center py-5">Cargando perfil y catálogo de productos...</div>;
    }

    if (error) {
        return <div className="alert alert-danger m-4">{error}</div>;
    }

    if (!emprendedor) {
        return <div className="text-center py-5">No se encontró el emprendedor.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-5">
            <div className="container">
                {/* Cabecera del Emprendimiento */}
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="h2 font-bold text-gray-800 mb-1">{emprendedor.nombreEmprendimiento}</h1>
                            <p className="text-muted mb-2">
                                <strong>Emprendedor/a:</strong> {emprendedor.nombreCompleto}
                            </p>
                            <p className="mb-3">{emprendedor.descripcion}</p>
                            <p className="mb-3 text-secondary">
                                <strong>📞 Teléfono de Contacto:</strong> {emprendedor.telefono}
                            </p>
                            
                            {/* BOTÓN WHATSAPP GENERAL EN LA CABECERA */}
                            <a
                                href={obtenerLinkWhatsApp()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success fw-bold d-inline-flex align-items-center gap-2"
                            >
                                💬 Contactar por WhatsApp
                            </a>
                        </div>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/")}>
                            ← Volver
                        </button>
                    </div>
                </div>

                {/* Catálogo de Productos del Emprendedor */}
                <h2 className="h4 font-bold text-gray-800 mb-3">Catálogo de Productos</h2>

                {productos.length > 0 ? (
                    <div className="row g-4">
                        {productos.map((prod) => (
                            <div key={prod.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card h-100 shadow-sm border-0">
                                    <img
                                        src={formatearImagenSrc(prod.fotoPrincipal)}
                                        alt={prod.nombre}
                                        className="card-img-top"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title font-bold text-dark">{prod.nombre}</h5>
                                        <p className="card-text text-muted small flex-grow-1">{prod.descripcion}</p>
                                        
                                        {/* ACCIONES DE LA TARJETA */}
                                        <div className="d-flex flex-column gap-2 mt-3">
                                            <button
                                                className="btn btn-sm btn-outline-primary w-100"
                                                onClick={() => handleVerGaleria(prod)}
                                            >
                                                📷 Ver Imágenes
                                            </button>

                                            {/* BOTÓN WHATSAPP POR PRODUCTO */}
                                            <a
                                                href={obtenerLinkWhatsApp(prod.nombre)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-success w-100 fw-bold d-flex align-items-center justify-content-center gap-1"
                                            >
                                                💬 Consultar por WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded p-4 text-center text-muted">
                        Este emprendimiento aún no tiene productos exhibidos.
                    </div>
                )}

                {/* Modal de Galería de Fotos Pública */}
                {productoSeleccionado && (
                    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Galería: {productoSeleccionado.nombre}</h5>
                                    <button type="button" className="btn-close" onClick={() => setProductoSeleccionado(null)}></button>
                                </div>
                                <div className="modal-body">
                                    {cargandoGaleria ? (
                                        <div className="text-center py-4">Cargando fotos...</div>
                                    ) : fotosGaleria.length > 0 ? (
                                        <div className="row g-3">
                                            {fotosGaleria.map((foto) => (
                                                <div className="col-6 col-md-4" key={foto.id}>
                                                    <div className="card h-100 border-0 shadow-sm">
                                                        <img
                                                            src={formatearImagenSrc(foto)}
                                                            alt="Foto del producto"
                                                            className="rounded img-fluid"
                                                            style={{ height: "180px", objectFit: "cover", width: "100%" }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted py-3">No hay más fotos en la galería para este producto.</p>
                                    )}
                                </div>
                                <div className="modal-footer d-flex justify-content-between">
                                    {/* BOTÓN WHATSAPP DENTRO DEL MODAL */}
                                    <a
                                        href={obtenerLinkWhatsApp(productoSeleccionado.nombre)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success fw-bold d-inline-flex align-items-center gap-2"
                                    >
                                        💬 Consultar sobre este producto
                                    </a>
                                    <button type="button" className="btn btn-secondary" onClick={() => setProductoSeleccionado(null)}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetalleEmprendedor;