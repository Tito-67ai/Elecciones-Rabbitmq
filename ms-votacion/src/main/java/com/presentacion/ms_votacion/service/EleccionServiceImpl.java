package com.presentacion.ms_votacion.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.presentacion.ms_votacion.dto.EleccionModificarDTO;
import com.presentacion.ms_votacion.model.Eleccion;
import com.presentacion.ms_votacion.repository.EleccionRepository;

@Service
public class EleccionServiceImpl implements EleccionService {

    private final EleccionRepository eleccionRepository;

    public EleccionServiceImpl(EleccionRepository eleccionRepository) {
        this.eleccionRepository = eleccionRepository;
    }

    @Override
    public Eleccion altaEleccion(Eleccion eleccion) {

        eleccion.setId(null);
        eleccion.setActiva(true);

        return eleccionRepository.save(eleccion);
    }

    @Override
    public List<Eleccion> listarElecciones() {
        return eleccionRepository.findByActivaTrue();
    }

    @Override
    public Optional<Eleccion> obtenerPorId(Long id) {
        return eleccionRepository.findByIdAndActivaTrue(id);
    }

    @Override
    public Optional<Eleccion> modificarEleccion(Long id, EleccionModificarDTO dto) {

        return eleccionRepository.findByIdAndActivaTrue(id)
                .map(eleccion -> {
                    eleccion.setNombre(dto.nombre());
                    eleccion.setDescripcion(dto.descripcion());
                    eleccion.setFecha(dto.fecha());

                    if (dto.activa() != null) {
                        eleccion.setActiva(dto.activa());
                    }

                    return eleccionRepository.save(eleccion);
                });
    }

    @Override
    public boolean eliminarEleccion(Long id) {

        return eleccionRepository.findById(id)
                .filter(Eleccion::isActiva)
                .map(eleccion -> {
                    eleccion.setActiva(false);
                    eleccionRepository.save(eleccion);
                    return true;
                })
                .orElse(false);
    }
}

