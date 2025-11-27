package com.currencySystem.virtus.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "empresas")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Empresa extends Usuario {

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cnpj;

    @Column(nullable = false, length = 500)
    private String endereco;

    @Column(length = 500)
    private String email;

    @Column(nullable = false)
    private Boolean ativa = true;  // ✅ ADICIONE ESTA LINHA

    @JsonIgnore
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vantagem> vantagens = new ArrayList<>();

    public Empresa(String login, String senha, String nome, String cnpj, String endereco, String email) {
        this.setLogin(login);
        this.setSenha(senha);
        this.setTipo(TipoUsuario.EMPRESA);
        this.nome = nome;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.email = email;
        this.ativa = true;  // ✅ ADICIONE ESTA LINHA
        this.setAtivo(true);
    }

    @Override
    public void autenticar() {
        // Lógica de autenticação específica da empresa
    }

    public void notificarEmail(String mensagem) {
        System.out.println("Email enviado para " + this.email + ": " + mensagem);
    }
}