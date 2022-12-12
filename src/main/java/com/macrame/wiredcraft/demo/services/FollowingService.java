package com.macrame.wiredcraft.demo.services;

import com.macrame.wiredcraft.demo.documents.Following;
import com.macrame.wiredcraft.demo.documents.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface FollowingService {

    Mono<Following> save(Long userId, Long id);

    Flux<User> findFollowing(Long userId, Double nearby);

    Flux<User> findFollower(Long userId, Double nearby);

    Mono<Void> delete(Long id);
}
