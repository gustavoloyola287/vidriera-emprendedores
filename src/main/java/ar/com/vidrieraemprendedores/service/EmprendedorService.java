package ar.com.vidrieraemprendedores.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ar.com.vidrieraemprendedores.dto.EmprendedorDTO;
import ar.com.vidrieraemprendedores.exception.NotFoundException;
import ar.com.vidrieraemprendedores.mapper.Mapper;
import ar.com.vidrieraemprendedores.model.Emprendedor;
import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;


@Service
public class EmprendedorService implements IEmprendedorService{

    @Autowired
    private EmprendedorRepository repo;

    public List<EmprendedorDTO> traerEmprendedores() {
        // Implementación para traer emprendedores
        return repo.findAll().stream().map(Mapper::toDTO).toList();
    }

    @Override
    public EmprendedorDTO crearEmprendedor(EmprendedorDTO emprendedorDTO) {
        // Implementación para crear un nuevo emprendedor
       var emprendedor = Emprendedor.builder()
                .nombre(emprendedorDTO.getNombre())
                .descripcion(emprendedorDTO.getDescripcion())
                .imagenUrl(emprendedorDTO.getImagenUrl())
                .contacto(emprendedorDTO.getContacto())
                .redesSociales(emprendedorDTO.getRedesSociales())
                .build();
        
        return Mapper.toDTO(repo.save(emprendedor));
    }

    @Override
    public EmprendedorDTO actualizarEmprendedor(Long id, EmprendedorDTO emprendedorDTO) {
        //Vamos a buscar el emprendedor por su ID, si existe lo actualizamos, sino lanzamos una excepción
        Emprendedor emprendedor = repo.findById(id)
        .orElseThrow(() -> new NotFoundException("Emprendedor no encontrado"));
        emprendedor.setNombre(emprendedorDTO.getNombre());
        emprendedor.setDescripcion(emprendedorDTO.getDescripcion());
        emprendedor.setImagenUrl(emprendedorDTO.getImagenUrl());
        emprendedor.setContacto(emprendedorDTO.getContacto());
        emprendedor.setRedesSociales(emprendedorDTO.getRedesSociales());

        return Mapper.toDTO(repo.save(emprendedor));
    }

    @Override
    public void eliminarEmprendedor(Long id) {
        // Implementación para eliminar un emprendedor por su ID
        if (!repo.existsById(id)) {
            throw new NotFoundException("Emprendedor no encontrado");
        }
        repo.deleteById(id);
    }

}
