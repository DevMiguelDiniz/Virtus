package com.currencySystem.virtus.controller;

import com.currencySystem.virtus.dto.*;
import com.currencySystem.virtus.model.Empresa;
import com.currencySystem.virtus.service.EmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    /**
     * POST /api/empresas/cadastro
     * Cadastra uma nova empresa parceira
     */
    @PostMapping("/cadastro")
    public ResponseEntity<EmpresaResponse> cadastrar(@Valid @RequestBody EmpresaRequest request) {
        EmpresaResponse response = empresaService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/empresas/{id}
     * Busca dados de uma empresa específica
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<EmpresaResponse> buscarPorId(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        EmpresaResponse response = empresaService.buscarPorIdDTO(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/empresas
     * Lista todas as empresas (apenas para fins de consulta)
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmpresaResponse>> listarTodas() {
        List<EmpresaResponse> empresas = empresaService.listarTodas();
        return ResponseEntity.ok(empresas);
    }

    /**
     * PUT /api/empresas/{id}
     * Atualiza dados de uma empresa
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<EmpresaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EmpresaUpdateRequest request,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        EmpresaResponse response = empresaService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/empresas/{id}/vantagens
     * Cadastra uma nova vantagem para a empresa
     */
    @PostMapping("/{id}/vantagens")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<VantagemResponse> cadastrarVantagem(
            @PathVariable Long id,
            @Valid @RequestBody VantagemRequest request,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        VantagemResponse response = empresaService.cadastrarVantagem(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/empresas/{id}/vantagens
     * Lista todas as vantagens da empresa
     */
    @GetMapping("/{id}/vantagens")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<VantagemResponse>> listarVantagens(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<VantagemResponse> vantagens = empresaService.listarVantagensDaEmpresa(id);
        return ResponseEntity.ok(vantagens);
    }

    /**
     * PUT /api/empresas/{id}/vantagens/{vantagemId}
     * Atualiza uma vantagem específica
     */
    @PutMapping("/{id}/vantagens/{vantagemId}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<VantagemResponse> atualizarVantagem(
            @PathVariable Long id,
            @PathVariable Long vantagemId,
            @Valid @RequestBody VantagemUpdateRequest request,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        VantagemResponse response = empresaService.atualizarVantagem(id, vantagemId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/empresas/{id}/vantagens/{vantagemId}
     * Remove (desativa) uma vantagem
     */
    @DeleteMapping("/{id}/vantagens/{vantagemId}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> excluirVantagem(
            @PathVariable Long id,
            @PathVariable Long vantagemId,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        empresaService.excluirVantagem(id, vantagemId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/empresas/{id}/resgates
     * Lista todos os resgates de vantagens da empresa
     */
    @GetMapping("/{id}/resgates")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<ResgateVantagemResponse>> listarResgates(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<ResgateVantagemResponse> resgates = empresaService.listarResgatesDaEmpresa(id);
        return ResponseEntity.ok(resgates);
    }

    /**
     * POST /api/empresas/{id}/validar-resgate
     * Valida e marca um cupom como utilizado
     */
    @PostMapping("/{id}/validar-resgate")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Map<String, String>> validarResgate(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        Empresa empresaAutenticada = (Empresa) authentication.getPrincipal();
        if (!empresaAutenticada.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String codigoResgate = request.get("codigoResgate");
        empresaService.validarResgate(id, codigoResgate);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Cupom validado e marcado como utilizado com sucesso!"
        ));
    }
}