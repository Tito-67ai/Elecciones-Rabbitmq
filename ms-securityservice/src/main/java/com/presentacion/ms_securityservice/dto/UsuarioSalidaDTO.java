package com.presentacion.ms_securityservice.dto;

import com.presentacion.ms_securityservice.entity.Rol;
import com.presentacion.ms_securityservice.entity.Usuario;

public record UsuarioSalidaDTO(
    Long id,
    String username,
    Rol rol
) {

    public static UsuarioSalidaDTO from(Usuario usuario) {
        return new UsuarioSalidaDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getRol()
        );
    }
}
