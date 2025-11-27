package com.currencySystem.virtus.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LinkPagamentoResponse {
    
    private String linkPagamento;
    private Double valor;
    private LocalDateTime expiraEm;
    private boolean expirado;

    public LinkPagamentoResponse() {
    }

    public LinkPagamentoResponse(String linkPagamento, Double valor, LocalDateTime expiraEm, boolean expirado) {
        this.linkPagamento = linkPagamento;
        this.valor = valor;
        this.expiraEm = expiraEm;
        this.expirado = expirado;
    }
}

