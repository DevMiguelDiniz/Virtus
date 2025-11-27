package com.currencySystem.virtus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String login;
    private String tipoUsuario;
    private String nome;

    public AuthResponse(String token, Long id, String login, String tipoUsuario, String nome) {
        this.token = token;
        this.tipo = "Bearer";
        this.id = id;
        this.login = login;
        this.tipoUsuario = tipoUsuario;
        this.nome = nome;
    }
}
