package com.presentacion.ms_votacion.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.presentacion.ms_votacion.dto.CandidatoAltaDTO;
import com.presentacion.ms_votacion.dto.CandidatoModificarDTO;
import com.presentacion.ms_votacion.dto.CandidatoSalidaDTO;
import com.presentacion.ms_votacion.model.Candidato;
import com.presentacion.ms_votacion.service.CandidatoService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/candidatos")
@SecurityRequirement(name = "bearerAuth")
public class CandidatoController {

    private final CandidatoService candidatoService;

    public CandidatoController(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<CandidatoSalidaDTO> altaCandidato(@RequestBody CandidatoAltaDTO dto) {

        Candidato nuevo = new Candidato();
        nuevo.setNombre(dto.nombre());
        nuevo.setApellido(dto.apellido());
        nuevo.setPartido(dto.partido());
        nuevo.setEleccionId(dto.eleccionId());

        Candidato creado = candidatoService.altaCandidato(nuevo);
        return ResponseEntity.status(HttpStatus.CREATED).body(CandidatoSalidaDTO.from(creado));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL','ELECTOR')")
    public ResponseEntity<List<CandidatoSalidaDTO>> listarCandidatos() {

        List<CandidatoSalidaDTO> candidatos = candidatoService.listarCandidatos()
                .stream()
                .map(CandidatoSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(candidatos);
    }

    @GetMapping("/eleccion/{eleccionId}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL','ELECTOR')")
    public ResponseEntity<List<CandidatoSalidaDTO>> listarPorEleccion(@PathVariable Long eleccionId) {

        List<CandidatoSalidaDTO> candidatos = candidatoService.listarPorEleccion(eleccionId)
                .stream()
                .map(CandidatoSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(candidatos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL','ELECTOR')")
    public ResponseEntity<CandidatoSalidaDTO> obtenerPorId(@PathVariable Long id) {

        return candidatoService.obtenerPorId(id)
                .map(CandidatoSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<CandidatoSalidaDTO> modificarCandidato(
            @PathVariable Long id,
            @RequestBody CandidatoModificarDTO dto) {

        return candidatoService.modificarCandidato(id, dto)
                .map(CandidatoSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<Void> eliminarCandidato(@PathVariable Long id) {

        if (!candidatoService.eliminarCandidato(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}

