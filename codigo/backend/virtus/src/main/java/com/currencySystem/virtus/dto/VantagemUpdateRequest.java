package com.currencySystem.virtus.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VantagemUpdateRequest {

    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    private String nome;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String descricao;

    @Min(value = 1, message = "Custo deve ser maior que zero")
    private Integer custoMoedas;

    @Size(max = 500, message = "URL da foto deve ter no máximo 500 caracteres")
    private String urlFoto;

    private Boolean ativa;
}
