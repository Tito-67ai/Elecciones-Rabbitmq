package com.presentacion.ms_patron.listener.objects;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class VotoEvent {

    private long idVoto;
    private long idEleccion;
    private long idCandidato;
    private String dniCiudadano;
}

