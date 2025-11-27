package com.currencySystem.virtus.service;

import com.currencySystem.virtus.dto.AuthResponse;
import com.currencySystem.virtus.dto.LoginRequest;
import com.currencySystem.virtus.model.Admin;
import com.currencySystem.virtus.model.Aluno;
import com.currencySystem.virtus.model.Professor;
import com.currencySystem.virtus.model.Empresa;
import com.currencySystem.virtus.model.Usuario;
import com.currencySystem.virtus.repository.UsuarioRepository;
import com.currencySystem.virtus.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getSenha()
                )
        );

        Usuario usuario = (Usuario) authentication.getPrincipal();
        usuario.autenticar();

        String token = jwtService.generateToken(usuario);

        String nome = "";
        if (usuario instanceof Aluno) {
            nome = ((Aluno) usuario).getNome();
        } else if (usuario instanceof Professor) {
            nome = ((Professor) usuario).getNome();
        } else if (usuario instanceof Empresa) {
            nome = ((Empresa) usuario).getNome();
        } else if (usuario instanceof Admin) {
            nome = ((Admin) usuario).getNome();
        }

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getLogin(),
                usuario.getTipo().name(),
                nome
        );
    }
}