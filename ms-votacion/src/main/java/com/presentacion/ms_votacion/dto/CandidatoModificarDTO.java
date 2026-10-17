package com.presentacion.ms_votacion.dto;

public record CandidatoModificarDTO(
    String nombre,
    String apellido,
    String partido,
    Long eleccionId
) {}

