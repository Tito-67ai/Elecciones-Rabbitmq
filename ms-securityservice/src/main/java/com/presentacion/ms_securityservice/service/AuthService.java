package com.presentacion.ms_securityservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.presentacion.ms_securityservice.dto.LoginRequest;
import com.presentacion.ms_securityservice.dto.LoginResponse;
import com.presentacion.ms_securityservice.entity.Usuario;
import com.presentacion.ms_securityservice.exception.CredencialesInvalidasException;
import com.presentacion.ms_securityservice.repository.UsuarioRepository;
import com.presentacion.ms_securityservice.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new CredencialesInvalidasException("Usuario o contraseña incorrectos"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword())) {

            throw new CredencialesInvalidasException(
                    "Usuario o contraseña incorrectos");
        }

        String token = jwtService.generarToken(usuario);

        return new LoginResponse(token);
    }
}
