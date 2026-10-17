package com.presentacion.ms_votacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsVotacionApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsVotacionApplication.class, args);
	}

}

