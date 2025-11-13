package com.currencySystem.virtus.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "emailjs")
public class EmailJSProperties {

    /**
     * Service ID do EmailJS
     * Exemplo: service_abc123
     */
    private String serviceId;

    /**
     * Template ID para email de resgate de vantagem
     * Exemplo: template_resgate_123
     */
    private String templateId;

    /**
     * Public Key (User ID) do EmailJS
     * Exemplo: user_xyz789
     */
    private String publicKey;

    /**
     * URL da API do EmailJS
     * Padrão: https://api.emailjs.com/api/v1.0/email/send
     */
    private String apiUrl = "https://api.emailjs.com/api/v1.0/email/send";

    /**
     * Nome do remetente que aparecerá no email
     */
    private String fromName = "Sistema Virtus";

    /**
     * Email de resposta (reply-to)
     */
    private String replyTo = "noreply@virtus.com";

    /**
     * Habilitar ou desabilitar envio de emails
     * Útil para desenvolvimento/testes
     */
    private boolean enabled = true;
}
