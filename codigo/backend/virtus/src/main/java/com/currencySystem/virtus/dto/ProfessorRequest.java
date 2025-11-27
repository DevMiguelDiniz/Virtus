package com.currencySystem.virtus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorRequest {

    @NotBlank(message = "Login é obrigatório")
    @Size(min = 3, max = 100, message = "Login deve ter entre 3 e 100 caracteres")
    private String login;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 11, message = "CPF deve ter 11 caracteres")
    private String cpf;

    @NotBlank(message = "RG é obrigatório")
    @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
    private String rg;

    @NotBlank(message = "Departamento é obrigatório")
    @Size(max = 200, message = "Departamento deve ter no máximo 200 caracteres")
    private String departamento;

    @NotEmpty(message = "Pelo menos uma instituição é obrigatória")
    private List<String> instituicoes; // Lista de siglas das instituições
}
