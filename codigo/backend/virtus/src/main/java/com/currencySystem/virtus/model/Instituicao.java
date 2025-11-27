package com.currencySystem.virtus.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "instituicoes")
public class Instituicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 200)
    private String nome;

    @Column(length = 10)
    private String sigla;

    @JsonIgnore
    @ManyToMany(mappedBy = "instituicoes")
    private List<Professor> professores = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL)
    private List<Aluno> alunos = new ArrayList<>();

    public Instituicao(String nome, String sigla) {
        this.nome = nome;
        this.sigla = sigla;
    }
}
