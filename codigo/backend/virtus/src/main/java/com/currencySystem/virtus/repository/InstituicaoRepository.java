package com.currencySystem.virtus.repository;

import com.currencySystem.virtus.model.Instituicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstituicaoRepository extends JpaRepository<Instituicao, Long> {

    Optional<Instituicao> findByNome(String nome);

    Optional<Instituicao> findBySigla(String sigla);

    boolean existsByNome(String nome);

    boolean existsBySigla(String sigla);
}
