import React, { useState, useEffect } from 'react';

// Estructura que retorna FotoController (/api/fotos)
export interface FotoProducto {
    id: number;
    rutaFoto?: string;
    imagenBase64?: string;
}

export interface ProductoDTO {
    id: number;
    nombre: string;
    descripcion?: string;
    precio?: number;
    nombreEmprendedor?: string;
    idEmprendedor?: number;
    nombreCategoria?: string;
    fotoPrincipal?: FotoProducto;
    fotos?: FotoProducto[]; // Se llena dinámicamente llamando a FotoController
    destacado?: boolean;
}

// Datos MOCK de respaldo si la API falla
const MOCK_DESTACADOS: ProductoDTO[] = [
    {
        id: 101,
        nombre: 'AlfaJores Artesanales Carlos Paz',
        descripcion: 'Caja x 12 unidades elaboradas con chocolate premium local.',
        precio: 4500,
        nombreEmprendedor: 'Delicias de las Sierras',
        nombreCategoria: 'Gastronomía',
        destacado: true
    },
    {
        id: 102,
        nombre: 'Buzo Tejido de Lana de Oveja',
        descripcion: 'Prenda hecha a mano con técnicas tradicionales de tejido.',
        precio: 18000,
        nombreEmprendedor: 'Tejidos Punilla',
        nombreCategoria: 'Indumentaria',
        destacado: true
    },
    {
        id: 103,
        nombre: 'Mate Cincelado en Alpaca',
        descripcion: 'Calabaza seleccionada con virola de alpaca trabajada.',
        precio: 12500,
        nombreEmprendedor: 'Artesanías El Reloj',
        nombreCategoria: 'Artesanías',
        destacado: true
    }
];

export const ProductosDestacados: React.FC = () => {
    const [destacados, setDestacados] = useState<ProductoDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // 1. Cargar productos destacados Y sus fotos desde FotoController
    useEffect(() => {
        const fetchDestacadosYFotos = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/productos/destacados');
                if (!res.ok) throw new Error('Respuesta HTTP no OK');
                
                const productosData: ProductoDTO[] = await res.json();
                const listaProductos = productosData.length > 0 ? productosData : MOCK_DESTACADOS;

                // CONEXIÓN A FotoController: Peticiones en paralelo para las fotos de cada producto
                const productosConFotos = await Promise.all(
                    listaProductos.map(async (prod) => {
                        try {
                            const resFotos = await fetch(`http://localhost:8080/api/fotos/producto/${prod.id}`);
                            if (resFotos.ok) {
                                const fotos: FotoProducto[] = await resFotos.json();
                                return {
                                    ...prod,
                                    fotos,
                                    fotoPrincipal: fotos.length > 0 ? fotos[0] : prod.fotoPrincipal
                                };
                            }
                        } catch (e) {
                            console.warn(`No se pudieron cargar fotos para el producto ID ${prod.id}`, e);
                        }
                        return prod;
                    })
                );

                setDestacados(productosConFotos);
            } catch (error) {
                console.warn('No se pudieron obtener productos destacados del servidor. Usando MOCK.', error);
                setDestacados(MOCK_DESTACADOS);
            } finally {
                setLoading(false);
            }
        };

        fetchDestacadosYFotos();
    }, []);

    // 2. Transición automática del carrusel cada 5 segundos
    useEffect(() => {
        if (destacados.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % destacados.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [destacados]);

    // 3. Navegación manual
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? destacados.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % destacados.length);
    };

    // 4. Formateador de imágenes (Soporta Base64 o URL completa de la API)
    const obtenerImagenSrc = (prod: ProductoDTO) => {
        const foto = prod.fotoPrincipal;
        if (!foto) return null;

        // Si viene como string Base64
        if (foto.imagenBase64 && foto.imagenBase64.trim() !== '') {
            return foto.imagenBase64.startsWith('data:') || foto.imagenBase64.startsWith('http')
                ? foto.imagenBase64
                : `data:image/jpeg;base64,${foto.imagenBase64}`;
        }

        // Si viene como URL/Ruta desde el servidor
        if (foto.rutaFoto && foto.rutaFoto.trim() !== '') {
            return foto.rutaFoto.startsWith('http')
                ? foto.rutaFoto
                : `http://localhost:8080/${foto.rutaFoto}`;
        }

        return null;
    };

    if (loading) return null;
    if (destacados.length === 0) return null;

    const productoActual = destacados[currentIndex];
    const imgSrc = obtenerImagenSrc(productoActual);

    return (
        <section className="carrusel-destacados-container" style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.titulo}>⭐ Productos Destacados</h2>
                <span style={styles.badge}>Recomendados de la Semana</span>
            </div>

            <div style={styles.card}>
                {/* Botón Anterior */}
                <button onClick={handlePrev} style={{ ...styles.navBtn, left: '10px' }} title="Anterior">
                    ❮
                </button>

                {/* Contenido principal del producto */}
                <div style={styles.contentGrid}>
                    <div style={styles.imageContainer}>
                        {imgSrc ? (
                            <img src={imgSrc} alt={productoActual.nombre} style={styles.image} />
                        ) : (
                            <div style={styles.placeholderImage}>
                                📸 {productoActual.nombreCategoria || 'Vidriera VCP'}
                            </div>
                        )}
                    </div>

                    <div style={styles.infoContainer}>
                        {productoActual.nombreCategoria && (
                            <span style={styles.categoriaTag}>{productoActual.nombreCategoria}</span>
                        )}
                        <h3 style={styles.prodTitulo}>{productoActual.nombre}</h3>
                        {productoActual.nombreEmprendedor && (
                            <p style={styles.emprendedorText}>
                                Por: <strong>{productoActual.nombreEmprendedor}</strong>
                            </p>
                        )}
                        {productoActual.descripcion && (
                            <p style={styles.descripcion}>{productoActual.descripcion}</p>
                        )}
                        {productoActual.precio && (
                            <p style={styles.precio}>${productoActual.precio.toLocaleString('es-AR')}</p>
                        )}
                    </div>
                </div>

                {/* Botón Siguiente */}
                <button onClick={handleNext} style={{ ...styles.navBtn, right: '10px' }} title="Siguiente">
                    ❯
                </button>
            </div>

            {/* Indicadores / Puntos (Dots) */}
            <div style={styles.dotsContainer}>
                {destacados.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            ...styles.dot,
                            backgroundColor: index === currentIndex ? '#0051a8' : '#ccc',
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

// Estilos en línea
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1100px',
        margin: '0 auto 2rem auto',
        padding: '1rem',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    titulo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#0D2B45',
        margin: 0,
    },
    badge: {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    card: {
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        minHeight: '280px',
        display: 'flex',
        alignItems: 'center',
    },
    navBtn: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(13, 43, 69, 0.7)',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        width: '100%',
        padding: '1.5rem 3.5rem',
        gap: '1.5rem',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '220px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholderImage: {
        color: '#888',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    categoriaTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#E3F2FD',
        color: '#1565C0',
        padding: '0.2rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    prodTitulo: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#1a1a1a',
        margin: 0,
    },
    emprendedorText: {
        margin: 0,
        color: '#555',
        fontSize: '0.95rem',
    },
    descripcion: {
        color: '#666',
        fontSize: '0.9rem',
        margin: '0.5rem 0',
        lineHeight: '1.4',
    },
    precio: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#0078a8',
        margin: 0,
    },
    dotsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '1rem',
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'background-color 0.3s',
    },
};

export default ProductosDestacados;