package com.presentacion.ms_votacion.service;

import java.util.List;
import java.util.Optional;

import com.presentacion.ms_votacion.dto.CandidatoModificarDTO;
import com.presentacion.ms_votacion.model.Candidato;

public interface CandidatoService {

    Candidato altaCandidato(Candidato candidato);

    List<Candidato> listarCandidatos();

    List<Candidato> listarPorEleccion(Long eleccionId);

    Optional<Candidato> obtenerPorId(Long id);

    Optional<Candidato> modificarCandidato(Long id, CandidatoModificarDTO dto);

    boolean eliminarCandidato(Long id);
}

