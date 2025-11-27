package com.currencySystem.virtus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagarLinkRequest {
    
    @NotNull(message = "O ID do pagador é obrigatório")
    private Long pagadorId;
    
    @NotBlank(message = "O link de pagamento é obrigatório")
    private String link;
}
