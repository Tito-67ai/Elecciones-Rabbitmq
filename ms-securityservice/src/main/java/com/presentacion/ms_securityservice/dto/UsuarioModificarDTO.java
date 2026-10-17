package com.presentacion.ms_securityservice.dto;

import com.presentacion.ms_securityservice.entity.Rol;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioModificarDTO(
    @NotBlank String username,
    String password,
    @NotNull Rol rol
) {}
