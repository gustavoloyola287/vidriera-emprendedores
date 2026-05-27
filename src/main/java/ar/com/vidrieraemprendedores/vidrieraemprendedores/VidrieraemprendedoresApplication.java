package ar.com.vidrieraemprendedores.vidrieraemprendedores;

import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController

public class VidrieraemprendedoresApplication {

	public static void main(String[] args) {
		SpringApplication.run(VidrieraemprendedoresApplication.class, args);
	}

	@GetMapping(path = "/")
	public List<String> hello() {
		return List.of("Hello, World!");
	}

}
