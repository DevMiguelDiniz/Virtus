package com.currencySystem.virtus.controller;

import com.currencySystem.virtus.dto.*;
import com.currencySystem.virtus.model.Professor;
import com.currencySystem.virtus.service.ProfessorService;
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
@RequestMapping("/api/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    /**
     * POST /api/professores/cadastro
     * Cadastra um novo professor no sistema
     * @param request Dados do professor para cadastro
     * @return Dados do professor cadastrado
     */
    @PostMapping("/cadastro")
    public ResponseEntity<ProfessorResponse> cadastrar(@Valid @RequestBody ProfessorRequest request) {
        ProfessorResponse response = professorService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/professores/{id}
     * Busca dados de um professor específico
     * @param id ID do professor
     * @param authentication Dados de autenticação
     * @return Dados do professor
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<ProfessorResponse> buscarPorId(@PathVariable Long id, Authentication authentication) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ProfessorResponse response = professorService.buscarPorIdDTO(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/professores/{id}/extrato
     * Consulta extrato de transações do professor
     * @param id ID do professor
     * @param authentication Dados de autenticação
     * @return Lista de transações do professor
     */
    @GetMapping("/{id}/extrato")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<TransacaoResponse>> consultarExtrato(@PathVariable Long id, Authentication authentication) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<TransacaoResponse> extrato = professorService.consultarExtrato(id);
        return ResponseEntity.ok(extrato);
    }

    /**
     * GET /api/professores/{id}/alunos
     * Lista alunos das instituições que o professor participa
     * @param id ID do professor
     * @param authentication Dados de autenticação
     * @return Lista de alunos das mesmas instituições
     */
    @GetMapping("/{id}/alunos")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<AlunoResponse>> listarAlunosDasInstituicoes(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<AlunoResponse> alunos = professorService.listarAlunosDasInstituicoes(id);
        return ResponseEntity.ok(alunos);
    }

    /**
     * POST /api/professores/{id}/enviar-moedas
     * Envia moedas virtuais para um aluno
     * @param id ID do professor
     * @param request Dados da transferência (ID do aluno, valor, motivo)
     * @param authentication Dados de autenticação
     * @return Dados da transação realizada
     */
    @PostMapping("/{id}/enviar-moedas")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<TransacaoResponse> enviarMoedas(
            @PathVariable Long id,
            @Valid @RequestBody TransferenciaRequest request,
            Authentication authentication
    ) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        TransacaoResponse response = professorService.enviarMoedas(
                id,
                request.getAlunoId(),
                request.getValor(),
                request.getMotivo()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/professores/{id}/saldo
     * Consulta saldo de moedas virtuais do professor
     * @param id ID do professor
     * @param authentication Dados de autenticação
     * @return Saldo atual do professor
     */
    @GetMapping("/{id}/saldo")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Map<String, Integer>> consultarSaldo(@PathVariable Long id, Authentication authentication) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Integer saldo = professorService.consultarSaldo(id);
        return ResponseEntity.ok(Map.of("saldo", saldo));
    }

    /**
     * PUT /api/professores/{id}
     * Atualiza dados de um professor
     * @param id ID do professor
     * @param request Dados atualizados do professor
     * @param authentication Dados de autenticação
     * @return Dados atualizados do professor
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<ProfessorResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProfessorUpdateRequest request,
            Authentication authentication
    ) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ProfessorResponse response = professorService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/professores/{id}/creditar-semestral
     * Credita moedas semestrais para o professor
     * @param id ID do professor
     * @param request Valor a ser creditado
     * @param authentication Dados de autenticação
     * @return Confirmação da operação
     */
    @PostMapping("/{id}/creditar-semestral")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> creditarMoedasSemestral(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request,
            Authentication authentication
    ) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Integer valor = request.get("valor");
        professorService.creditarMoedasSemestral(id, valor);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /api/professores/{id}/resetar-saldo
     * Reseta o saldo semestral do professor
     * @param id ID do professor
     * @param authentication Dados de autenticação
     * @return Confirmação da operação
     */
    @PostMapping("/{id}/resetar-saldo")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> resetarSaldoSemestral(@PathVariable Long id, Authentication authentication) {
        Professor professorAutenticado = (Professor) authentication.getPrincipal();
        if (!professorAutenticado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        professorService.resetarSaldoSemestral(id);
        return ResponseEntity.ok().build();
    }
}
