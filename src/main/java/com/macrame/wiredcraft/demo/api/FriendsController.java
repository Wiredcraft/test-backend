package com.macrame.wiredcraft.demo.api;

import com.macrame.wiredcraft.demo.documents.Following;
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.services.FollowingService;
import com.macrame.wiredcraft.demo.constants.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
public class FriendsController {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private FollowingService followingService;

    @GetMapping(value = Constants.URL_API_PREFIX + "/following")
    public Flux<User> listFollowing(Authentication authentication, @RequestParam(required = false) Double nearby) {
        UserEntity currentUserEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isDebugEnabled()) {
            logger.debug("Request /api/following. Current user is {}", currentUserEntity.getUserId());
        }
        return followingService.findFollowing(currentUserEntity.getUserId(), nearby);
    }
    @GetMapping(value = Constants.URL_API_PREFIX + "/follower")
    public Flux<User> listFollower(Authentication authentication, @RequestParam(required = false) Double nearby) {
        UserEntity currentUserEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isDebugEnabled()) {
            logger.debug("Request /api/follower. Current user is {}", currentUserEntity.getUserId());
        }
        return followingService.findFollower(currentUserEntity.getUserId(), nearby);
    }

    @PostMapping(value = Constants.URL_API_PREFIX + "/following/{id}")
    public Mono<Following> follow(Authentication authentication, @PathVariable Long id) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        return followingService.save(userEntity.getUserId(), id);
    }


    @DeleteMapping(value = Constants.URL_API_PREFIX + "/following/{id}")
    public Mono<Void> delete(Authentication authentication, @PathVariable Long id) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        return followingService.delete(id);
    }

}
