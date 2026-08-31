import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ProductoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    idEmprendedor?: number;
    nombreEmprendedor?: string;
    idCategoria?: number;
    nombreCategoria?: string;
    fotoPrincipal?: {
        imagenBase64?: string;
    };
    urlImagen?: string;
}

function Home() {
    const [productos, setProductos] = useState<ProductoDTO[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await fetch("http://localhost:8080/api/productos");

                if (!respuesta.ok) {
                    throw new Error("Error al obtener los productos del catálogo");
                }

                const datos: ProductoDTO[] = await respuesta.json();
                setProductos(datos);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los productos de la vidriera.");
            } finally {
                setCargando(false);
            }
        };

        cargarProductos();
    }, []);

    const verPerfil = (idEmprendedor?: number) => {
        if (idEmprendedor) {
            navigate(`/emprendedor/${idEmprendedor}`);
        }
    };

    const productosFiltrados = productos.filter((prod) => {
        const termino = busqueda.toLowerCase();
        const coincideNombre = prod.nombre.toLowerCase().includes(termino);
        const coincideDesc = prod.descripcion?.toLowerCase().includes(termino);
        const coincideEmprendedor = prod.nombreEmprendedor?.toLowerCase().includes(termino);
        const coincideCategoria = prod.nombreCategoria?.toLowerCase().includes(termino);
        
        return coincideNombre || coincideDesc || coincideEmprendedor || coincideCategoria;
    });

    const obtenerImagenSrc = (prod: ProductoDTO) => {
        const imagen = prod.fotoPrincipal?.imagenBase64 || prod.urlImagen;

        if (imagen && imagen.trim() !== '') {
            return imagen.startsWith('data:') || imagen.startsWith('http')
                ? imagen
                : `data:image/jpeg;base64,${imagen}`;
        }
        
        // Muestra una imagen por defecto mientras no haya fotos cargadas en Mongo
        return null;
    };

    return (
        <div className="home">
            <div className="home-header">
                <h1>Vidriera Virtual VCP</h1>
                <p>Explorá los productos y emprendimientos locales de Villa Carlos Paz.</p>
            </div>

            <input
                type="text"
                placeholder="Buscar por producto, categoría o emprendedor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            {cargando ? (
                <p>Cargando catálogo...</p>
            ) : productosFiltrados.length === 0 ? (
                <p style={{ marginTop: '2rem' }}>No se encontraron productos que coincidan con la búsqueda.</p>
            ) : (
                <div className="cards-container">
                    {productosFiltrados.map((prod) => (
                        <div className="card-emprendedor" key={prod.id}>
                            <img 
                                src={obtenerImagenSrc(prod)!} 
                               // alt={prod.nombre} 
                            />
                            {/* Recuadro alternativo simple mientras no haya fotos subidas */}
                            <div style={{
                                height: '160px',
                                backgroundColor: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#94a3b8',
                                fontSize: '0.9rem',
                                borderBottom: '1px solid #e2e8f0'
                            }}>
                                Sin imagen disponible
                            </div>
                            
                            <div className="card-contenido">
                                <h2>{prod.nombre}</h2>

                                {prod.nombreCategoria && (
                                    <span style={{
                                        display: 'inline-block',
                                        backgroundColor: 'var(--azul-claro)',
                                        color: 'var(--azul-marino)',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        marginBottom: '0.5rem'
                                    }}>
                                        {prod.nombreCategoria}
                                    </span>
                                )}

                                <p>{prod.descripcion}</p>

                                {prod.nombreEmprendedor && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--gris-texto)', marginBottom: '1rem' }}>
                                        Emprendimiento: <strong>{prod.nombreEmprendedor}</strong>
                                    </p>
                                )}

                                <button onClick={() => verPerfil(prod.idEmprendedor)}>
                                    Ver Perfil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;