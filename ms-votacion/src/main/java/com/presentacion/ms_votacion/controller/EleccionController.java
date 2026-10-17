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

import com.presentacion.ms_votacion.dto.EleccionAltaDTO;
import com.presentacion.ms_votacion.dto.EleccionModificarDTO;
import com.presentacion.ms_votacion.dto.EleccionSalidaDTO;
import com.presentacion.ms_votacion.model.Eleccion;
import com.presentacion.ms_votacion.service.EleccionService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/elecciones")
@SecurityRequirement(name = "bearerAuth")
public class EleccionController {

    private final EleccionService eleccionService;

    public EleccionController(EleccionService eleccionService) {
        this.eleccionService = eleccionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<EleccionSalidaDTO> altaEleccion(@RequestBody EleccionAltaDTO dto) {

        Eleccion nueva = new Eleccion();
        nueva.setNombre(dto.nombre());
        nueva.setDescripcion(dto.descripcion());
        nueva.setFecha(dto.fecha());

        Eleccion creada = eleccionService.altaEleccion(nueva);
        return ResponseEntity.status(HttpStatus.CREATED).body(EleccionSalidaDTO.from(creada));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<List<EleccionSalidaDTO>> listarElecciones() {

        List<EleccionSalidaDTO> elecciones = eleccionService.listarElecciones()
                .stream()
                .map(EleccionSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(elecciones);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<EleccionSalidaDTO> obtenerPorId(@PathVariable Long id) {

        return eleccionService.obtenerPorId(id)
                .map(EleccionSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<EleccionSalidaDTO> modificarEleccion(
            @PathVariable Long id,
            @RequestBody EleccionModificarDTO dto) {

        return eleccionService.modificarEleccion(id, dto)
                .map(EleccionSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<Void> eliminarEleccion(@PathVariable Long id) {

        if (!eleccionService.eliminarEleccion(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}

