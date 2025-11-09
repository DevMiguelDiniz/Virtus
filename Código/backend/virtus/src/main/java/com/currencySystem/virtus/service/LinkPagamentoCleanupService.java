package com.currencySystem.virtus.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.currencySystem.virtus.repository.AlunoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LinkPagamentoCleanupService {

    private final AlunoRepository alunoRepository;

    /**
     * Limpa automaticamente links de pagamento expirados
     * Executa a cada 1 minuto
     */
    @Scheduled(fixedRate = 60000) // 60000 ms = 1 minuto
    @Transactional
    public void limparLinksExpirados() {
        LocalDateTime agora = LocalDateTime.now();
        int linksRemovidos = alunoRepository.limparLinksExpirados(agora);
        
        if (linksRemovidos > 0) {
            log.info("Links de pagamento expirados removidos: {}", linksRemovidos);
        }
    }
}
