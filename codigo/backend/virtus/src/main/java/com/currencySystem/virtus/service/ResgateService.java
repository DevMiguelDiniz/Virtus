package com.currencySystem.virtus.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.currencySystem.virtus.dto.ResgateVantagemResponse;
import com.currencySystem.virtus.model.ResgateVantagem;
import com.currencySystem.virtus.repository.ResgateVantagemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Serviço para gerenciamento de resgates
 * Usado principalmente por estabelecimentos parceiros para validar resgates
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ResgateService {

    private final ResgateVantagemRepository resgateVantagemRepository;
    private final EmailJSService emailJSService;

    /**
     * Busca informações de um resgate
     *
     * @param resgateId ID do resgate
     * @return Dados do resgate
     */
    @Transactional(readOnly = true)
    public ResgateVantagemResponse buscarResgate(Long resgateId) {
        log.info("Buscando resgate ID: {}", resgateId);

        ResgateVantagem resgate = resgateVantagemRepository.findById(resgateId)
                .orElseThrow(() -> new IllegalArgumentException("Resgate não encontrado"));

        return ResgateVantagemResponse.fromEntity(resgate);
    }

    /**
     * Valida um resgate, marcando como utilizado
     * Simula a validação feita por um estabelecimento parceiro
     *
     * @param resgateId ID do resgate
     * @return Dados do resgate validado
     */
    @Transactional
    public ResgateVantagemResponse validarResgate(Long resgateId) {
        log.info("Validando resgate ID: {}", resgateId);

        ResgateVantagem resgate = resgateVantagemRepository.findById(resgateId)
                .orElseThrow(() -> new IllegalArgumentException("Resgate não encontrado"));

        // Verificar se o resgate já foi utilizado
        if (resgate.getUtilizado()) {
            log.warn("Tentativa de validar resgate já utilizado: {}", resgateId);
            throw new IllegalStateException("Este resgate já foi utilizado anteriormente");
        }

        // Marcar como utilizado
        resgate.setUtilizado(true);
        ResgateVantagem resgateSalvo = resgateVantagemRepository.save(resgate);

        log.info("Resgate validado com sucesso: {}", resgateId);

        // Envia email de confirmação de validação
        emailJSService.enviarEmailGenerico(
            resgate.getAluno().getEmail(),
            resgate.getAluno().getNome(),
            "Resgate Validado com Sucesso",
            String.format(
                "Olá %s!\n\nSeu resgate da vantagem '%s' (código: %s) foi validado com sucesso!\n\n" +
                "Aproveite sua recompensa!\n\nEquipe Virtus",
                resgate.getAluno().getNome(),
                resgate.getVantagem().getNome(),
                resgate.getCodigoResgate()
            )
        );

        return ResgateVantagemResponse.fromEntity(resgateSalvo);
    }
}
