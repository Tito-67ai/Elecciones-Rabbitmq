package com.presentacion.ms_votacion.dto;

import java.time.LocalDate;

public record EleccionAltaDTO(
    String nombre,
    String descripcion,
    LocalDate fecha
) {}

