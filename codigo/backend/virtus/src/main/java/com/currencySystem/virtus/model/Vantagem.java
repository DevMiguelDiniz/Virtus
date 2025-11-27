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
@Table(name = "vantagens")
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(nullable = false)
    private Integer custoMoedas;

    @Column(length = 500)
    private String urlFoto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = false)
    private Boolean ativa = true;

    @JsonIgnore
    @OneToMany(mappedBy = "vantagem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ResgateVantagem> resgates = new ArrayList<>();

    /**
     * Verifica se a vantagem está disponível para resgate
     * @return true se está ativa, false caso contrário
     */
    public boolean isDisponivel() {
        return this.ativa;
    }
}
