package ar.com.vidrieraemprendedores.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmprendedorDashboardStatsDTO {
    private long totalProductos;
    private long maxProductosPermitidos; // 5 por regla de negocio
    private long visitasTotales;         // Si tenés contador de visitas
    private long consultasRecibidas;     // Para la sección de mensajes/consultas
    private long consultasSinLeer;
}