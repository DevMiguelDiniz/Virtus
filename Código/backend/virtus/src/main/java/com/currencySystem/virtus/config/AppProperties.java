package com.currencySystem.virtus.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    /**
     * URL base da aplicação frontend
     * Exemplo: http://localhost:3000 (desenvolvimento)
     * Exemplo: https://virtus.com.br (produção)
     */
    private String baseUrl;

    /**
     * Gera URL completa para validação de resgate
     *
     * @param resgateId ID do resgate
     * @return URL completa para validação
     */
    public String getResgateValidationUrl(Long resgateId) {
        return baseUrl + "/validar-resgate/" + resgateId;
    }
}
