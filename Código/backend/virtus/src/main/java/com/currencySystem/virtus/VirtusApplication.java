package com.currencySystem.virtus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class VirtusApplication {

	public static void main(String[] args) {
		SpringApplication.run(VirtusApplication.class, args);
	}

}
