package com.presentacion.ms_patron.config;

import jakarta.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.presentacion.ms_patron.model.Ciudadano;
import com.presentacion.ms_patron.repository.CiudadanoRepository;

@Component
public class DataInitializer {

    private final CiudadanoRepository ciudadanoRepository;

    public DataInitializer(CiudadanoRepository ciudadanoRepository) {
        this.ciudadanoRepository = ciudadanoRepository;
    }

    @PostConstruct
    public void init() {

        if (ciudadanoRepository.count() == 0) {
            Ciudadano c1 = new Ciudadano("Juan", "Perez", "12345678", "juan.perez@email.com", "Av. Siempre Viva 123");
            Ciudadano c2 = new Ciudadano("Maria", "Gonzalez", "87654321", "maria.gonzalez@email.com", "Calle Falsa 456");
            Ciudadano c3 = new Ciudadano("Carlos", "Rodriguez", "11223344", "carlos.rodriguez@email.com", "Av. Libertador 789");
            Ciudadano c4 = new Ciudadano("Ana", "Martinez", "44332211", "ana.martinez@email.com", "Calle Real 321");
            Ciudadano c5 = new Ciudadano("Luis", "Fernandez", "55667788", "luis.fernandez@email.com", "Av. Corrientes 555");

            ciudadanoRepository.saveAll(java.util.List.of(c1, c2, c3, c4, c5));
        }
    }
}