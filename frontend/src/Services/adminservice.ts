// Define la interfaz de TypeScript idéntica al DTO de Java
export interface AdminDashboardStatsDTO {
    totalEmprendedores: number;
    totalProductos: number;
    productosPendientes: number;
    emprendedoresActivos: number;
    emprendedoresSuspendidos: number;
    emprendedoresAdmins: number;
    emprendedoresRechazados: number;
    }

    const API_BASE_URL = 'http://localhost:3000//api/admin';

    export const getDashboardStats = async (): Promise<AdminDashboardStatsDTO> => {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error('Error al cargar las métricas del panel de administración');
    }
    return response.json();
};