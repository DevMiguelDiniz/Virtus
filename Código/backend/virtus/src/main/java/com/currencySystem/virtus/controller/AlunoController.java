package com.currencySystem.virtus.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.currencySystem.virtus.dto.AlunoRequest;
import com.currencySystem.virtus.dto.AlunoResponse;
import com.currencySystem.virtus.dto.AlunoUpdateRequest;
import com.currencySystem.virtus.dto.LinkPagamentoRequest;
import com.currencySystem.virtus.dto.LinkPagamentoResponse;
import com.currencySystem.virtus.dto.PagarLinkRequest;
import com.currencySystem.virtus.dto.ResgateVantagemRequest;
import com.currencySystem.virtus.dto.ResgateVantagemResponse;
import com.currencySystem.virtus.dto.TransacaoResponse;
import com.currencySystem.virtus.model.Aluno;
import com.currencySystem.virtus.service.AlunoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    /**
     * POST /api/alunos/cadastro
     * Cadastra um novo aluno no sistema
     * @param request Dados do aluno para cadastro
     * @return Dados do aluno cadastrado
     */
    @PostMapping("/cadastro")
    public ResponseEntity<AlunoResponse> cadastrar(@Valid @RequestBody AlunoRequest request) {
        AlunoResponse response = alunoService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/alunos/{id}
     * Busca dados de um aluno específico
     * @param id ID do aluno
     * @param authentication Dados de autenticação
     * @return Dados do aluno
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<AlunoResponse> buscarPorId(@PathVariable Long id, Authentication authentication) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        AlunoResponse response = alunoService.buscarPorIdDTO(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/alunos/{id}/extrato
     * Consulta extrato de transações do aluno
     * @param id ID do aluno
     * @param authentication Dados de autenticação
     * @return Lista de transações do aluno
     */
    @GetMapping("/{id}/extrato")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<TransacaoResponse>> consultarExtrato(@PathVariable Long id, Authentication authentication) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<TransacaoResponse> extrato = alunoService.consultarExtrato(id);
        return ResponseEntity.ok(extrato);
    }

    /**
     * POST /api/alunos/{id}/resgatar-vantagem
     * Resgata uma vantagem usando moedas virtuais
     * @param id ID do aluno
     * @param request Dados do resgate (ID da vantagem)
     * @param authentication Dados de autenticação
     * @return Dados do resgate realizado
     */
    @PostMapping("/{id}/resgatar-vantagem")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<ResgateVantagemResponse> trocarMoedas(
            @PathVariable Long id,
            @Valid @RequestBody ResgateVantagemRequest request,
            Authentication authentication
    ) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ResgateVantagemResponse response = alunoService.trocarMoedas(id, request.getVantagemId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/alunos/{id}/resgates
     * Lista todos os resgates de vantagens do aluno
     * @param id ID do aluno
     * @param authentication Dados de autenticação
     * @return Lista de resgates realizados
     */
    @GetMapping("/{id}/resgates")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<ResgateVantagemResponse>> listarResgates(@PathVariable Long id, Authentication authentication) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<ResgateVantagemResponse> resgates = alunoService.listarResgates(id);
        return ResponseEntity.ok(resgates);
    }

    /**
     * GET /api/alunos/{id}/saldo
     * Consulta saldo de moedas virtuais do aluno
     * @param id ID do aluno
     * @param authentication Dados de autenticação
     * @return Saldo atual do aluno
     */
    @GetMapping("/{id}/saldo")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<Map<String, Integer>> consultarSaldo(@PathVariable Long id, Authentication authentication) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Integer saldo = alunoService.consultarSaldo(id);
        return ResponseEntity.ok(Map.of("saldo", saldo));
    }

    /**
     * PUT /api/alunos/{id}
     * Atualiza dados de um aluno
     * @param id ID do aluno
     * @param request Dados atualizados do aluno
     * @param authentication Dados de autenticação
     * @return Dados atualizados do aluno
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<AlunoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AlunoUpdateRequest request,
            Authentication authentication
    ) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        AlunoResponse response = alunoService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/alunos/{id}/link-pagamento
     * Gera um link de pagamento temporário (válido por 5 minutos)
     * @param id ID do aluno
     * @param request Link de pagamento e valor a ser armazenado
     * @param authentication Dados de autenticação
     * @return Link de pagamento com valor e data de expiração
     */
    @PostMapping("/{id}/link-pagamento")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<LinkPagamentoResponse> gerarLinkPagamento(
            @PathVariable Long id,
            @Valid @RequestBody LinkPagamentoRequest request,
            Authentication authentication
    ) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        LinkPagamentoResponse response = alunoService.gerarLinkPagamento(
            id, 
            request.getLinkPagamento(), 
            request.getValor()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/alunos/{id}/link-pagamento
     * Obtém o link de pagamento do aluno com o valor associado (se ainda válido)
     * @param id ID do aluno
     * @param authentication Dados de autenticação
     * @return Link de pagamento com valor ou null se expirado
     */
    @GetMapping("/{id}/link-pagamento")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<LinkPagamentoResponse> obterLinkPagamento(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        LinkPagamentoResponse response = alunoService.obterLinkPagamento(id);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/alunos/{id}/link-pagamento
     * Remove o link de pagamento do aluno
     * @param id ID do aluno
     * @param authentication Dados de autenticação
     * @return Status sem conteúdo
     */
    @DeleteMapping("/{id}/link-pagamento")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<Void> removerLinkPagamento(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Aluno alunoAutenticado = (Aluno) authentication.getPrincipal();
        if (!alunoAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        alunoService.removerLinkPagamento(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/alunos/pagar-link
     * Processa o pagamento de um link de pagamento
     * @param request Dados do pagamento (pagadorId e link)
     * @param authentication Dados de autenticação
     * @return Dados da transação realizada
     */
    @PostMapping("/pagar-link")
    @PreAuthorize("hasAnyRole('PROFESSOR', 'ALUNO')")
    public ResponseEntity<TransacaoResponse> pagarLink(
            @Valid @RequestBody PagarLinkRequest request,
            Authentication authentication
    ) {
        TransacaoResponse response = alunoService.pagarLink(request.getPagadorId(), request.getLink());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
