package com.currencySystem.virtus.repository;

import com.currencySystem.virtus.model.ResgateVantagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResgateVantagemRepository extends JpaRepository<ResgateVantagem, Long> {

    List<ResgateVantagem> findByAlunoId(Long alunoId);

    List<ResgateVantagem> findByAlunoIdOrderByDataResgateDesc(Long alunoId);

    Optional<ResgateVantagem> findByCodigoResgate(String codigoResgate);
}
