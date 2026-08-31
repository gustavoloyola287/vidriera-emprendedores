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

export interface FotoProducto {
  id?: string;
  productoId?: number;
  imagenBase64?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  imagenUrl?: string;
  fotoPrincipal?: FotoProducto;
  fotos?: FotoProducto[];
  categoria?: Categoria;
  emprendedor?: Emprendedor;
}