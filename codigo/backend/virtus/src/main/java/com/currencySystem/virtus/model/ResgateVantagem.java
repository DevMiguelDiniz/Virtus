package com.currencySystem.virtus.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resgates_vantagens")
public class ResgateVantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem vantagem;

    @Column(nullable = false)
    private Integer valorMoedas;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataResgate;

    @Column(nullable = false, unique = true, length = 100)
    private String codigoResgate;

    @Column(nullable = false)
    private Boolean utilizado = false;

    @PrePersist
    protected void onCreate() {
        if (dataResgate == null) {
            dataResgate = LocalDateTime.now();
        }
        if (codigoResgate == null) {
            codigoResgate = gerarCodigoResgate();
        }
    }

    private String gerarCodigoResgate() {
        return "RES-" + System.currentTimeMillis() + "-" +
               (int) (Math.random() * 10000);
    }
}
