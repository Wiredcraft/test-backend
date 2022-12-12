package com.macrame.wiredcraft.demo.services.impl;

import com.macrame.wiredcraft.demo.documents.Following;
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.exception.RecordNotFoundException;
import com.macrame.wiredcraft.demo.repositories.mongo.FollowingRepository;
import com.macrame.wiredcraft.demo.repositories.mongo.UserRepository;
import com.macrame.wiredcraft.demo.services.FollowingService;
import com.macrame.wiredcraft.demo.services.IdGenerator;
import com.macrame.wiredcraft.demo.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
public class DefaultFollowingService implements FollowingService {
    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private IdGenerator idGenerator;
    @Autowired
    private FollowingRepository followingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Mono<Following> save(Long userId, Long id) {
        return userRepository.findById(id).flatMap(user -> {
            logger.debug("User {} will follow user {}:{}", userId, id, user.getName());
            Following following = new Following();
            following.setId(idGenerator.nextId());
            following.setUserId(userId);
            following.setDestinationUserId(id);
            following.setCreationTime(LocalDateTime.now());
            return followingRepository.save(following);
        }).switchIfEmpty(Mono.error(new RecordNotFoundException("Could not find this user " + id, id.toString())));
    }

    @Override
//    @Cacheable()
    public Flux<User> findFollowing(Long userId, Double nearby) {
        if (nearby != null) {

            // TODO: Use the Geo-spatial Repository Queries to implement this query
            // return userRepository.findById(userId).map(user -> userRepository.findByLocationNear(new Point(user.getCoordinate()[0],user.getCoordinate()[1]),  new Distance(nearby), followingRepository.findAllByUserId(userId).map(Following::getDestinationUserId)));
        }
        return userRepository.findAllById(followingRepository.findAllByUserId(userId).map(Following::getDestinationUserId));
    }

    @Override
//    @Cacheable()
    public Flux<User> findFollower(Long userId, Double nearby) {
        return userRepository.findAllById(followingRepository.findAllByDestinationUserId(userId).map(Following::getUserId));
    }

    @Override
    public Mono<Void> delete(Long id) {
        return followingRepository.deleteById(id);
    }
}
