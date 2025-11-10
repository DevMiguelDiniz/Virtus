package com.currencySystem.virtus.dto;

import com.currencySystem.virtus.model.ResgateVantagem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResgateVantagemResponse {

    private Long id;
    private Long alunoId;
    private String alunoNome;
    private Long vantagemId;
    private String vantagemNome;
    private String vantagemUrlFoto;
    private Integer valorMoedas;
    private LocalDateTime dataResgate;
    private String codigoResgate;
    private Boolean utilizado;

    public ResgateVantagemResponse(ResgateVantagem resgate) {
        this.id = resgate.getId();
        this.alunoId = resgate.getAluno().getId();
        this.alunoNome = resgate.getAluno().getNome();
        this.vantagemId = resgate.getVantagem().getId();
        this.vantagemNome = resgate.getVantagem().getNome();
        this.vantagemUrlFoto = resgate.getVantagem().getUrlFoto();
        this.valorMoedas = resgate.getValorMoedas();
        this.dataResgate = resgate.getDataResgate();
        this.codigoResgate = resgate.getCodigoResgate();
        this.utilizado = resgate.getUtilizado();
    }

    public static ResgateVantagemResponse fromEntity(ResgateVantagem resgate) {
        return new ResgateVantagemResponse(resgate);
    }
}
