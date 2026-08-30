package ar.com.vidrieraemprendedores.models;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "fotos_productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FotoProducto {

    @Id
    private String id;          // ID generado automáticamente por MongoDB (HexString)
    private Long productoId;    // ID del producto en PostgreSQL (Clave Foránea lógica)
    private String url;         // URL o Base64/Binario de la imagen
    private boolean esPrincipal;
}