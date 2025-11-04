package com.currencySystem.virtus.controller;

import com.currencySystem.virtus.dto.VantagemResponse;
import com.currencySystem.virtus.model.Vantagem;
import com.currencySystem.virtus.repository.VantagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vantagens")
@RequiredArgsConstructor
public class VantagemController {

    private final VantagemRepository vantagemRepository;

    /**
     * GET /api/vantagens
     * Lista todas as vantagens disponíveis
     * @return Lista de todas as vantagens
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VantagemResponse>> listarTodas() {
        List<VantagemResponse> vantagens = vantagemRepository.findAll()
                .stream()
                .map(VantagemResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vantagens);
    }

    /**
     * GET /api/vantagens/ativas
     * Lista apenas as vantagens ativas
     * @return Lista de vantagens ativas
     */
    @GetMapping("/ativas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VantagemResponse>> listarAtivas() {
        List<VantagemResponse> vantagens = vantagemRepository.findByAtivaTrue()
                .stream()
                .map(VantagemResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vantagens);
    }

    /**
     * GET /api/vantagens/{id}
     * Busca uma vantagem específica por ID
     * @param id ID da vantagem
     * @return Dados da vantagem
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VantagemResponse> buscarPorId(@PathVariable Long id) {
        return vantagemRepository.findById(id)
                .map(VantagemResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/vantagens/empresa/{empresaId}
     * Lista vantagens de uma empresa específica
     * @param empresaId ID da empresa
     * @return Lista de vantagens da empresa
     */
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VantagemResponse>> listarPorEmpresa(@PathVariable Long empresaId) {
        List<VantagemResponse> vantagens = vantagemRepository.findByEmpresaId(empresaId)
                .stream()
                .map(VantagemResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vantagens);
    }
}
