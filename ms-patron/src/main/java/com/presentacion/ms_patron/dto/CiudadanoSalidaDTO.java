package com.presentacion.ms_patron.dto;

import com.presentacion.ms_patron.model.Ciudadano;

public record CiudadanoSalidaDTO(
    Long id,
    String nombre,
    String apellido,
    String dni,
    String email,
    String direccion,
    boolean yaVoto
) {

    public static CiudadanoSalidaDTO from(Ciudadano ciudadano) {
        return new CiudadanoSalidaDTO(
                ciudadano.getId(),
                ciudadano.getNombre(),
                ciudadano.getApellido(),
                ciudadano.getDni(),
                ciudadano.getEmail(),
                ciudadano.getDireccion(),
                ciudadano.isYaVoto()
        );
    }
}

