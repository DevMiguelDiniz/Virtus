package com.currencySystem.virtus.dto;

import com.currencySystem.virtus.model.Professor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorResponse {

    private Long id;
    private String login;
    private String nome;
    private String cpf;
    private String rg;
    private String departamento;
    private List<String> instituicoes; // Lista de siglas das instituições
    private Integer saldoMoedas;
    private Boolean ativo;

    public ProfessorResponse(Professor professor) {
        this.id = professor.getId();
        this.login = professor.getLogin();
        this.nome = professor.getNome();
        this.cpf = professor.getCpf();
        this.rg = professor.getRg();
        this.departamento = professor.getDepartamento();
        this.instituicoes = professor.getInstituicoes().stream()
                .map(inst -> inst.getSigla())
                .collect(Collectors.toList());
        this.saldoMoedas = professor.getSaldoMoedas();
        this.ativo = professor.getAtivo();
    }

    public static ProfessorResponse fromEntity(Professor professor) {
        return new ProfessorResponse(professor);
    }
}
