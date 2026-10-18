package com.presentacion.ms_patron.controller;

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

import com.presentacion.ms_patron.dto.CiudadanoAltaDTO;
import com.presentacion.ms_patron.dto.CiudadanoModificarDTO;
import com.presentacion.ms_patron.dto.CiudadanoSalidaDTO;
import com.presentacion.ms_patron.model.Ciudadano;
import com.presentacion.ms_patron.service.CiudadanoService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/ciudadanos")
@SecurityRequirement(name = "bearerAuth")
public class CiudadanoController {

    private final CiudadanoService ciudadanoService;

    public CiudadanoController(CiudadanoService ciudadanoService) {
        this.ciudadanoService = ciudadanoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<CiudadanoSalidaDTO> altaCiudadano(@RequestBody CiudadanoAltaDTO dto) {

        Ciudadano nuevo = new Ciudadano();
        nuevo.setNombre(dto.nombre());
        nuevo.setApellido(dto.apellido());
        nuevo.setDni(dto.dni());
        nuevo.setEmail(dto.email());
        nuevo.setDireccion(dto.direccion());

        Ciudadano creado = ciudadanoService.altaCiudadano(nuevo);
        return ResponseEntity.status(HttpStatus.CREATED).body(CiudadanoSalidaDTO.from(creado));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<List<CiudadanoSalidaDTO>> listarCiudadanos() {

        List<CiudadanoSalidaDTO> ciudadanos = ciudadanoService.listarCiudadanos()
                .stream()
                .map(CiudadanoSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(ciudadanos);
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<Long> contarHabilitados() {

        return ResponseEntity.ok(ciudadanoService.contarHabilitados());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL')")
    public ResponseEntity<CiudadanoSalidaDTO> obtenerPorId(@PathVariable Long id) {

        return ciudadanoService.obtenerPorId(id)
                .map(CiudadanoSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT','AUTORIDAD_MESA','FISCAL','ELECTOR')")
    public ResponseEntity<CiudadanoSalidaDTO> obtenerPorDni(@PathVariable String dni) {

        return ciudadanoService.obtenerPorDni(dni)
                .map(CiudadanoSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<CiudadanoSalidaDTO> modificarCiudadano(
            @PathVariable Long id,
            @RequestBody CiudadanoModificarDTO dto) {

        return ciudadanoService.modificarCiudadano(id, dto)
                .map(CiudadanoSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ROOT')")
    public ResponseEntity<Void> eliminarCiudadano(@PathVariable Long id) {

        if (!ciudadanoService.eliminarCiudadano(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}

