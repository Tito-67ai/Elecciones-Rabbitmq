package com.presentacion.ms_patron.service;

import java.util.List;
import java.util.Optional;

import com.presentacion.ms_patron.dto.CiudadanoModificarDTO;
import com.presentacion.ms_patron.model.Ciudadano;

public interface CiudadanoService {

    Ciudadano altaCiudadano(Ciudadano ciudadano);

    List<Ciudadano> listarCiudadanos();

    Optional<Ciudadano> obtenerPorId(Long id);

    Optional<Ciudadano> obtenerPorDni(String dni);

    Optional<Ciudadano> modificarCiudadano(Long id, CiudadanoModificarDTO dto);

    boolean eliminarCiudadano(Long id);

    void marcarYaVoto(String dni);
}

