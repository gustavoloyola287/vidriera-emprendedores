package ar.com.vidrieraemprendedores.service;

import java.util.List;
import ar.com.vidrieraemprendedores.dto.EmprendedorDTO;


public interface IEmprendedorService {

    List<EmprendedorDTO> traerEmprendedores();
    EmprendedorDTO crearEmprendedor(EmprendedorDTO emprendedorDTO);
    EmprendedorDTO actualizarEmprendedor(Long id, EmprendedorDTO emprendedorDTO);
    void eliminarEmprendedor(Long id);

}
