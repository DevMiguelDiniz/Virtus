package com.currencySystem.virtus.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.currencySystem.virtus.dto.AlunoRequest;
import com.currencySystem.virtus.dto.AlunoResponse;
import com.currencySystem.virtus.dto.AlunoUpdateRequest;
import com.currencySystem.virtus.dto.LinkPagamentoResponse;
import com.currencySystem.virtus.dto.ResgateVantagemResponse;
import com.currencySystem.virtus.dto.TransacaoResponse;
import com.currencySystem.virtus.model.Aluno;
import com.currencySystem.virtus.model.Instituicao;
import com.currencySystem.virtus.model.ResgateVantagem;
import com.currencySystem.virtus.model.Transacao;
import com.currencySystem.virtus.model.Vantagem;
import com.currencySystem.virtus.repository.AlunoRepository;
import com.currencySystem.virtus.repository.InstituicaoRepository;
import com.currencySystem.virtus.repository.ResgateVantagemRepository;
import com.currencySystem.virtus.repository.TransacaoRepository;
import com.currencySystem.virtus.repository.VantagemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    private final VantagemRepository vantagemRepository;
    private final ResgateVantagemRepository resgateVantagemRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AlunoResponse cadastrar(AlunoRequest request) {
        if (alunoRepository.existsByLogin(request.getLogin())) {
            throw new IllegalArgumentException("Login já cadastrado");
        }
        if (alunoRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (alunoRepository.existsByCpf(request.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        // Buscar instituição
        Instituicao instituicao = instituicaoRepository.findBySigla(request.getInstituicao())
                .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada: " + request.getInstituicao()));

        Aluno aluno = new Aluno(
                request.getLogin(),
                passwordEncoder.encode(request.getSenha()),
                request.getNome(),
                request.getEmail(),
                request.getCpf(),
                request.getRg(),
                request.getEndereco(),
                instituicao
        );

        Aluno savedAluno = alunoRepository.save(aluno);
        return AlunoResponse.fromEntity(savedAluno);
    }

    @Transactional(readOnly = true)
    public Aluno buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AlunoResponse buscarPorIdDTO(Long id) {
        Aluno aluno = buscarPorId(id);
        return AlunoResponse.fromEntity(aluno);
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponse> consultarExtrato(Long alunoId) {
        Aluno aluno = buscarPorId(alunoId);
        return transacaoRepository.findByAlunoIdOrderByDataHoraDesc(alunoId)
                .stream()
                .map(TransacaoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResgateVantagemResponse trocarMoedas(Long alunoId, Long vantagemId) {
        Aluno aluno = buscarPorId(alunoId);
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new IllegalArgumentException("Vantagem não encontrada"));

        if (!vantagem.isDisponivel()) {
            throw new IllegalStateException("Vantagem não está disponível");
        }

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        if (!aluno.trocarMoedas(vantagem)) {
            throw new IllegalStateException("Erro ao realizar a troca de moedas");
        }

        ResgateVantagem resgate = new ResgateVantagem();
        resgate.setAluno(aluno);
        resgate.setVantagem(vantagem);
        resgate.setValorMoedas(vantagem.getCustoMoedas());
        resgate.setDataResgate(LocalDateTime.now());
        resgate.setUtilizado(false);

        alunoRepository.save(aluno);
        resgateVantagemRepository.save(resgate);

        aluno.notificarEmail("Você resgatou a vantagem: " + vantagem.getNome() +
                            ". Código de resgate: " + resgate.getCodigoResgate());

        return ResgateVantagemResponse.fromEntity(resgate);
    }

    @Transactional(readOnly = true)
    public List<ResgateVantagemResponse> listarResgates(Long alunoId) {
        buscarPorId(alunoId); 
        return resgateVantagemRepository.findByAlunoIdOrderByDataResgateDesc(alunoId)
                .stream()
                .map(ResgateVantagemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Integer consultarSaldo(Long alunoId) {
        Aluno aluno = buscarPorId(alunoId);
        return aluno.getSaldoMoedas();
    }

    @Transactional
    public AlunoResponse atualizar(Long id, AlunoUpdateRequest request) {
        Aluno aluno = buscarPorId(id);

        if (request.getNome() != null) {
            aluno.setNome(request.getNome());
        }
        if (request.getEmail() != null) {
            aluno.setEmail(request.getEmail());
        }
        if (request.getEndereco() != null) {
            aluno.setEndereco(request.getEndereco());
        }
        if (request.getRg() != null) {
            aluno.setRg(request.getRg());
        }

        if (request.getSenha() != null) {
            aluno.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        Aluno updated = alunoRepository.save(aluno);
        return AlunoResponse.fromEntity(updated);
    }

    @Transactional
    public LinkPagamentoResponse gerarLinkPagamento(Long alunoId, String link, Double valor) {
        Aluno aluno = buscarPorId(alunoId);
        
        // Validação: valor não pode ser negativo
        if (valor != null && valor < 0) {
            throw new IllegalArgumentException("O valor não pode ser negativo");
        }
        
        aluno.setLinkPagamento(link, valor);
        alunoRepository.save(aluno);
        
        return new LinkPagamentoResponse(
            link,
            valor,
            aluno.getLinkPagamentoExpiraEm(),
            false
        );
    }

    @Transactional(readOnly = true)
    public LinkPagamentoResponse obterLinkPagamento(Long alunoId) {
        Aluno aluno = buscarPorId(alunoId);
        String link = aluno.getLinkPagamento();
        Double valor = aluno.getValorLinkPagamento();
        
        if (link == null) {
            return new LinkPagamentoResponse(null, null, null, true);
        }
        
        boolean expirado = LocalDateTime.now().isAfter(aluno.getLinkPagamentoExpiraEm());
        
        return new LinkPagamentoResponse(
            expirado ? null : link,
            expirado ? null : valor,
            aluno.getLinkPagamentoExpiraEm(),
            expirado
        );
    }

    @Transactional
    public void removerLinkPagamento(Long alunoId) {
        Aluno aluno = buscarPorId(alunoId);
        aluno.setLinkPagamento(null);
        alunoRepository.save(aluno);
    }

    @Transactional
    public TransacaoResponse pagarLink(Long pagadorId, String link) {
        // Buscar o aluno que possui este link de pagamento
        Aluno destinatario = alunoRepository.findByLinkPagamento(link)
            .orElseThrow(() -> new IllegalArgumentException("Link de pagamento não encontrado ou expirado"));

        // Verificar se o link ainda está válido
        if (destinatario.getLinkPagamentoExpiraEm() == null ||
            LocalDateTime.now().isAfter(destinatario.getLinkPagamentoExpiraEm())) {
            throw new IllegalArgumentException("Link de pagamento expirado");
        }

        Double valor = destinatario.getValorLinkPagamento();
        if (valor == null || valor <= 0) {
            throw new IllegalArgumentException("Valor do link de pagamento inválido");
        }

        // Criar a transação
        Transacao transacao = new Transacao();
        transacao.setValor(valor.intValue());
        transacao.setMotivo("Pagamento via link: " + link.substring(link.lastIndexOf('/') + 1));
        transacao.setDataHora(LocalDateTime.now());
        transacao.setAluno(destinatario);
        transacao.setProfessor(null); // Pagamento via link não tem professor

        // Atualizar saldo do destinatario (aluno)
        destinatario.setSaldoMoedas(destinatario.getSaldoMoedas() + valor.intValue());

        // Remover o link usado
        destinatario.setLinkPagamento(null);

        transacaoRepository.save(transacao);
        alunoRepository.save(destinatario);

        return TransacaoResponse.fromEntity(transacao);
    }

    @Transactional
    public ResgateVantagemResponse validarResgate(Long alunoId, Long resgateId) {
        Aluno aluno = buscarPorId(alunoId);

        ResgateVantagem resgate = resgateVantagemRepository.findById(resgateId)
                .orElseThrow(() -> new IllegalArgumentException("Resgate não encontrado"));

        // Verificar se o resgate pertence ao aluno autenticado
        if (!resgate.getAluno().getId().equals(alunoId)) {
            throw new IllegalStateException("Este resgate não pertence a este aluno");
        }

        // Verificar se o resgate já foi utilizado
        if (resgate.getUtilizado()) {
            throw new IllegalStateException("Este resgate já foi utilizado");
        }

        // Marcar como utilizado
        resgate.setUtilizado(true);
        resgateVantagemRepository.save(resgate);

        aluno.notificarEmail("Seu resgate da vantagem " + resgate.getVantagem().getNome() +
                           " (código: " + resgate.getCodigoResgate() + ") foi validado com sucesso!");

        return ResgateVantagemResponse.fromEntity(resgate);
    }
}
