package com.currencySystem.virtus.repository;

import com.currencySystem.virtus.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByAlunoId(Long alunoId);

    List<Transacao> findByProfessorId(Long professorId);

    List<Transacao> findByAlunoIdOrderByDataHoraDesc(Long alunoId);

    List<Transacao> findByProfessorIdOrderByDataHoraDesc(Long professorId);
}
