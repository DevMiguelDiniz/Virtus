package com.currencySystem.virtus.dto;

import com.currencySystem.virtus.model.Aluno;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoResponse {

    private Long id;
    private String login;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String endereco;
    private String instituicao; // Sigla da instituição
    private Integer saldoMoedas;
    private Boolean ativo;

    public AlunoResponse(Aluno aluno) {
        this.id = aluno.getId();
        this.login = aluno.getLogin();
        this.nome = aluno.getNome();
        this.email = aluno.getEmail();
        this.cpf = aluno.getCpf();
        this.rg = aluno.getRg();
        this.endereco = aluno.getEndereco();
        this.instituicao = aluno.getInstituicao() != null ? aluno.getInstituicao().getSigla() : null;
        this.saldoMoedas = aluno.getSaldoMoedas();
        this.ativo = aluno.getAtivo();
    }

    public static AlunoResponse fromEntity(Aluno aluno) {
        return new AlunoResponse(aluno);
    }
}
