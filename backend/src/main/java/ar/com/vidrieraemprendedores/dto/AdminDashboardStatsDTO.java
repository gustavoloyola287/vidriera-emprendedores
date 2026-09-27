package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AdminDashboardStatsDTO {
    private long totalEmprendedores;
    private long emprendedoresActivos;
    private long emprendedoresSuspendidos;
    private long totalAdmins;
    private long emprendedoresRechazados;
    private long totalProductos;
    private long productosPendientes;
}