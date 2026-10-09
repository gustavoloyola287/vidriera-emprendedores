import React, { useState } from "react";
import { productoService } from "../services/productoService";
import { categoriaService } from "../services/categoriaservice";
import { emprendedorService } from "../services/emprendedorService";
import type { ProductoDTO } from "../types/Producto"; // Nota: Usamos ProductoDTO tal como lo devuelve tu ProductoController
import type { Categoria } from "../types/Categoria";
import type { Emprendedor } from "../types/Emprendedor";

    interface ResultadosGlobales {
    productos: ProductoDTO[];
    categorias: Categoria[];
    emprendedores: Emprendedor[];
    }

    interface SearchBarProps {
    onResultadosEncontrados: (resultados: ResultadosGlobales) => void;
    }

    export default function SearchBar({ onResultadosEncontrados }: SearchBarProps) {
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleBuscar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!terminoBusqueda.trim()) return;

        setCargando(true);
        try {
        const query = terminoBusqueda.toLowerCase().trim();

        // 1. Peticiones simultáneas a los endpoints REST de tu backend
        const [listaProductosDTO, listaCategorias, listaEmprendedores] = await Promise.all([
            productoService.getAll(), // Llama a GET /api/productos (retorna ProductoDTO[])
            categoriaService.listarCategorias(), // Llama a GET /api/categorias
            emprendedorService.getAll(), // Llama a GET /api/emprendedores
        ]);

        // 2. Filtrar Productos (DTO) por nombre, descripción o categoría
        const productosFiltrados = listaProductosDTO.filter(
            (prod: { nombre: string; descripcion: string; nombreCategoria: string; }) =>
            prod.nombre.toLowerCase().includes(query) ||
            prod.descripcion?.toLowerCase().includes(query) ||
            prod.nombreCategoria?.toLowerCase().includes(query)
        );

        // 3. Filtrar Categorías por nombre
        const categoriasFiltradas = listaCategorias.filter((cat: { nombre: string; }) =>
            cat.nombre.toLowerCase().includes(query)
        );

        // 4. Filtrar Emprendedores por nombre de emprendimiento o nombre completo
        const emprendedoresFiltrados = listaEmprendedores.filter(
            (emp: { nombreEmprendimiento: string; nombreCompleto: string; descripcion: string; }) =>
            emp.nombreEmprendimiento.toLowerCase().includes(query) ||
            emp.nombreCompleto.toLowerCase().includes(query) ||
            emp.descripcion?.toLowerCase().includes(query)
        );

        // 5. Enviar resultados consolidados hacia el componente contenedor o vista de búsqueda
        onResultadosEncontrados({
            productos: productosFiltrados,
            categorias: categoriasFiltradas,
            emprendedores: emprendedoresFiltrados,
        });
        } catch (error) {
        console.error("Error al ejecutar la búsqueda global:", error);
        } finally {
        setCargando(false);
        }
    };

    return (
        <form onSubmit={handleBuscar} className="w-100 position-relative">
        <div className="input-group">
            <input
            type="text"
            className="form-control form-control-lg rounded-pill px-4 shadow-sm border-0"
            placeholder="Buscar por producto, categoría o emprendedor..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            <button
            type="submit"
            className="btn btn-primary rounded-pill px-4 ms-2 fw-bold shadow-sm"
            disabled={cargando}
            >
            {cargando ? "Buscando..." : "🔍 Buscar"}
            </button>
        </div>
    </form>
);
}