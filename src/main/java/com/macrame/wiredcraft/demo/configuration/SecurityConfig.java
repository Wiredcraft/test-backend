package com.macrame.wiredcraft.demo.configuration;

import com.macrame.wiredcraft.demo.security.RSAEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {
    private Logger logger = LoggerFactory.getLogger(getClass());


    @Value("${auth.security.public_key_file:}")
    private String publicKeyFile;
    @Value("${auth.security.private_key_file:}")
    private String privateKeyFile;

    @Bean
    public BCryptPasswordEncoder bcryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RSAEncryptor rsaEncryptor() {
        return new RSAEncryptor(publicKeyFile, privateKeyFile);
    }
}
