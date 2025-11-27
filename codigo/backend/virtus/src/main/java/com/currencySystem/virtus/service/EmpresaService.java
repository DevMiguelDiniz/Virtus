package com.currencySystem.virtus.service;

import com.currencySystem.virtus.dto.*;
import com.currencySystem.virtus.model.Empresa;
import com.currencySystem.virtus.model.Vantagem;
import com.currencySystem.virtus.model.ResgateVantagem;
import com.currencySystem.virtus.repository.EmpresaRepository;
import com.currencySystem.virtus.repository.VantagemRepository;
import com.currencySystem.virtus.repository.ResgateVantagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final VantagemRepository vantagemRepository;
    private final ResgateVantagemRepository resgateVantagemRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public EmpresaResponse cadastrar(EmpresaRequest request) {
        if (empresaRepository.existsByLogin(request.getLogin())) {
            throw new IllegalArgumentException("Login já cadastrado");
        }
        if (empresaRepository.existsByCnpj(request.getCnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado");
        }
        if (empresaRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Empresa empresa = new Empresa(
                request.getLogin(),
                passwordEncoder.encode(request.getSenha()),
                request.getNome(),
                request.getCnpj(),
                request.getEndereco(),
                request.getEmail()
        );

        Empresa savedEmpresa = empresaRepository.save(empresa);
        return EmpresaResponse.fromEntity(savedEmpresa);
    }

    @Transactional(readOnly = true)
    public Empresa buscarPorId(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));
    }

    @Transactional(readOnly = true)
    public EmpresaResponse buscarPorIdDTO(Long id) {
        Empresa empresa = buscarPorId(id);
        return EmpresaResponse.fromEntity(empresa);
    }

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listarTodas() {
        return empresaRepository.findAll().stream()
                .map(EmpresaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmpresaResponse atualizar(Long id, EmpresaUpdateRequest request) {
        Empresa empresa = buscarPorId(id);

        // Atualiza apenas os campos que foram enviados (não nulos)
        if (request.getNome() != null) {
            empresa.setNome(request.getNome());
        }
        if (request.getEndereco() != null) {
            empresa.setEndereco(request.getEndereco());
        }
        if (request.getEmail() != null) {
            empresa.setEmail(request.getEmail());
        }
        if (request.getSenha() != null) {
            empresa.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        Empresa updated = empresaRepository.save(empresa);
        return EmpresaResponse.fromEntity(updated);
    }

    @Transactional
    public VantagemResponse cadastrarVantagem(Long empresaId, VantagemRequest request) {
        Empresa empresa = buscarPorId(empresaId);

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(request.getNome());
        vantagem.setDescricao(request.getDescricao());
        vantagem.setCustoMoedas(request.getCustoMoedas());
        vantagem.setUrlFoto(request.getUrlFoto());
        vantagem.setEmpresa(empresa);
        vantagem.setAtiva(true);

        Vantagem savedVantagem = vantagemRepository.save(vantagem);
        return VantagemResponse.fromEntity(savedVantagem);
    }

    @Transactional(readOnly = true)
    public List<VantagemResponse> listarVantagensDaEmpresa(Long empresaId) {
        buscarPorId(empresaId); // Valida se empresa existe
        return vantagemRepository.findByEmpresaId(empresaId).stream()
                .map(VantagemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public VantagemResponse atualizarVantagem(Long empresaId, Long vantagemId, VantagemUpdateRequest request) {
        Empresa empresa = buscarPorId(empresaId);
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new IllegalArgumentException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(empresaId)) {
            throw new IllegalStateException("Esta vantagem não pertence a esta empresa");
        }

        // Atualiza apenas os campos que foram enviados (não nulos)
        if (request.getNome() != null) {
            vantagem.setNome(request.getNome());
        }
        if (request.getDescricao() != null) {
            vantagem.setDescricao(request.getDescricao());
        }
        if (request.getCustoMoedas() != null) {
            vantagem.setCustoMoedas(request.getCustoMoedas());
        }
        if (request.getUrlFoto() != null) {
            vantagem.setUrlFoto(request.getUrlFoto());
        }
        if (request.getAtiva() != null) {
            vantagem.setAtiva(request.getAtiva());
        }

        Vantagem updated = vantagemRepository.save(vantagem);
        return VantagemResponse.fromEntity(updated);
    }

    @Transactional
    public void excluirVantagem(Long empresaId, Long vantagemId) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new IllegalArgumentException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(empresaId)) {
            throw new IllegalStateException("Esta vantagem não pertence a esta empresa");
        }

        vantagemRepository.delete(vantagem);
    }

    @Transactional(readOnly = true)
    public List<ResgateVantagemResponse> listarResgatesDaEmpresa(Long empresaId) {
        buscarPorId(empresaId); // Valida se empresa existe

        List<Vantagem> vantagens = vantagemRepository.findByEmpresaId(empresaId);
        List<Long> vantagemIds = vantagens.stream()
                .map(Vantagem::getId)
                .collect(Collectors.toList());

        return resgateVantagemRepository.findAll().stream()
                .filter(resgate -> vantagemIds.contains(resgate.getVantagem().getId()))
                .map(ResgateVantagemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void validarResgate(Long empresaId, String codigoResgate) {
        Empresa empresa = buscarPorId(empresaId);

        ResgateVantagem resgate = resgateVantagemRepository.findByCodigoResgate(codigoResgate)
                .orElseThrow(() -> new IllegalArgumentException("Código de resgate não encontrado"));

        if (!resgate.getVantagem().getEmpresa().getId().equals(empresaId)) {
            throw new IllegalStateException("Este resgate não pertence a esta empresa");
        }

        if (resgate.getUtilizado()) {
            throw new IllegalStateException("Este cupom já foi utilizado");
        }

        resgate.setUtilizado(true);
        resgateVantagemRepository.save(resgate);

        empresa.notificarEmail("Cupom " + codigoResgate + " foi utilizado com sucesso!");
    }
}