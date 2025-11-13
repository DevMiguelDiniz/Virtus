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
    private String alunoEmail;
    private Long vantagemId;
    private String vantagemNome;
    private String vantagemDescricao;
    private String vantagemUrlFoto;
    private Integer valorMoedas;
    private LocalDateTime dataResgate;
    private String codigoResgate;
    private Boolean utilizado;
    private String resgateUrl;
    private String qrCodeBase64;

    public ResgateVantagemResponse(ResgateVantagem resgate) {
        this.id = resgate.getId();
        this.alunoId = resgate.getAluno().getId();
        this.alunoNome = resgate.getAluno().getNome();
        this.alunoEmail = resgate.getAluno().getEmail();
        this.vantagemId = resgate.getVantagem().getId();
        this.vantagemNome = resgate.getVantagem().getNome();
        this.vantagemDescricao = resgate.getVantagem().getDescricao();
        this.vantagemUrlFoto = resgate.getVantagem().getUrlFoto();
        this.valorMoedas = resgate.getValorMoedas();
        this.dataResgate = resgate.getDataResgate();
        this.codigoResgate = resgate.getCodigoResgate();
        this.utilizado = resgate.getUtilizado();
        // resgateUrl e qrCodeBase64 serão definidos manualmente quando necessário
    }

    public static ResgateVantagemResponse fromEntity(ResgateVantagem resgate) {
        return new ResgateVantagemResponse(resgate);
    }

    public static ResgateVantagemResponse fromEntityWithQRCode(
        ResgateVantagem resgate,
        String resgateUrl,
        String qrCodeBase64
    ) {
        ResgateVantagemResponse response = new ResgateVantagemResponse(resgate);
        response.setResgateUrl(resgateUrl);
        response.setQrCodeBase64(qrCodeBase64);
        return response;
    }
}
