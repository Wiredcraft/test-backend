package com.macrame.wiredcraft.demo.configuration;

import com.macrame.wiredcraft.demo.configuration.filter.SecurityFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class WebSecurityConfig {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Value("${spring.security.user.name}")
    private String username;
    @Value("${spring.security.user.password}")
    private String password;
    private String[] interceptorAllowedURL = new String[]{"/api/**","/public/api/**"};

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public MapReactiveUserDetailsService userDetailsService() {
        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        UserDetails user = User.withUsername(username).password(encoder.encode(password))
                .roles("ACTUATOR", "USER")
                .build();
        return new MapReactiveUserDetailsService(user);
    }
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf().disable()
                .authorizeExchange()
                .pathMatchers("/actuator/**").hasRole("ACTUATOR")
                .pathMatchers(interceptorAllowedURL).permitAll()
                .and()
                .addFilterAt(securityFilter, SecurityWebFiltersOrder.AUTHENTICATION)
//                .oauth2Login()
//                .and().formLogin().and()
                .httpBasic().and().build();
    }
}
