package com.currencySystem.virtus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorUpdateRequest {

    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    private String nome;

    @Size(max = 200, message = "Departamento deve ter no máximo 200 caracteres")
    private String departamento;

    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;
}
