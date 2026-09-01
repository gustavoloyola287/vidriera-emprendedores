import axios from 'axios';
import type { Emprendedor } from '../types/Emprendedor';

const API_URL = 'http://localhost:8080/api/emprendedores';

export const emprendedorService = {
    getAll: async (): Promise<Emprendedor[]> => {
        const response = await axios.get<Emprendedor[]>(API_URL);
        return response.data;
    },

    getById: async (id: number): Promise<Emprendedor> => {
        const response = await axios.get<Emprendedor>(`${API_URL}/${id}`);
        return response.data;
    }
};

export default emprendedorService;