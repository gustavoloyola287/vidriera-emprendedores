import axios from 'axios';
import type { Producto, Categoria } from '../types/Producto';

const API_URL = 'http://localhost:8080/api/productos';
const API_CATEGORIAS_URL = 'http://localhost:8080/api/categorias';
const API_FOTOS_URL = 'http://localhost:8080/api/fotos';

// Interfaz exportable para manejar las fotografías desde FotoController
export interface FotoProducto {
  id: number;
  rutaFoto?: string;
  imagenBase64?: string;
  productoId?: number;
}

// Helper para limpiar comillas extras del token si viene de JSON.stringify
const getCleanToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return token.replace(/^"(.*)"$/, '$1'); // Elimina comillas envolventes si las hay
};

// Configuración de Headers con el Token JWT de localStorage
const getAuthHeaders = (isMultipart = false) => {
  const token = getCleanToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
    },
  };
};

export const productoService = {
  // ---------------------------------------------------------------------------
  // MÉTODOS DE PRODUCTOS Y CATEGORÍAS
  // ---------------------------------------------------------------------------

  // Obtener todos los productos para la vidriera principal (público)
  getAll: async (): Promise<Producto[]> => {
    const response = await axios.get<Producto[]>(API_URL);
    return response.data;
  },

  // Obtener categorías desde /api/categorias
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await axios.get<Categoria[]>(API_CATEGORIAS_URL);
    return response.data;
  },

  // Obtener productos filtrados por ID de categoría
  getProductosPorCategoria: async (categoriaId: number | string): Promise<Producto[]> => {
    const response = await axios.get<Producto[]>(`${API_URL}/categoria/${categoriaId}`);
    return response.data;
  },

  // Obtener productos de un emprendedor específico
  getByEmprendedor: async (emprendedorId: number): Promise<Producto[]> => {
    const response = await axios.get<Producto[]>(
      `${API_URL}/emprendedor/${emprendedorId}`, 
      getAuthHeaders()
    );
    return response.data;
  },

  // Crear un nuevo producto sin foto (JSON plano)
  create: async (producto: Partial<Producto>): Promise<Producto> => {
    const response = await axios.post<Producto>(API_URL, producto, getAuthHeaders());
    return response.data;
  },

  // Crear un nuevo producto CON FOTO para MongoDB (Multipart Form-Data)
  createConFoto: async (formData: FormData): Promise<Producto> => {
    const response = await axios.post<Producto>(
      `${API_URL}/con-foto`, 
      formData, 
      getAuthHeaders(true)
    );
    return response.data;
  },

  // Eliminar un producto por ID (requiere auth)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  },

  // ---------------------------------------------------------------------------
  // MÉTODOS DIRECTOS CON FotoController (/api/fotos)
  // ---------------------------------------------------------------------------

  // GET /api/fotos/producto/{productoId} -> Obtener la galería de fotos de un producto
  getFotosByProducto: async (productoId: number): Promise<FotoProducto[]> => {
    const response = await axios.get<FotoProducto[]>(
      `${API_FOTOS_URL}/producto/${productoId}`
    );
    return response.data;
  },

  // POST /api/fotos -> Guardar/Subir una nueva foto asociada a un producto
  guardarFoto: async (fotoData: { productoId: number; imagenBase64?: string; rutaFoto?: string }): Promise<FotoProducto> => {
    const response = await axios.post<FotoProducto>(
      API_FOTOS_URL, 
      fotoData, 
      getAuthHeaders()
    );
    return response.data;
  },

  // DELETE /api/fotos/{id} -> Eliminar una foto individual por ID
  deleteFoto: async (fotoId: number): Promise<void> => {
    await axios.delete(`${API_FOTOS_URL}/${fotoId}`, getAuthHeaders());
  }
};

export default productoService;