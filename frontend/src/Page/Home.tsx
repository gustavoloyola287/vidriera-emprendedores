import { useEffect, useState } from "react";
import { ProductosDestacados } from "../components/productosdestacados";
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

    // ✅ CORREGIDO: Ahora usa la ruta en plural "/emprendedores" para coincidir con App.tsx
    const verPerfil = (idEmprendedor?: number) => {
        if (idEmprendedor) {
            navigate(`/emprendedores/${idEmprendedor}`);
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
        const imagen = prod.fotoPrincipal?.imagenBase64;

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
            
            <ProductosDestacados />

            <div className="filtros-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Buscar por producto, categoría o emprendedor..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ flex: 1, minWidth: '250px', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc' }}
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

            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

            {cargando ? (
                <p>Cargando catálogo...</p>
            ) : productosFiltrados.length === 0 ? (
                <p style={{ marginTop: '2rem' }}>No se encontraron productos que coincidan con la búsqueda.</p>
            ) : (
                <div className="cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {productosFiltrados.map((prod) => {
                        const srcImg = obtenerImagenSrc(prod);
                        return (
                            <div className="card-emprendedor" key={prod.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                {srcImg ? (
                                    <img 
                                        src={srcImg} 
                                        alt={prod.nombre} 
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '200px', backgroundColor: '#f4f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                        Sin imagen
                                    </div>
                                )}
                                
                                <div className="card-contenido" style={{ padding: '1rem' }}>
                                    <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{prod.nombre}</h2>

                                    {prod.nombreCategoria && (
                                        <span style={{
                                            display: 'inline-block',
                                            backgroundColor: '#E3F2FD',
                                            color: '#1565C0',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            marginBottom: '0.5rem'
                                        }}>
                                            {prod.nombreCategoria}
                                        </span>
                                    )}

                                    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>{prod.descripcion}</p>

                                    {prod.nombreEmprendedor && (
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                                            Emprendimiento: <strong>{prod.nombreEmprendedor}</strong>
                                        </p>
                                    )}

                                    <button 
                                        onClick={() => verPerfil(prod.idEmprendedor)}
                                        disabled={!prod.idEmprendedor}
                                        style={{ 
                                            width: '100%', 
                                            padding: '0.6rem', 
                                            backgroundColor: prod.idEmprendedor ? '#0051a8' : '#ccc', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '6px', 
                                            cursor: prod.idEmprendedor ? 'pointer' : 'not-allowed',
                                            fontWeight: 'bold'
                                        }}
                                    >
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