package com.presentacion.ms_patron.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.presentacion.ms_patron.dto.CiudadanoModificarDTO;
import com.presentacion.ms_patron.exception.CiudadanoYaExisteException;
import com.presentacion.ms_patron.exception.RecursoNoEncontradoException;
import com.presentacion.ms_patron.model.Ciudadano;
import com.presentacion.ms_patron.repository.CiudadanoRepository;

@Service
public class CiudadanoServiceImpl implements CiudadanoService {

    private final CiudadanoRepository ciudadanoRepository;

    public CiudadanoServiceImpl(CiudadanoRepository ciudadanoRepository) {
        this.ciudadanoRepository = ciudadanoRepository;
    }

    @Override
    public Ciudadano altaCiudadano(Ciudadano ciudadano) {

        ciudadano.setId(null);
        ciudadano.setActivo(true);
        ciudadano.setYaVoto(false);

        if (ciudadano.getDni() != null
                && ciudadanoRepository.existsByDni(ciudadano.getDni())) {
            throw new CiudadanoYaExisteException(
                    "Ya existe un ciudadano con el dni: " + ciudadano.getDni());
        }

        return ciudadanoRepository.save(ciudadano);
    }

    @Override
    public List<Ciudadano> listarCiudadanos() {
        return ciudadanoRepository.findByActivoTrue();
    }

    @Override
    public Optional<Ciudadano> obtenerPorId(Long id) {
        return ciudadanoRepository.findByIdAndActivoTrue(id);
    }

    @Override
    public Optional<Ciudadano> obtenerPorDni(String dni) {
        return ciudadanoRepository.findByDni(dni);
    }

    @Override
    public Optional<Ciudadano> modificarCiudadano(Long id, CiudadanoModificarDTO dto) {

        return ciudadanoRepository.findByIdAndActivoTrue(id)
                .map(ciudadano -> {
                    ciudadanoRepository.findByDni(dto.dni())
                            .filter(otro -> !otro.getId().equals(id))
                            .ifPresent(otro -> {
                                throw new CiudadanoYaExisteException(
                                        "Ya existe un ciudadano con el dni: " + dto.dni());
                            });

                    ciudadano.setNombre(dto.nombre());
                    ciudadano.setApellido(dto.apellido());
                    ciudadano.setDni(dto.dni());
                    ciudadano.setEmail(dto.email());
                    ciudadano.setDireccion(dto.direccion());

                    return ciudadanoRepository.save(ciudadano);
                });
    }

    @Override
    public boolean eliminarCiudadano(Long id) {

        return ciudadanoRepository.findById(id)
                .filter(Ciudadano::isActivo)
                .map(ciudadano -> {
                    ciudadano.setActivo(false);
                    ciudadanoRepository.save(ciudadano);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public long contarHabilitados() {
        return ciudadanoRepository.countByActivoTrue();
    }

    @Override
    @Transactional
    public void marcarYaVoto(String dni) {

        Ciudadano ciudadano = ciudadanoRepository.findByDni(dni)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Ciudadano no encontrado con dni: " + dni));

        ciudadano.setYaVoto(true);
        ciudadanoRepository.save(ciudadano);
    }
}

