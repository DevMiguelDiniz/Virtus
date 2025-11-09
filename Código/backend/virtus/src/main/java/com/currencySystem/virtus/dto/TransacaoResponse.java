package com.currencySystem.virtus.dto;

import java.time.LocalDateTime;

import com.currencySystem.virtus.model.Transacao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoResponse {

    private Long id;
    private Long professorId;
    private String professorNome;
    private Long alunoId;
    private String alunoNome;
    private Integer valor;
    private String motivo;
    private LocalDateTime dataHora;

    public TransacaoResponse(Transacao transacao) {
        this.id = transacao.getId();
        this.professorId = transacao.getProfessor() != null ? transacao.getProfessor().getId() : null;
        this.professorNome = transacao.getProfessor() != null ? transacao.getProfessor().getNome() : null;
        this.alunoId = transacao.getAluno() != null ? transacao.getAluno().getId() : null;
        this.alunoNome = transacao.getAluno() != null ? transacao.getAluno().getNome() : null;
        this.valor = transacao.getValor();
        this.motivo = transacao.getMotivo();
        this.dataHora = transacao.getDataHora();
    }

    public static TransacaoResponse fromEntity(Transacao transacao) {
        return new TransacaoResponse(transacao);
    }
}
