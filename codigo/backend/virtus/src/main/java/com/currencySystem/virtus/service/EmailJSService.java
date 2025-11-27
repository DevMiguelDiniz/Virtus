package com.currencySystem.virtus.service;

import com.currencySystem.virtus.config.AppProperties;
import com.currencySystem.virtus.config.EmailJSProperties;
import com.currencySystem.virtus.model.ResgateVantagem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailJSService {

    private final EmailJSProperties emailJSProperties;
    private final AppProperties appProperties;
    private final QRCodeService qrCodeService;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Envia email de forma assíncrona com QR Code do resgate
     *
     * @param resgate Objeto ResgateVantagem contendo dados do resgate
     * @param emailDestino Email do destinatário
     */
    @Async
    public void enviarEmailResgate(ResgateVantagem resgate, String emailDestino) {
        if (!emailJSProperties.isEnabled()) {
            log.warn("Envio de email desabilitado. Email não será enviado para: {}", emailDestino);
            return;
        }

        try {
            log.info("Iniciando envio de email de resgate para: {}", emailDestino);

            // Gera URL de validação do resgate
            String resgateUrl = appProperties.getResgateValidationUrl(resgate.getId());
            log.info("URL de validação gerada: {}", resgateUrl);

            // Gera QR Code em Base64 com a URL
            String qrCodeBase64 = qrCodeService.generateQRCodeBase64(resgateUrl);

            // Prepara os dados do email
            Map<String, Object> templateParams = new HashMap<>();
            templateParams.put("to_email", emailDestino);
            templateParams.put("to_name", resgate.getAluno().getNome());
            templateParams.put("vantagem_nome", resgate.getVantagem().getNome());
            templateParams.put("codigo_resgate", resgate.getCodigoResgate());
            templateParams.put("resgate_url", resgateUrl);
            templateParams.put("valor_moedas", resgate.getValorMoedas());
            templateParams.put("data_resgate", resgate.getDataResgate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
            templateParams.put("qr_code_base64", qrCodeBase64);
            templateParams.put("from_name", emailJSProperties.getFromName());
            templateParams.put("reply_to", emailJSProperties.getReplyTo());

            // Monta o payload da requisição EmailJS
            Map<String, Object> emailPayload = new HashMap<>();
            emailPayload.put("service_id", emailJSProperties.getServiceId());
            emailPayload.put("template_id", emailJSProperties.getTemplateId());
            emailPayload.put("user_id", emailJSProperties.getPublicKey());
            emailPayload.put("template_params", templateParams);

            // Configura headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Cria a requisição
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailPayload, headers);

            // Envia a requisição para EmailJS
            ResponseEntity<String> response = restTemplate.postForEntity(
                emailJSProperties.getApiUrl(),
                request,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email de resgate enviado com sucesso para: {}", emailDestino);
            } else {
                log.error("Erro ao enviar email. Status: {}, Response: {}",
                    response.getStatusCode(), response.getBody());
            }

        } catch (Exception e) {
            log.error("Erro ao enviar email de resgate para: {}", emailDestino, e);
            // Não propaga a exceção para não quebrar o fluxo de resgate
            // O resgate já foi salvo, o email é apenas uma notificação
        }
    }

    /**
     * Envia email genérico usando EmailJS
     *
     * @param emailDestino Email do destinatário
     * @param nomeDestino Nome do destinatário
     * @param assunto Assunto do email
     * @param mensagem Mensagem do email
     */
    @Async
    public void enviarEmailGenerico(String emailDestino, String nomeDestino, String assunto, String mensagem) {
        if (!emailJSProperties.isEnabled()) {
            log.warn("Envio de email desabilitado. Email não será enviado para: {}", emailDestino);
            return;
        }

        try {
            log.info("Enviando email genérico para: {}", emailDestino);

            Map<String, Object> templateParams = new HashMap<>();
            templateParams.put("to_email", emailDestino);
            templateParams.put("to_name", nomeDestino);
            templateParams.put("subject", assunto);
            templateParams.put("message", mensagem);
            templateParams.put("from_name", emailJSProperties.getFromName());
            templateParams.put("reply_to", emailJSProperties.getReplyTo());

            Map<String, Object> emailPayload = new HashMap<>();
            emailPayload.put("service_id", emailJSProperties.getServiceId());
            emailPayload.put("template_id", emailJSProperties.getTemplateId());
            emailPayload.put("user_id", emailJSProperties.getPublicKey());
            emailPayload.put("template_params", templateParams);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailPayload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                emailJSProperties.getApiUrl(),
                request,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email genérico enviado com sucesso para: {}", emailDestino);
            } else {
                log.error("Erro ao enviar email. Status: {}", response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Erro ao enviar email genérico para: {}", emailDestino, e);
        }
    }
}
