import axios from 'axios';
import type { Producto, Categoria } from '../types/Producto';

const API_URL = 'http://localhost:8080/api/productos';

export const productoService = {
  // Obtener todos los productos para la vidriera principal
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
    const response = await axios.get<Producto[]>(`${API_URL}/emprendedor/${emprendedorId}`);
    return response.data;
  },

  // Crear un nuevo producto
  create: async (producto: Partial<Producto>): Promise<Producto> => {
    const response = await axios.post<Producto>(API_URL, producto);
    return response.data;
  },

  // Eliminar un producto por ID
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default productoService;