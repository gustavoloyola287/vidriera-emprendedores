import axios from 'axios';
import type { Producto, Categoria } from '../types/Producto';

const API_URL = 'http://localhost:8080/api/productos';

// Configuración de Headers con el Token JWT de localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export const productoService = {
  // Obtener todos los productos para la vidriera principal (público)
  getAll: async (): Promise<Producto[]> => {
    const response = await axios.get<Producto[]>(API_URL);
    return response.data;
  },

  // Obtener categorías 
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await axios.get<Categoria[]>(`${API_URL}/categorias`);
    return response.data;
  },

  // Obtener productos de un emprendedor específico
  getByEmprendedor: async (emprendedorId: number): Promise<Producto[]> => {
    // Si tu endpoint en Spring Boot es /api/productos/emprendedor/{id}
    const response = await axios.get<Producto[]>(
      `${API_URL}/emprendedor/${emprendedorId}`, 
      getAuthHeaders()
    );
    return response.data;
  },

  // Crear un nuevo producto (requiere auth)
  create: async (producto: Partial<Producto>): Promise<Producto> => {
    const response = await axios.post<Producto>(API_URL, producto, getAuthHeaders());
    return response.data;
  },

  // Eliminar un producto por ID (requiere auth)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  }
};

export default productoService;