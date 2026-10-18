package com.presentacion.ms_patron.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.presentacion.ms_patron.model.Ciudadano;

public interface CiudadanoRepository extends JpaRepository<Ciudadano, Long> {

    List<Ciudadano> findByActivoTrue();

    Optional<Ciudadano> findByIdAndActivoTrue(Long id);

    Optional<Ciudadano> findByDni(String dni);

    boolean existsByDni(String dni);

    long countByActivoTrue();
}

