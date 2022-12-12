package com.macrame.wiredcraft.demo.repositories.mongo;

import com.macrame.wiredcraft.demo.documents.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

public interface UserRepository extends ReactiveMongoRepository<User, Long> {

    Mono<Long> countByName(String name);

    Mono<User> findOneByName(String name);

    Flux<User> findAllBy(Pageable pageable);

    // { 'coordinate' : { '$near' : [point.x, point.y], '$maxDistance' : distance}, userId: []}
    Flux<User> findByCoordinateNear(Point location, Distance distance, Flux<Long> ids);
}
