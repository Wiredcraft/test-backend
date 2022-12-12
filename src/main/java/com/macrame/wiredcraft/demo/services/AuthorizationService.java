package com.macrame.wiredcraft.demo.services;

import com.macrame.wiredcraft.demo.domain.UserEntity;
import reactor.core.publisher.Mono;

import java.util.Optional;

public interface AuthorizationService {
    Mono<Optional<UserEntity>> claim(String token);
}
