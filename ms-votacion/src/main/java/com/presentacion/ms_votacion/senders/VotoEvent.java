package com.presentacion.ms_votacion.senders;

import lombok.Data;

@Data
public class VotoEvent {

    private long idVoto;
    private long idEleccion;
    private long idCandidato;
    private String dniCiudadano;
}

