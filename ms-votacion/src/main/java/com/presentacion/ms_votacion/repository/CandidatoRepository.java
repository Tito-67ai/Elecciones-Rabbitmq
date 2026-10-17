package com.presentacion.ms_votacion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.presentacion.ms_votacion.model.Candidato;

public interface CandidatoRepository extends JpaRepository<Candidato, Long> {

    List<Candidato> findByActivoTrue();

    List<Candidato> findByEleccionIdAndActivoTrue(Long eleccionId);

    Optional<Candidato> findByIdAndActivoTrue(Long id);
}

