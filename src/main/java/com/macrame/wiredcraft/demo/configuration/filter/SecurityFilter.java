package com.macrame.wiredcraft.demo.configuration.filter;


import com.macrame.wiredcraft.demo.constants.Constants;
import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.services.AuthorizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.*;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.macrame.wiredcraft.demo.constants.Constants.ROLE_USER;

@Component
public class SecurityFilter implements WebFilter {
    private Logger logger = LoggerFactory.getLogger(getClass());
    private ServerAuthenticationSuccessHandler authenticationSuccessHandler = new WebFilterChainServerAuthenticationSuccessHandler();

    private ServerAuthenticationFailureHandler authenticationFailureHandler = new ServerAuthenticationEntryPointFailureHandler(new HttpBasicServerAuthenticationEntryPoint());

    private ServerWebExchangeMatcher requiresAuthenticationMatcher = ServerWebExchangeMatchers.pathMatchers("/api/**");

    @Value("${auth.skip-verifying:false}")
    private Boolean skipVerifying;
    @Autowired
    private AuthorizationService authorizationService;
    private Mono<Authentication> check(ServerWebExchange serverWebExchange){

        ServerHttpRequest request = serverWebExchange.getRequest();
        String requestURI = request.getPath().toString();
        if (logger.isDebugEnabled()) {
            logger.debug("Current request url: {}" , requestURI);
        }

        Optional<String> token = Optional.ofNullable(request.getHeaders().getFirst(Constants.AUTHORIZATION_TOKEN));
        if (logger.isDebugEnabled()) {
            logger.debug("Access {} with token : {}" , requestURI, token);
        }
        if (token.isEmpty()){
            logger.debug("Try to retrieve token from query params {} with token : {}" , requestURI, request.getQueryParams());
            List<String> tokenList = request.getQueryParams().getOrDefault(Constants.AUTHORIZATION_TOKEN, Collections.emptyList());
            if (!tokenList.isEmpty()){
                token = Optional.of(tokenList.get(0));
            }
        }
        return permitToken(serverWebExchange, token, requestURI);
    }
    private Mono<Authentication> generateRejectAuthentication(){
        logger.warn("Deny to access.");
        Authentication anonymous = new AnonymousAuthenticationToken("anonymous", "anonymous",
                AuthorityUtils.createAuthorityList("ROLE_ANONYMOUS"));
        anonymous.setAuthenticated(false);
        return Mono.just(anonymous);
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        return requiresAuthenticationMatcher.matches(exchange)
                .filter(matchResult -> matchResult.isMatch())
                .flatMap(matchResult -> check(exchange))
                .switchIfEmpty(chain.filter(exchange).then(Mono.empty()))
                .flatMap(authentication -> authenticate(exchange, chain, authentication));
    }
    private Mono<Void> authenticate(ServerWebExchange exchange,
                                      WebFilterChain chain, Authentication authentication) {
        WebFilterExchange webFilterExchange = new WebFilterExchange(exchange, chain);
        if (!authentication.isAuthenticated()){
            logger.trace("Authentication failure for user {}", authentication.getPrincipal());
            return authenticationFailureHandler.onAuthenticationFailure(webFilterExchange, new BadCredentialsException("Request is invalid"));
        }
        logger.trace("Authentication success for user {}", authentication.getPrincipal());
        return onAuthenticationSuccess(authentication, webFilterExchange);
    }
    private Mono<Void> onAuthenticationSuccess(Authentication authentication, WebFilterExchange webFilterExchange) {

        SecurityContextImpl securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(authentication);
        return authenticationSuccessHandler.onAuthenticationSuccess(webFilterExchange, authentication)
                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
    }

    protected Authentication packageAuthentication(UserEntity user) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, AuthorityUtils.createAuthorityList(ROLE_USER));
        return authentication;
    }
    private Mono<Authentication> permitToken(ServerWebExchange exchange, Optional<String> token, String requestUri) {
        if (token.isPresent()) {
            return authorizationService.claim(token.get())
                    .flatMap(userEntityOptional -> {
                        if (userEntityOptional.isPresent()){
                            UserEntity userEntity = userEntityOptional.get();
                            return processSuccessfulRequestHeader(userEntity);
                        }else{
                            if (skipVerifying) return processSuccessfulRequestHeader(new UserEntity(1L, "mock-user"));
                            logger.warn("Can not find this token {}", token.get());
                            return generateRejectAuthentication();
                        }
                    });
        }else{
            logger.warn("Anonymous access denied for {}", requestUri);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return generateRejectAuthentication();
        }
    }

    private Mono<Authentication> processSuccessfulRequestHeader(UserEntity userEntity) {
        if (logger.isTraceEnabled())
            logger.trace("Authorize successfully and append the user information to the HTTP headers. {}={}", Constants.HEADER_USER_ID, userEntity.getUserId());
        Authentication resultOfAuthentication = packageAuthentication(userEntity);
        SecurityContextHolder.getContext().setAuthentication(resultOfAuthentication);
        return Mono.just(resultOfAuthentication);
    }

    private Mono<Void> processFailedRequest(ServerWebExchange exchange, String token) {
        if (logger.isTraceEnabled())
            logger.trace("This token might has been expired or invalid. Token: {}", token);
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete().then(Mono.fromRunnable(() -> {
            exchange.getResponse().bufferFactory().wrap("Error -- Token is invalid.".getBytes());
        }));
    }


}