package com.currencySystem.virtus.controller;

import com.currencySystem.virtus.dto.AdminRequest;
import com.currencySystem.virtus.dto.AdminResponse;
import com.currencySystem.virtus.dto.GerenciarMoedasRequest;
import com.currencySystem.virtus.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * POST /api/admins/cadastro
     * Cadastra um novo admin no sistema
     * @param request Dados do admin para cadastro
     * @return Dados do admin cadastrado
     */
    @PostMapping("/cadastro")
    public ResponseEntity<AdminResponse> cadastrar(@Valid @RequestBody AdminRequest request) {
        AdminResponse response = adminService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/admins/{id}
     * Busca dados de um admin específico
     * @param id ID do admin
     * @return Dados do admin
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> buscarPorId(@PathVariable Long id) {
        AdminResponse response = adminService.buscarPorIdDTO(id);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/admins/alunos/adicionar-moedas
     * Adiciona moedas a um aluno
     * @param request Dados da operação (usuarioId, valor, motivo)
     * @return Mensagem de sucesso
     */
    @PostMapping("/alunos/adicionar-moedas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> adicionarMoedasAluno(@Valid @RequestBody GerenciarMoedasRequest request) {
        String mensagem = adminService.adicionarMoedasAluno(request);
        return ResponseEntity.ok(Map.of("mensagem", mensagem));
    }

    /**
     * POST /api/admins/alunos/remover-moedas
     * Remove moedas de um aluno
     * @param request Dados da operação (usuarioId, valor, motivo)
     * @return Mensagem de sucesso
     */
    @PostMapping("/alunos/remover-moedas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> removerMoedasAluno(@Valid @RequestBody GerenciarMoedasRequest request) {
        String mensagem = adminService.removerMoedasAluno(request);
        return ResponseEntity.ok(Map.of("mensagem", mensagem));
    }

    /**
     * POST /api/admins/professores/adicionar-moedas
     * Adiciona moedas a um professor
     * @param request Dados da operação (usuarioId, valor, motivo)
     * @return Mensagem de sucesso
     */
    @PostMapping("/professores/adicionar-moedas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> adicionarMoedasProfessor(@Valid @RequestBody GerenciarMoedasRequest request) {
        String mensagem = adminService.adicionarMoedasProfessor(request);
        return ResponseEntity.ok(Map.of("mensagem", mensagem));
    }

    /**
     * POST /api/admins/professores/remover-moedas
     * Remove moedas de um professor
     * @param request Dados da operação (usuarioId, valor, motivo)
     * @return Mensagem de sucesso
     */
    @PostMapping("/professores/remover-moedas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> removerMoedasProfessor(@Valid @RequestBody GerenciarMoedasRequest request) {
        String mensagem = adminService.removerMoedasProfessor(request);
        return ResponseEntity.ok(Map.of("mensagem", mensagem));
    }
}
