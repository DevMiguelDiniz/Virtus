package com.currencySystem.virtus.dto;

import com.currencySystem.virtus.model.Vantagem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VantagemResponse {

    private Long id;
    private String nome;
    private String descricao;
    private Integer custoMoedas;
    private String urlFoto;
    private Long empresaId;
    private String empresaNome;
    private Boolean ativa;

    public VantagemResponse(Vantagem vantagem) {
        this.id = vantagem.getId();
        this.nome = vantagem.getNome();
        this.descricao = vantagem.getDescricao();
        this.custoMoedas = vantagem.getCustoMoedas();
        this.urlFoto = vantagem.getUrlFoto();
        this.empresaId = vantagem.getEmpresa().getId();
        this.empresaNome = vantagem.getEmpresa().getNome();
        this.ativa = vantagem.getAtiva();
    }

    public static VantagemResponse fromEntity(Vantagem vantagem) {
        return new VantagemResponse(vantagem);
    }
}
