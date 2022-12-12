package com.macrame.wiredcraft.demo.repositories.mongo;

import com.macrame.wiredcraft.demo.documents.Following;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface FollowingRepository extends ReactiveCrudRepository<Following, Long> {

    @Query("{userId:?0}")
    Flux<Following> findAllByUserId(Long userId);

    @Query("{destinationUserId:?0}")
    Flux<Following> findAllByDestinationUserId(Long id);
}
