package com.presentacion.ms_votacion.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.presentacion.ms_votacion.dto.VotoAltaDTO;
import com.presentacion.ms_votacion.dto.VotoSalidaDTO;
import com.presentacion.ms_votacion.model.Voto;
import com.presentacion.ms_votacion.service.VotoService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/votos")
@SecurityRequirement(name = "bearerAuth")
public class VotoController {

    private final VotoService votoService;

    public VotoController(VotoService votoService) {
        this.votoService = votoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ELECTOR','AUTORIDAD_MESA')")
    public ResponseEntity<VotoSalidaDTO> registrarVoto(@RequestBody VotoAltaDTO dto) {

        Voto nuevo = new Voto();
        nuevo.setEleccionId(dto.eleccionId());
        nuevo.setCandidatoId(dto.candidatoId());
        nuevo.setDniCiudadano(dto.dniCiudadano());

        Voto registrado = votoService.registrarVoto(nuevo);
        return ResponseEntity.status(201).body(VotoSalidaDTO.from(registrado));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<List<VotoSalidaDTO>> listarVotos() {

        List<VotoSalidaDTO> votos = votoService.listarVotos()
                .stream()
                .map(VotoSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(votos);
    }

    @GetMapping("/eleccion/{eleccionId}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<List<VotoSalidaDTO>> listarPorEleccion(@PathVariable Long eleccionId) {

        List<VotoSalidaDTO> votos = votoService.listarPorEleccion(eleccionId)
                .stream()
                .map(VotoSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(votos);
    }

    @GetMapping("/resultado/{candidatoId}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<Long> contarPorCandidato(@PathVariable Long candidatoId) {

        return ResponseEntity.ok(votoService.contarPorCandidato(candidatoId));
    }

    @GetMapping("/eleccion/{eleccionId}/conteo")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<Map<Long, Long>> conteoPorCandidatoEnEleccion(@PathVariable Long eleccionId) {

        return ResponseEntity.ok(votoService.conteoPorCandidatoEnEleccion(eleccionId));
    }

    @GetMapping("/eleccion/{eleccionId}/acta")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<Map<String, Object>> actaEleccion(@PathVariable Long eleccionId) {

        return ResponseEntity.ok(votoService.actaEleccion(eleccionId));
    }
}

