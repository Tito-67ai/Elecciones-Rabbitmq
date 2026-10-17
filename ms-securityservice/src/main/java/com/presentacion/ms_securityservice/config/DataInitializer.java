package com.presentacion.ms_securityservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.presentacion.ms_securityservice.entity.Rol;
import com.presentacion.ms_securityservice.entity.Usuario;
import com.presentacion.ms_securityservice.repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsuarios(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (usuarioRepository.count() == 0) {

                usuarioRepository.save(
                        new Usuario(
                                "root",
                                passwordEncoder.encode("1234"),
                                Rol.ROOT
                        )
                );

                usuarioRepository.save(
                        new Usuario(
                                "admin",
                                passwordEncoder.encode("1234"),
                                Rol.ADMIN
                        )
                );

                usuarioRepository.save(
                        new Usuario(
                                "autoridad",
                                passwordEncoder.encode("1234"),
                                Rol.AUTORIDAD_MESA
                        )
                );

                usuarioRepository.save(
                        new Usuario(
                                "fiscal",
                                passwordEncoder.encode("1234"),
                                Rol.FISCAL
                        )
                );

                usuarioRepository.save(
                        new Usuario(
                                "elector",
                                passwordEncoder.encode("1234"),
                                Rol.ELECTOR
                        )
                );
            }
        };
    }
}
