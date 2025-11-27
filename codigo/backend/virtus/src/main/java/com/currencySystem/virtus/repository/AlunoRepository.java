package com.currencySystem.virtus.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.currencySystem.virtus.model.Aluno;
import com.currencySystem.virtus.model.Instituicao;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByLogin(String login);

    Optional<Aluno> findByEmail(String email);

    Optional<Aluno> findByCpf(String cpf);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByLogin(String login);

    // Buscar alunos por uma lista de instituições
    List<Aluno> findByInstituicaoIn(List<Instituicao> instituicoes);

    // Buscar alunos de uma instituição específica
    List<Aluno> findByInstituicao(Instituicao instituicao);

    // Buscar aluno por link de pagamento
    Optional<Aluno> findByLinkPagamento(String linkPagamento);

    // Limpar links de pagamento expirados
    @Modifying
    @Query("UPDATE Aluno a SET a.linkPagamento = null, a.linkPagamentoExpiraEm = null, a.valorLinkPagamento = null WHERE a.linkPagamentoExpiraEm < :dataExpiracao AND a.linkPagamento IS NOT NULL")
    int limparLinksExpirados(@Param("dataExpiracao") LocalDateTime dataExpiracao);
}
