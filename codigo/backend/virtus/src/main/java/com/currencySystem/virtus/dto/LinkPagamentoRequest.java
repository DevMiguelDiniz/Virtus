package com.currencySystem.virtus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkPagamentoRequest {
    
    private String linkPagamento;
    private Double valor; // Valor em moedas associado ao link
}
