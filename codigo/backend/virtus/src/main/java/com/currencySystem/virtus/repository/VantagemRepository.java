package com.currencySystem.virtus.repository;

import com.currencySystem.virtus.model.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VantagemRepository extends JpaRepository<Vantagem, Long> {

    List<Vantagem> findByAtivaTrue();

    List<Vantagem> findByEmpresaId(Long empresaId);
}
