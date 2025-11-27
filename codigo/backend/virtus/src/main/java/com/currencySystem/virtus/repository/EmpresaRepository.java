package com.currencySystem.virtus.repository;

import com.currencySystem.virtus.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findByLogin(String login);

    Optional<Empresa> findByCnpj(String cnpj);

    Optional<Empresa> findByEmail(String email);

    boolean existsByCnpj(String cnpj);

    boolean existsByEmail(String email);

    boolean existsByLogin(String login);
}