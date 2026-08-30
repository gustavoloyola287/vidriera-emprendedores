import axios from 'axios';

const API_FOTOS_URL = 'http://localhost:8080/api/fotos';

export interface FotoProducto {
  id?: string;
  productoId: number;
  url: string;
  esPrincipal: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export const fotoService = {
  // Obtener fotos de un producto por su ID
  getByProducto: async (productoId: number): Promise<FotoProducto[]> => {
    const response = await axios.get<FotoProducto[]>(`${API_FOTOS_URL}/producto/${productoId}`);
    return response.data;
  },

  // Guardar una nueva foto en MongoDB
  save: async (foto: FotoProducto): Promise<FotoProducto> => {
    const response = await axios.post<FotoProducto>(API_FOTOS_URL, foto, getAuthHeaders());
    return response.data;
  },

  // Eliminar foto de MongoDB
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_FOTOS_URL}/${id}`, getAuthHeaders());
  }
};

export default fotoService;