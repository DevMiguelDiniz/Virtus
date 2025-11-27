package com.currencySystem.virtus.dto;

import com.currencySystem.virtus.model.Admin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponse {

    private Long id;
    private String login;
    private String nome;
    private String email;
    private String cpf;
    private Boolean ativo;

    public AdminResponse(Admin admin) {
        this.id = admin.getId();
        this.login = admin.getLogin();
        this.nome = admin.getNome();
        this.email = admin.getEmail();
        this.cpf = admin.getCpf();
        this.ativo = admin.getAtivo();
    }

    public static AdminResponse fromEntity(Admin admin) {
        return new AdminResponse(admin);
    }
}
