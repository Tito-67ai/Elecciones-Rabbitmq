package com.presentacion.ms_votacion.dto;

public record VotoAltaDTO(
    Long eleccionId,
    Long candidatoId,
    String dniCiudadano
) {}

