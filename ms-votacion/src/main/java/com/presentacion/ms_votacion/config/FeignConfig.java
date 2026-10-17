package com.presentacion.ms_votacion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;

@Configuration
public class FeignConfig {

    private static final String SECRET_HEADER = "X-Gateway-Secret";
    private static final String ROLE_HEADER = "X-Gateway-Role";

    @Value("${gateway.internal-secret}")
    private String gatewaySecret;

    @Bean
    public RequestInterceptor gatewayHeadersInterceptor() {

        return template -> {

            template.header(SECRET_HEADER, gatewaySecret);

            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attributes != null) {
                String rol = attributes.getRequest().getHeader(ROLE_HEADER);
                if (rol != null) {
                    template.header(ROLE_HEADER, rol);
                }
            }
        };
    }
}

