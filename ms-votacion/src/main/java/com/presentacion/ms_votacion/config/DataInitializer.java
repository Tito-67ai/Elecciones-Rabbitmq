package com.presentacion.ms_votacion.config;

import java.time.LocalDate;

import jakarta.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.presentacion.ms_votacion.model.Candidato;
import com.presentacion.ms_votacion.model.Eleccion;
import com.presentacion.ms_votacion.repository.CandidatoRepository;
import com.presentacion.ms_votacion.repository.EleccionRepository;

@Component
public class DataInitializer {

    private final EleccionRepository eleccionRepository;
    private final CandidatoRepository candidatoRepository;

    public DataInitializer(EleccionRepository eleccionRepository, CandidatoRepository candidatoRepository) {
        this.eleccionRepository = eleccionRepository;
        this.candidatoRepository = candidatoRepository;
    }

    @PostConstruct
    public void init() {

        if (eleccionRepository.count() == 0) {
            Eleccion e1 = new Eleccion("Elecciones Presidenciales 2025", "Eleccion nacional para presidente", LocalDate.of(2025, 10, 26));
            Eleccion e2 = new Eleccion("Elecciones Legislativas 2025", "Renovacion parcial del congreso", LocalDate.of(2025, 10, 26));
            Eleccion e3 = new Eleccion("Elecciones Municipales 2025", "Intendentes y concejales", LocalDate.of(2025, 11, 9));

            eleccionRepository.saveAll(java.util.List.of(e1, e2, e3));

            Candidato c1 = new Candidato("Javier", "Milei", "La Libertad Avanza", e1.getId());
            Candidato c2 = new Candidato("Sergio", "Massa", "Union por la Patria", e1.getId());
            Candidato c3 = new Candidato("Patricia", "Bullrich", "Juntos por el Cambio", e1.getId());

            Candidato c4 = new Candidato("Candidato", "Diputado A", "Partido A", e2.getId());
            Candidato c5 = new Candidato("Candidato", "Diputado B", "Partido B", e2.getId());

            Candidato c6 = new Candidato("Intendente", "Ciudad 1", "Frente 1", e3.getId());
            Candidato c7 = new Candidato("Intendente", "Ciudad 2", "Frente 2", e3.getId());

            candidatoRepository.saveAll(java.util.List.of(c1, c2, c3, c4, c5, c6, c7));
        }
    }
}