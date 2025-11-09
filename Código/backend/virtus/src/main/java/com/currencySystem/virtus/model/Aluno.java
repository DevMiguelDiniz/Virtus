package com.currencySystem.virtus.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "alunos")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Aluno extends Usuario {

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, unique = true, length = 200)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, length = 500)
    private String endereco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id", nullable = false)
    private Instituicao instituicao;

    @Column(nullable = false)
    private Integer saldoMoedas = 0;

    @Column(name = "link_pagamento", length = 500)
    private String linkPagamento;

    @Column(name = "link_pagamento_expira_em")
    private LocalDateTime linkPagamentoExpiraEm;

    @Column(name = "valor_link_pagamento")
    private Double valorLinkPagamento;

    @JsonIgnore
    @OneToMany(mappedBy = "aluno", fetch = FetchType.LAZY)
    private List<Transacao> transacoesRecebidas = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResgateVantagem> resgates = new ArrayList<>();

    public Aluno(String login, String senha, String nome, String email, String cpf, String rg, String endereco, Instituicao instituicao) {
        this.setLogin(login);
        this.setSenha(senha);
        this.setTipo(TipoUsuario.ALUNO);
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.rg = rg;
        this.endereco = endereco;
        this.instituicao = instituicao;
        this.saldoMoedas = 0;
        this.setAtivo(true);
    }

    @Override
    public void autenticar() {
    }


    public void notificarEmail(String mensagem) {
        // Implementação do envio de email seria feita aqui
        // Por enquanto, apenas um placeholder
        System.out.println("Email enviado para " + this.email + ": " + mensagem);
    }


    public List<Transacao> consultarExtrato() {
        return new ArrayList<>(this.transacoesRecebidas);
    }

    public boolean trocarMoedas(Vantagem vantagem) {
        if (this.saldoMoedas >= vantagem.getCustoMoedas()) {
            this.saldoMoedas -= vantagem.getCustoMoedas();
            return true;
        }
        return false;
    }

    public void adicionarMoedas(Integer valor) {
        if (valor > 0) {
            this.saldoMoedas += valor;
        }
    }

    public boolean removerMoedas(Integer valor) {
        if (valor > 0 && this.saldoMoedas >= valor) {
            this.saldoMoedas -= valor;
            return true;
        }
        return false;
    }

    // Métodos para gerenciamento de link de pagamento
    public String getLinkPagamento() {
        if (linkPagamento != null && linkPagamentoExpiraEm != null) {
            if (LocalDateTime.now().isAfter(linkPagamentoExpiraEm)) {
                return null; // Link expirado
            }
        }
        return linkPagamento;
    }

    public void setLinkPagamento(String linkPagamento) {
        this.linkPagamento = linkPagamento;
        if (linkPagamento != null) {
            this.linkPagamentoExpiraEm = LocalDateTime.now().plusMinutes(5);
        } else {
            this.linkPagamentoExpiraEm = null;
            this.valorLinkPagamento = null; // Limpa o valor também
        }
    }

    public void setLinkPagamento(String linkPagamento, Double valor) {
        this.linkPagamento = linkPagamento;
        this.valorLinkPagamento = valor;
        if (linkPagamento != null) {
            this.linkPagamentoExpiraEm = LocalDateTime.now().plusMinutes(5);
        } else {
            this.linkPagamentoExpiraEm = null;
            this.valorLinkPagamento = null;
        }
    }

    public Double getValorLinkPagamento() {
        // Retorna o valor apenas se o link ainda for válido
        if (linkPagamento != null && linkPagamentoExpiraEm != null) {
            if (LocalDateTime.now().isAfter(linkPagamentoExpiraEm)) {
                return null; // Link expirado, valor também expira
            }
        }
        return valorLinkPagamento;
    }

    public LocalDateTime getLinkPagamentoExpiraEm() {
        return linkPagamentoExpiraEm;
    }
}
