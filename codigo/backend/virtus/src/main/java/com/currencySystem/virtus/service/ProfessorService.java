package com.currencySystem.virtus.service;

import com.currencySystem.virtus.dto.*;
import com.currencySystem.virtus.model.Aluno;
import com.currencySystem.virtus.model.Instituicao;
import com.currencySystem.virtus.model.Professor;
import com.currencySystem.virtus.model.Transacao;
import com.currencySystem.virtus.repository.AlunoRepository;
import com.currencySystem.virtus.repository.InstituicaoRepository;
import com.currencySystem.virtus.repository.ProfessorRepository;
import com.currencySystem.virtus.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ProfessorResponse cadastrar(ProfessorRequest request) {
        if (professorRepository.existsByLogin(request.getLogin())) {
            throw new IllegalArgumentException("Login já cadastrado");
        }
        if (professorRepository.existsByCpf(request.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        // Buscar ou criar instituições
        List<Instituicao> instituicoes = request.getInstituicoes().stream()
                .map(sigla -> instituicaoRepository.findBySigla(sigla)
                        .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada: " + sigla)))
                .collect(Collectors.toList());

        Professor professor = new Professor(
                request.getLogin(),
                passwordEncoder.encode(request.getSenha()),
                request.getNome(),
                request.getCpf(),
                request.getRg(),
                request.getDepartamento(),
                instituicoes
        );

        Professor saved = professorRepository.save(professor);
        return ProfessorResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Professor buscarPorId(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));
    }

    @Transactional(readOnly = true)
    public ProfessorResponse buscarPorIdDTO(Long id) {
        Professor professor = buscarPorId(id);
        return ProfessorResponse.fromEntity(professor);
    }

    @Transactional(readOnly = true)
    public List<Professor> listarTodos() {
        return professorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AlunoResponse> listarAlunosDasInstituicoes(Long professorId) {
        Professor professor = buscarPorId(professorId);

        // Buscar alunos das instituições do professor
        List<Aluno> alunos = alunoRepository.findByInstituicaoIn(professor.getInstituicoes());

        return alunos.stream()
                .map(AlunoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponse> consultarExtrato(Long professorId) {
        buscarPorId(professorId);
        return transacaoRepository.findByProfessorIdOrderByDataHoraDesc(professorId)
                .stream()
                .map(TransacaoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransacaoResponse enviarMoedas(Long professorId, Long alunoId, Integer valor, String motivo) {
        Professor professor = buscarPorId(professorId);
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        // Validar se o aluno pertence a alguma instituição do professor
        boolean alunoNaMesmaInstituicao = professor.getInstituicoes().stream()
                .anyMatch(inst -> inst.equals(aluno.getInstituicao()));

        if (!alunoNaMesmaInstituicao) {
            throw new IllegalArgumentException(
                    "Você só pode enviar moedas para alunos das instituições em que leciona. " +
                    "Aluno pertence à: " + aluno.getInstituicao().getSigla()
            );
        }

        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }

        if (!professor.temSaldoSuficiente(valor)) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        Transacao transacao = professor.enviarMoedas(aluno, valor, motivo);

        alunoRepository.save(aluno);
        professorRepository.save(professor);
        professorRepository.flush();

        return TransacaoResponse.fromEntity(transacao);
    }

    @Transactional
    public void creditarMoedasSemestral(Long professorId, Integer valor) {
        Professor professor = buscarPorId(professorId);

        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }

        professor.creditarMoedasSemestral(valor);
        professorRepository.save(professor);
    }

    @Transactional
    public void resetarSaldoSemestral(Long professorId) {
        Professor professor = buscarPorId(professorId);
        professor.resetarSaldoSemestral();
        professorRepository.save(professor);
    }

    @Transactional(readOnly = true)
    public Integer consultarSaldo(Long professorId) {
        Professor professor = buscarPorId(professorId);
        return professor.getSaldoMoedas();
    }

    @Transactional
    public ProfessorResponse atualizar(Long id, ProfessorUpdateRequest request) {
        Professor professor = buscarPorId(id);

        // Atualiza apenas os campos que foram enviados (não nulos)
        if (request.getNome() != null) {
            professor.setNome(request.getNome());
        }
        if (request.getDepartamento() != null) {
            professor.setDepartamento(request.getDepartamento());
        }
        if (request.getSenha() != null) {
            professor.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        Professor updated = professorRepository.save(professor);
        return ProfessorResponse.fromEntity(updated);
    }
}
