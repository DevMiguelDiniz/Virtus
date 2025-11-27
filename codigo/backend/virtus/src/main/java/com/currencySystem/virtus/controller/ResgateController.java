package com.currencySystem.virtus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.currencySystem.virtus.dto.ResgateVantagemResponse;
import com.currencySystem.virtus.service.ResgateService;

import lombok.RequiredArgsConstructor;

/**
 * Controller público para validação de resgates por estabelecimentos parceiros
 * Este endpoint simula como seria o resgate no mundo real
 */
@RestController
@RequestMapping("/api/resgates")
@RequiredArgsConstructor
public class ResgateController {

    private final ResgateService resgateService;

    /**
     * GET /api/resgates/{id}
     * Busca informações de um resgate para validação
     * Endpoint público para estabelecimentos parceiros
     *
     * @param id ID do resgate
     * @return Dados do resgate
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResgateVantagemResponse> buscarResgate(@PathVariable Long id) {
        ResgateVantagemResponse response = resgateService.buscarResgate(id);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/resgates/{id}/validar
     * Valida e marca um resgate como utilizado
     * Endpoint público para estabelecimentos parceiros
     *
     * @param id ID do resgate
     * @return Dados do resgate validado
     */
    @PostMapping("/{id}/validar")
    public ResponseEntity<ResgateVantagemResponse> validarResgate(@PathVariable Long id) {
        ResgateVantagemResponse response = resgateService.validarResgate(id);
        return ResponseEntity.ok(response);
    }
}
