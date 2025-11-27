package com.currencySystem.virtus.dto;

import com.currencySystem.virtus.model.Empresa;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaResponse {

    private Long id;
    private String login;
    private String nome;
    private String cnpj;
    private String endereco;
    private String email;
    private Boolean ativa;

    public EmpresaResponse(Empresa empresa) {
        this.id = empresa.getId();
        this.login = empresa.getLogin();
        this.nome = empresa.getNome();
        this.cnpj = empresa.getCnpj();
        this.endereco = empresa.getEndereco();
        this.email = empresa.getEmail();
        this.ativa = empresa.getAtivo();
    }

    public static EmpresaResponse fromEntity(Empresa empresa) {
        return new EmpresaResponse(empresa);
    }
}