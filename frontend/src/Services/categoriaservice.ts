// src/services/categoriaService.ts

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
}

const API_CATEGORIAS_URL = 'http://localhost:8080/api/categorias';

export const getCategorias = async (): Promise<Categoria[]> => {
    const response = await fetch(API_CATEGORIAS_URL);
    if (!response.ok) {
        throw new Error('Error al obtener las categorías');
    }
    return response.json();
};