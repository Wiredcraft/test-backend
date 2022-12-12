package com.macrame.wiredcraft.demo.api;

import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.dto.AuthorizationDto;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.services.UserService;
import com.macrame.wiredcraft.demo.constants.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

@RestController
public class AuthorizationController {
    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserService userService;


    @PostMapping(Constants.URL_PUBLIC_PREFIX + Constants.URL_API_PREFIX + "/user/session")
    @ResponseStatus(HttpStatus.OK)
    public Mono<String> signIn(@RequestHeader(name = "User-Agent") String userAgent, @RequestBody @Valid AuthorizationDto authorizationDto){

        if (logger.isInfoEnabled())
            logger.info("Request /public/api/user/session [POST]");
        logger.info("Attempt to sign in with name = {}, password = ***************, userAgent = {}", authorizationDto.getName(), userAgent);
        return userService.signIn(authorizationDto);

    }

    @PostMapping(Constants.URL_PUBLIC_PREFIX + Constants.URL_API_PREFIX + "/user")
    @ResponseStatus(HttpStatus.OK)
    public Mono<String> signUp(@RequestHeader(name = "User-Agent") String userAgent, @RequestBody @Valid RegisterDto registerDto){

        if (logger.isInfoEnabled())
            logger.info("Request /public/api/user [POST]");
        logger.info("Attempt to sign up with name = {}, password = ***************, userAgent = {}", registerDto.getName(), userAgent);
        return userService.signUp(registerDto);
    }


    @DeleteMapping(value = Constants.URL_API_PREFIX + "/user/session/{token}")
    public Mono<Boolean> signOut(Authentication authentication, @PathVariable String token){
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isInfoEnabled()) {
            logger.info("Request /api/session [DELETE]. Current user is {}", userEntity.getUserId());
        }
        return userService.signOut(userEntity.getUserId(), token)
                .switchIfEmpty(Mono.defer(() -> Mono.just(Boolean.TRUE)));
    }

}
