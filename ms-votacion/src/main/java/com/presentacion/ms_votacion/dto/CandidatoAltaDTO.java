package com.presentacion.ms_votacion.dto;

public record CandidatoAltaDTO(
    String nombre,
    String apellido,
    String partido,
    Long eleccionId
) {}

