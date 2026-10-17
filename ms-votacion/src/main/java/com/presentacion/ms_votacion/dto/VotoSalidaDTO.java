package com.presentacion.ms_votacion.dto;

import java.time.LocalDateTime;

import com.presentacion.ms_votacion.model.Voto;

public record VotoSalidaDTO(
    Long id,
    Long eleccionId,
    Long candidatoId,
    String dniCiudadano,
    LocalDateTime fechaHora
) {

    public static VotoSalidaDTO from(Voto voto) {
        return new VotoSalidaDTO(
                voto.getId(),
                voto.getEleccionId(),
                voto.getCandidatoId(),
                voto.getDniCiudadano(),
                voto.getFechaHora()
        );
    }
}

