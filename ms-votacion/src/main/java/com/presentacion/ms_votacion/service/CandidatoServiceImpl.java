package com.presentacion.ms_votacion.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.presentacion.ms_votacion.dto.CandidatoModificarDTO;
import com.presentacion.ms_votacion.exception.RecursoNoEncontradoException;
import com.presentacion.ms_votacion.model.Candidato;
import com.presentacion.ms_votacion.repository.CandidatoRepository;
import com.presentacion.ms_votacion.repository.EleccionRepository;

@Service
public class CandidatoServiceImpl implements CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final EleccionRepository eleccionRepository;

    public CandidatoServiceImpl(
            CandidatoRepository candidatoRepository,
            EleccionRepository eleccionRepository) {
        this.candidatoRepository = candidatoRepository;
        this.eleccionRepository = eleccionRepository;
    }

    @Override
    public Candidato altaCandidato(Candidato candidato) {

        candidato.setId(null);
        candidato.setActivo(true);

        validarEleccion(candidato.getEleccionId());

        return candidatoRepository.save(candidato);
    }

    @Override
    public List<Candidato> listarCandidatos() {
        return candidatoRepository.findByActivoTrue();
    }

    @Override
    public List<Candidato> listarPorEleccion(Long eleccionId) {
        return candidatoRepository.findByEleccionIdAndActivoTrue(eleccionId);
    }

    @Override
    public Optional<Candidato> obtenerPorId(Long id) {
        return candidatoRepository.findByIdAndActivoTrue(id);
    }

    @Override
    public Optional<Candidato> modificarCandidato(Long id, CandidatoModificarDTO dto) {

        return candidatoRepository.findByIdAndActivoTrue(id)
                .map(candidato -> {
                    validarEleccion(dto.eleccionId());

                    candidato.setNombre(dto.nombre());
                    candidato.setApellido(dto.apellido());
                    candidato.setPartido(dto.partido());
                    candidato.setEleccionId(dto.eleccionId());

                    return candidatoRepository.save(candidato);
                });
    }

    @Override
    public boolean eliminarCandidato(Long id) {

        return candidatoRepository.findById(id)
                .filter(Candidato::isActivo)
                .map(candidato -> {
                    candidato.setActivo(false);
                    candidatoRepository.save(candidato);
                    return true;
                })
                .orElse(false);
    }

    private void validarEleccion(Long eleccionId) {

        if (eleccionId == null || eleccionRepository.findByIdAndActivaTrue(eleccionId).isEmpty()) {
            throw new RecursoNoEncontradoException(
                    "Eleccion no encontrada con id: " + eleccionId);
        }
    }
}

