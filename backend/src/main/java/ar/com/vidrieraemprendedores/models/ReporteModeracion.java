package ar.com.vidrieraemprendedores.models;

import org.springframework.data.annotation.Id;          // ⚠️ NO jakarta.persistence
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reportes_moderacion")
@CompoundIndex(def = "{'estado': 1, 'tipo': 1, 'fecha': -1}")
// Regla ESR: Equality (estado) → Equality (tipo) → Sort (fecha desc)
public class ReporteModeracion {

    @Id
    private String id;                       // ObjectId como String

    private String tipo;                     // CONTENIDO | COMENTARIO | USUARIO
    private String usuarioAfectado;
    private String reportadoPor;
    private String motivo;
    private String detalle;
    private String estado;                   // PENDIENTE | APROBADO | RECHAZADO
    private LocalDateTime fecha;
    private LocalDateTime resueltoEn;        // null hasta que se resuelve
    private String resueltoPor;              // email del admin que actuó

    public ReporteModeracion() {
        this.fecha = LocalDateTime.now();
        this.estado = "PENDIENTE";
    }

    // getters y setters de todos los campos
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getUsuarioAfectado() { return usuarioAfectado; }
    public void setUsuarioAfectado(String usuarioAfectado) { this.usuarioAfectado = usuarioAfectado; }
    public String getReportadoPor() { return reportadoPor; }
    public void setReportadoPor(String reportadoPor) { this.reportadoPor = reportadoPor; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public LocalDateTime getResueltoEn() { return resueltoEn; }
    public void setResueltoEn(LocalDateTime resueltoEn) { this.resueltoEn = resueltoEn; }
    public String getResueltoPor() { return resueltoPor; }
    public void setResueltoPor(String resueltoPor) { this.resueltoPor = resueltoPor; }
}