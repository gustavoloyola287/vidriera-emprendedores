export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Emprendedor {
  id: number;
  nombre?: string;
  email?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  categoria?: Categoria;
  emprendedor?: Emprendedor;
}