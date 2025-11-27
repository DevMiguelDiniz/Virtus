package com.currencySystem.virtus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResgateVantagemRequest {

    @NotNull(message = "ID da vantagem é obrigatório")
    private Long vantagemId;
}
