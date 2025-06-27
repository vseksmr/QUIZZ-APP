package com.lic.licenta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.lic.licenta")
public class LicentaApplication {


	public static void main(String[] args) {
		SpringApplication.run(LicentaApplication.class, args);
	}

}
