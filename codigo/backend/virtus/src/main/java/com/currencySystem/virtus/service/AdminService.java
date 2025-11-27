package com.currencySystem.virtus.service;

import com.currencySystem.virtus.dto.AdminRequest;
import com.currencySystem.virtus.dto.AdminResponse;
import com.currencySystem.virtus.dto.GerenciarMoedasRequest;
import com.currencySystem.virtus.model.Admin;
import com.currencySystem.virtus.model.Aluno;
import com.currencySystem.virtus.model.Professor;
import com.currencySystem.virtus.repository.AdminRepository;
import com.currencySystem.virtus.repository.AlunoRepository;
import com.currencySystem.virtus.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AdminResponse cadastrar(AdminRequest request) {
        if (adminRepository.existsByLogin(request.getLogin())) {
            throw new IllegalArgumentException("Login já cadastrado");
        }
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (adminRepository.existsByCpf(request.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        Admin admin = new Admin(
                request.getLogin(),
                passwordEncoder.encode(request.getSenha()),
                request.getNome(),
                request.getEmail(),
                request.getCpf()
        );

        Admin savedAdmin = adminRepository.save(admin);
        return AdminResponse.fromEntity(savedAdmin);
    }

    @Transactional(readOnly = true)
    public Admin buscarPorId(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin não encontrado"));
    }

    @Transactional(readOnly = true)
    public AdminResponse buscarPorIdDTO(Long id) {
        Admin admin = buscarPorId(id);
        return AdminResponse.fromEntity(admin);
    }

    @Transactional
    public String adicionarMoedasAluno(GerenciarMoedasRequest request) {
        Aluno aluno = alunoRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        Integer saldoAnterior = aluno.getSaldoMoedas();
        aluno.adicionarMoedas(request.getValor());
        alunoRepository.save(aluno);

        String mensagem = String.format(
                "Moedas adicionadas com sucesso! Saldo anterior: %d, Valor adicionado: %d, Saldo atual: %d",
                saldoAnterior, request.getValor(), aluno.getSaldoMoedas()
        );

        // Log da operação
        System.out.println(String.format(
                "[ADMIN] Adição de moedas - Aluno: %s (ID: %d), Valor: %d, Motivo: %s",
                aluno.getNome(), aluno.getId(), request.getValor(), request.getMotivo()
        ));

        return mensagem;
    }

    @Transactional
    public String removerMoedasAluno(GerenciarMoedasRequest request) {
        Aluno aluno = alunoRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        Integer saldoAnterior = aluno.getSaldoMoedas();

        if (!aluno.removerMoedas(request.getValor())) {
            throw new IllegalStateException(
                    "Não foi possível remover moedas. Saldo insuficiente ou valor inválido."
            );
        }

        alunoRepository.save(aluno);

        String mensagem = String.format(
                "Moedas removidas com sucesso! Saldo anterior: %d, Valor removido: %d, Saldo atual: %d",
                saldoAnterior, request.getValor(), aluno.getSaldoMoedas()
        );

        // Log da operação
        System.out.println(String.format(
                "[ADMIN] Remoção de moedas - Aluno: %s (ID: %d), Valor: %d, Motivo: %s",
                aluno.getNome(), aluno.getId(), request.getValor(), request.getMotivo()
        ));

        return mensagem;
    }

    @Transactional
    public String adicionarMoedasProfessor(GerenciarMoedasRequest request) {
        Professor professor = professorRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));

        Integer saldoAnterior = professor.getSaldoMoedas();
        professor.creditarMoedasSemestral(request.getValor());
        professorRepository.save(professor);

        String mensagem = String.format(
                "Moedas adicionadas com sucesso! Saldo anterior: %d, Valor adicionado: %d, Saldo atual: %d",
                saldoAnterior, request.getValor(), professor.getSaldoMoedas()
        );

        // Log da operação
        System.out.println(String.format(
                "[ADMIN] Adição de moedas - Professor: %s (ID: %d), Valor: %d, Motivo: %s",
                professor.getNome(), professor.getId(), request.getValor(), request.getMotivo()
        ));

        return mensagem;
    }

    @Transactional
    public String removerMoedasProfessor(GerenciarMoedasRequest request) {
        Professor professor = professorRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));

        Integer saldoAnterior = professor.getSaldoMoedas();

        if (professor.getSaldoMoedas() < request.getValor()) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        // Subtrair moedas do professor
        professor.setSaldoMoedas(professor.getSaldoMoedas() - request.getValor());
        professorRepository.save(professor);

        String mensagem = String.format(
                "Moedas removidas com sucesso! Saldo anterior: %d, Valor removido: %d, Saldo atual: %d",
                saldoAnterior, request.getValor(), professor.getSaldoMoedas()
        );

        // Log da operação
        System.out.println(String.format(
                "[ADMIN] Remoção de moedas - Professor: %s (ID: %d), Valor: %d, Motivo: %s",
                professor.getNome(), professor.getId(), request.getValor(), request.getMotivo()
        ));

        return mensagem;
    }
}
