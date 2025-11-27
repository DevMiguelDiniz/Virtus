package com.currencySystem.virtus.controller;

import com.currencySystem.virtus.dto.AuthResponse;
import com.currencySystem.virtus.dto.LoginRequest;
import com.currencySystem.virtus.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Realiza login do usuário no sistema
     * @param request Dados de login (email e senha)
     * @return Token JWT e informações do usuário autenticado
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
