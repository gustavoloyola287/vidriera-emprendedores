package ar.com.vidrieraemprendedores.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.com.vidrieraemprendedores.repository.EmprendedorRepository;

@RestController
@RequestMapping("/api/emprendedores")

public class EmprendedorController {

    @Autowired
    private EmprendedorRepository emprendedorRepository;

    

}
