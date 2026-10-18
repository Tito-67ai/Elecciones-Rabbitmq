package com.presentacion.ms_votacion.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.presentacion.ms_votacion.client.CiudadanoClient;
import com.presentacion.ms_votacion.config.RabbitMQConfig;
import com.presentacion.ms_votacion.dto.CiudadanoDTO;
import com.presentacion.ms_votacion.exception.RecursoNoEncontradoException;
import com.presentacion.ms_votacion.exception.VotoDuplicadoException;
import com.presentacion.ms_votacion.model.Candidato;
import com.presentacion.ms_votacion.model.Eleccion;
import com.presentacion.ms_votacion.model.Voto;
import com.presentacion.ms_votacion.repository.CandidatoRepository;
import com.presentacion.ms_votacion.repository.EleccionRepository;
import com.presentacion.ms_votacion.repository.VotoRepository;
import com.presentacion.ms_votacion.senders.VotoEvent;

@Service
public class VotoServiceImpl implements VotoService {

    private final VotoRepository votoRepository;
    private final CandidatoRepository candidatoRepository;
    private final EleccionRepository eleccionRepository;
    private final CiudadanoClient ciudadanoClient;
    private final RabbitTemplate rabbitTemplate;

    public VotoServiceImpl(
            VotoRepository votoRepository,
            CandidatoRepository candidatoRepository,
            EleccionRepository eleccionRepository,
            CiudadanoClient ciudadanoClient,
            RabbitTemplate rabbitTemplate) {
        this.votoRepository = votoRepository;
        this.candidatoRepository = candidatoRepository;
        this.eleccionRepository = eleccionRepository;
        this.ciudadanoClient = ciudadanoClient;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public Voto registrarVoto(Voto voto) {

        voto.setId(null);
        voto.setFechaHora(LocalDateTime.now());

        validarEleccion(voto.getEleccionId());
        validarCandidato(voto.getCandidatoId(), voto.getEleccionId());
        validarCiudadano(voto.getDniCiudadano());

        if (votoRepository.existsByEleccionIdAndDniCiudadano(
                voto.getEleccionId(), voto.getDniCiudadano())) {
            throw new VotoDuplicadoException(
                    "El ciudadano con dni " + voto.getDniCiudadano()
                            + " ya emitio su voto en la eleccion " + voto.getEleccionId());
        }

        Voto guardado = votoRepository.save(voto);

        notificarVoto(guardado);

        return guardado;
    }

    @Override
    public List<Voto> listarVotos() {
        return votoRepository.findAll();
    }

    @Override
    public List<Voto> listarPorEleccion(Long eleccionId) {
        return votoRepository.findByEleccionId(eleccionId);
    }

    @Override
    public long contarPorCandidato(Long candidatoId) {
        return votoRepository.countByCandidatoId(candidatoId);
    }

    @Override
    public Map<Long, Long> conteoPorCandidatoEnEleccion(Long eleccionId) {

        validarEleccion(eleccionId);

        List<Candidato> candidatos = candidatoRepository.findByEleccionIdAndActivoTrue(eleccionId);

        return candidatos.stream()
                .collect(Collectors.toMap(
                        Candidato::getId,
                        c -> votoRepository.countByCandidatoId(c.getId())
                ));
    }

    @Override
    public Map<String, Object> actaEleccion(Long eleccionId) {

        Eleccion eleccion = eleccionRepository.findById(eleccionId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Eleccion no encontrada: " + eleccionId));

        Map<Long, Long> conteo = conteoPorCandidatoEnEleccion(eleccionId);

        List<Candidato> candidatos = candidatoRepository.findByEleccionIdAndActivoTrue(eleccionId);
        long totalVotos = conteo.values().stream().mapToLong(Long::longValue).sum();
        long totalHabilitados = ciudadanoClient.contarHabilitados();

        return Map.of(
                "eleccionId", eleccion.getId(),
                "nombreEleccion", eleccion.getNombre(),
                "fecha", eleccion.getFecha(),
                "activa", eleccion.isActiva(),
                "totalVotos", totalVotos,
                "totalHabilitados", totalHabilitados,
                "participacion", totalHabilitados > 0 ? (double) totalVotos / totalHabilitados * 100 : 0.0,
                "resultados", candidatos.stream()
                        .map(c -> Map.of(
                                "candidatoId", c.getId(),
                                "nombre", c.getNombre() + " " + c.getApellido(),
                                "partido", c.getPartido(),
                                "votos", conteo.getOrDefault(c.getId(), 0L)
                        ))
                        .toList()
        );
    }

    private void validarEleccion(Long eleccionId) {

        if (eleccionId == null || eleccionRepository.findByIdAndActivaTrue(eleccionId).isEmpty()) {
            throw new RecursoNoEncontradoException(
                    "Eleccion no encontrada con id: " + eleccionId);
        }
    }

    private void validarCandidato(Long candidatoId, Long eleccionId) {

        Candidato candidato = candidatoRepository.findByIdAndActivoTrue(candidatoId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Candidato no encontrado con id: " + candidatoId));

        if (!candidato.getEleccionId().equals(eleccionId)) {
            throw new RecursoNoEncontradoException(
                    "El candidato " + candidatoId + " no pertenece a la eleccion " + eleccionId);
        }
    }

    private void validarCiudadano(String dniCiudadano) {

        CiudadanoDTO ciudadano = ciudadanoClient.obtenerPorDni(dniCiudadano);

        if (ciudadano == null) {
            throw new RecursoNoEncontradoException(
                    "Ciudadano no encontrado con dni: " + dniCiudadano);
        }
    }

    private void notificarVoto(Voto voto) {

        VotoEvent evento = new VotoEvent();
        evento.setIdVoto(voto.getId());
        evento.setIdEleccion(voto.getEleccionId());
        evento.setIdCandidato(voto.getCandidatoId());
        evento.setDniCiudadano(voto.getDniCiudadano());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                evento
        );
    }
}

