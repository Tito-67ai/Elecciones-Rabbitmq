package com.presentacion.ms_securityservice.controller;

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

import com.presentacion.ms_securityservice.dto.UsuarioAltaDTO;
import com.presentacion.ms_securityservice.dto.UsuarioModificarDTO;
import com.presentacion.ms_securityservice.dto.UsuarioSalidaDTO;
import com.presentacion.ms_securityservice.entity.Usuario;
import com.presentacion.ms_securityservice.service.UsuarioService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth/usuarios")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROOT','ADMIN')")
    public ResponseEntity<List<UsuarioSalidaDTO>> listarUsuarios() {

        List<UsuarioSalidaDTO> usuarios = usuarioService.listarUsuarios()
                .stream()
                .map(UsuarioSalidaDTO::from)
                .toList();

        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROOT','ADMIN')")
    public ResponseEntity<UsuarioSalidaDTO> obtenerPorId(@PathVariable Long id) {

        return usuarioService.obtenerPorId(id)
                .map(UsuarioSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROOT','ADMIN')")
    public ResponseEntity<UsuarioSalidaDTO> crearUsuario(
            @Valid @RequestBody UsuarioAltaDTO dto) {

        Usuario creado = usuarioService.crearUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioSalidaDTO.from(creado));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROOT','ADMIN')")
    public ResponseEntity<UsuarioSalidaDTO> modificarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioModificarDTO dto) {

        return usuarioService.modificarUsuario(id, dto)
                .map(UsuarioSalidaDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROOT','ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {

        if (!usuarioService.eliminarUsuario(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
