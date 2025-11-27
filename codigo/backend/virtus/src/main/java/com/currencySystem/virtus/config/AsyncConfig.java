package com.currencySystem.virtus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // Habilita processamento assíncrono para métodos anotados com @Async
    // Isso permite que o envio de emails não bloqueie o fluxo principal
}
