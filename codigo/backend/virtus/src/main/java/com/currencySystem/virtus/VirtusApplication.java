package com.currencySystem.virtus;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class VirtusApplication {

	public static void main(String[] args) {
		// Load .env file from project root (../../ from backend/virtus/)
		// This allows Spring Boot to access environment variables from .env file
		// Spring Boot reads from system properties when environment variables are not set
		Dotenv dotenv = Dotenv.configure()
				.directory("../..") // Project root (when running from backend/virtus/)
				.ignoreIfMissing()  // Continue if .env doesn't exist
				.load();
		
		// Set system properties from .env so Spring Boot can access them
		// Only set if not already set as environment variable or system property
		dotenv.entries().forEach(entry -> {
			String key = entry.getKey();
			String value = entry.getValue();
			if (System.getenv(key) == null && System.getProperty(key) == null) {
				System.setProperty(key, value);
			}
		});
		
		SpringApplication.run(VirtusApplication.class, args);
	}

}
