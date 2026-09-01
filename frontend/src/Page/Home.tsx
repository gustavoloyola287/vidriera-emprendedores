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

export interface Categoria {
    id: number;
    nombre: string;
}

function Home() {
    const [productos, setProductos] = useState<ProductoDTO[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("todas");
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                // Cargamos productos y categorías en paralelo
                const [respProductos, respCategorias] = await Promise.all([
                    fetch("http://localhost:8080/api/productos"),
                    fetch("http://localhost:8080/api/categorias")
                ]);

                if (!respProductos.ok) {
                    throw new Error("Error al obtener los productos del catálogo");
                }

                const datosProductos: ProductoDTO[] = await respProductos.json();
                setProductos(datosProductos);

                if (respCategorias.ok) {
                    const datosCategorias: Categoria[] = await respCategorias.json();
                    setCategorias(datosCategorias);
                }
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los datos de la vidriera.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatosIniciales();
    }, []);

    const verPerfil = (idEmprendedor?: number) => {
        if (idEmprendedor) {
            navigate(`/emprendedor/${idEmprendedor}`);
        }
    };

    // Filtro combinado: por texto y por dropdown de categoría
    const productosFiltrados = productos.filter((prod) => {
        const termino = busqueda.toLowerCase();
        const coincideTexto =
            prod.nombre.toLowerCase().includes(termino) ||
            prod.descripcion?.toLowerCase().includes(termino) ||
            prod.nombreEmprendedor?.toLowerCase().includes(termino) ||
            prod.nombreCategoria?.toLowerCase().includes(termino);

        const coincideCat =
            categoriaSeleccionada === "todas" ||
            prod.idCategoria?.toString() === categoriaSeleccionada ||
            prod.nombreCategoria === categoriaSeleccionada;

        return coincideTexto && coincideCat;
    });

    const obtenerImagenSrc = (prod: ProductoDTO) => {
        const imagen = prod.fotoPrincipal?.imagenBase64 || prod.urlImagen;

        if (imagen && imagen.trim() !== '') {
            return imagen.startsWith('data:') || imagen.startsWith('http')
                ? imagen
                : `data:image/jpeg;base64,${imagen}`;
        }
        
        return null;
    };

    return (
        <div className="home">
            <div className="home-header">
                <h1>Vidriera Virtual VCP</h1>
                <p>Explorá los productos y emprendimientos locales de Villa Carlos Paz.</p>
            </div>

            {/* Filtros de Búsqueda y Categoría */}
            <div className="filtros-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Buscar por producto, categoría o emprendedor..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ flex: 1, minWidth: '250px' }}
                />

                <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="error">{error}</p>}

            {cargando ? (
                <p>Cargando catálogo...</p>
            ) : productosFiltrados.length === 0 ? (
                <p style={{ marginTop: '2rem' }}>No se encontraron productos que coincidan con la búsqueda.</p>
            ) : (
                <div className="cards-container">
                    {productosFiltrados.map((prod) => {
                        const srcImg = obtenerImagenSrc(prod);
                        return (
                            <div className="card-emprendedor" key={prod.id}>
                                {srcImg && (
                                    <img 
                                        src={srcImg} 
                                        alt={prod.nombre} 
                                    />
                                )}
                                
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Home;