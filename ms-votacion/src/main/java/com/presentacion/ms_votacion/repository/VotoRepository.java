package com.presentacion.ms_votacion.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.presentacion.ms_votacion.model.Voto;

public interface VotoRepository extends JpaRepository<Voto, Long> {

    List<Voto> findByEleccionId(Long eleccionId);

    List<Voto> findByCandidatoId(Long candidatoId);

    boolean existsByEleccionIdAndDniCiudadano(Long eleccionId, String dniCiudadano);

    long countByCandidatoId(Long candidatoId);
}

