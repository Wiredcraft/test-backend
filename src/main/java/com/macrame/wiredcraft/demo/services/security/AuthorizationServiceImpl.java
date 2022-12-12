package com.macrame.wiredcraft.demo.services.security;

import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.services.AuthorizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Optional;

@Service
public class AuthorizationServiceImpl implements AuthorizationService {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private static final String USER_TOKEN_KEY_PREFIX = "user:token:";

    @Autowired
    private ReactiveRedisTemplate reactiveRedisTemplate;


    @Override
    public Mono<Optional<UserEntity>> claim(String token) {
        String key = USER_TOKEN_KEY_PREFIX + token;
        ReactiveValueOperations<String, UserEntity> operations = reactiveRedisTemplate.opsForValue();
        return operations.get(key).doOnNext(userEntity -> reactiveRedisTemplate.expire(key, Duration.ofSeconds(userEntity.getTokenExpirationSeconds())).subscribe(aBoolean -> logger.trace("Found the cached token then extend the TTL, token: {}", token))).map(Optional::of).defaultIfEmpty(Optional.empty());
    }
}
