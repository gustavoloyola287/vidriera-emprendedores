import axios from 'axios';
import type { Producto, Categoria } from '../types/Producto';

const API_URL = 'http://localhost:8080/api/productos';
const API_CATEGORIAS_URL = 'http://localhost:8080/api/categorias';

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
  }
};

export default productoService;