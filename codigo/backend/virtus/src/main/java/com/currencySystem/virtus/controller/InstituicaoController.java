package com.currencySystem.virtus.controller;

import com.currencySystem.virtus.model.Instituicao;
import com.currencySystem.virtus.repository.InstituicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
@RequiredArgsConstructor
public class InstituicaoController {

    private final InstituicaoRepository instituicaoRepository;

    /**
     * GET /api/instituicoes
     * Lista todas as instituições disponíveis
     * @return Lista de instituições
     */
    @GetMapping
    public ResponseEntity<List<Instituicao>> listarTodas() {
        List<Instituicao> instituicoes = instituicaoRepository.findAll();
        return ResponseEntity.ok(instituicoes);
    }
}
