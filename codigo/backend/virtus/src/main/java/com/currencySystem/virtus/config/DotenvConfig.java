package com.currencySystem.virtus.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuração para carregar variáveis de ambiente do arquivo .env
 * Procura o .env na raiz do projeto primeiro, senão procura na pasta do backend
 */
@Configuration
public class DotenvConfig {

    @PostConstruct
    public void loadEnv() {
        try {
            // Tenta carregar .env da raiz do projeto (2 níveis acima)
            Path rootEnvPath = Paths.get("../../.env").toAbsolutePath().normalize();
            Path backendEnvPath = Paths.get(".env").toAbsolutePath().normalize();

            Dotenv dotenv = null;

            // Prioridade 1: .env na raiz do projeto
            if (Files.exists(rootEnvPath)) {
                System.out.println("✓ Carregando .env da raiz do projeto: " + rootEnvPath);
                dotenv = Dotenv.configure()
                        .directory(rootEnvPath.getParent().toString())
                        .ignoreIfMissing()
                        .load();
            }
            // Prioridade 2: .env na pasta backend/virtus
            else if (Files.exists(backendEnvPath)) {
                System.out.println("✓ Carregando .env da pasta backend: " + backendEnvPath);
                dotenv = Dotenv.configure()
                        .ignoreIfMissing()
                        .load();
            }
            // Nenhum .env encontrado
            else {
                System.out.println("⚠ Nenhum arquivo .env encontrado");
                System.out.println("  Procurado em: " + rootEnvPath);
                System.out.println("  Procurado em: " + backendEnvPath);
                return;
            }

            // Carrega as variáveis no System.properties
            if (dotenv != null) {
                dotenv.entries().forEach(entry -> {
                    String key = entry.getKey();
                    String value = entry.getValue();

                    // Só define se ainda não estiver definida (variáveis do sistema têm prioridade)
                    if (System.getProperty(key) == null) {
                        System.setProperty(key, value);
                    }
                });

                // Log das variáveis EmailJS (sem expor valores sensíveis)
                System.out.println("✓ Variáveis EmailJS carregadas:");
                System.out.println("  EMAILJS_SERVICE_ID: " + maskValue(dotenv.get("EMAILJS_SERVICE_ID")));
                System.out.println("  EMAILJS_TEMPLATE_ID: " + maskValue(dotenv.get("EMAILJS_TEMPLATE_ID")));
                System.out.println("  EMAILJS_PUBLIC_KEY: " + maskValue(dotenv.get("EMAILJS_PUBLIC_KEY")));
                System.out.println("  EMAILJS_ENABLED: " + dotenv.get("EMAILJS_ENABLED"));
                System.out.println("  APP_BASE_URL: " + dotenv.get("APP_BASE_URL"));
            }

        } catch (Exception e) {
            System.err.println("✗ Erro ao carregar arquivo .env: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Mascara valores sensíveis para logs
     */
    private String maskValue(String value) {
        if (value == null || value.equals("YOUR_SERVICE_ID") || value.equals("YOUR_TEMPLATE_ID") || value.equals("YOUR_PUBLIC_KEY")) {
            return value + " (NÃO CONFIGURADO!)";
        }
        if (value.length() > 8) {
            return value.substring(0, 4) + "****" + value.substring(value.length() - 4);
        }
        return "****";
    }
}
