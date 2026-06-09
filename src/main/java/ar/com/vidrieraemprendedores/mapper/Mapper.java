package ar.com.vidrieraemprendedores.mapper;

import ar.com.vidrieraemprendedores.dto.EmprendedorDTO;
import ar.com.vidrieraemprendedores.model.Emprendedor;

public class Mapper {

    //Mapeo de Emprendedor a EmprendedorDTO
    public static EmprendedorDTO toDTO(Emprendedor e) {
        if (e == null) {
        return null;
        }
        return EmprendedorDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .imagenUrl(e.getImagenUrl())
                .contacto(e.getContacto())
                .redesSociales(e.getRedesSociales())
                .build();
    }

}
