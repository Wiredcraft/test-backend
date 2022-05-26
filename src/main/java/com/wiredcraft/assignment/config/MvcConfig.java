package com.wiredcraft.assignment.config;

import com.wiredcraft.assignment.interceptor.AuthenticationInterceptor;
import com.wiredcraft.assignment.interceptor.LoggerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

/**
 * @author jarvis.jia
 * @date 2022/5/24
 */
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Resource
    private LoggerInterceptor loggerInterceptor;
    @Resource
    private AuthenticationInterceptor authenticationInterceptor;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggerInterceptor).addPathPatterns("/**");
        registry.addInterceptor(authenticationInterceptor).addPathPatterns("/**");
    }
}