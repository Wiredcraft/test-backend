package com.macrame.wiredcraft.demo.api;

import com.macrame.wiredcraft.demo.constants.Constants;
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.dto.UpdateUserDto;
import com.macrame.wiredcraft.demo.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

import static com.macrame.wiredcraft.demo.constants.Constants.REQUEST_PAGE_DEFAULT;
import static com.macrame.wiredcraft.demo.constants.Constants.REQUEST_SIZE_DEFAULT;

@RestController
public class UserController {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private UserService userService;

    @GetMapping(value = Constants.URL_API_PREFIX + "/users")
    public Mono<Page<User>> list(Authentication authentication,
                           @RequestParam(name = "page", defaultValue = REQUEST_PAGE_DEFAULT) int page,
                           @RequestParam(name = "size", defaultValue = REQUEST_SIZE_DEFAULT) int size,
                           @RequestParam(required = false) Sort sortDirection) {
        UserEntity currentUserEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isDebugEnabled()) {
            logger.debug("Request /api/users. Current user is {}", currentUserEntity.getUserId());
        }
        return userService.list(PageRequest.of(page, size));
    }

    @GetMapping( value = Constants.URL_API_PREFIX + "/user/{id}")
    public Mono<User> load(Authentication authentication, @PathVariable("id") Long id) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isInfoEnabled()) {
            logger.info("Request /api/user/{} [GET]. Current user is {}", id, userEntity.getUserId());
        }
        return userService.load(id);
    }

    @PostMapping( value = Constants.URL_API_PREFIX + "/user")
    public Mono<User> save(Authentication authentication, @RequestBody @Valid RegisterDto registerDto) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isInfoEnabled()) {
            logger.info("Request /api/user [POST]. Current user is {}", userEntity.getUserId());
        }
        return userService.save(registerDto);
    }

    @PatchMapping( value = Constants.URL_API_PREFIX + "/user/{id}")
    public Mono<User> update(Authentication authentication, @PathVariable("id") Long id, @RequestBody UpdateUserDto updateUserDto) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isInfoEnabled()) {
            logger.info("Request /api/user/{} [PATCH]. Current user is {}", id, userEntity.getUserId());
        }
        return Mono.zip(Mono.just(userEntity), Mono.just(id), Mono.just(updateUserDto)).flatMap(objects -> userService.update(objects.getT1(), objects.getT2(), objects.getT3()));
    }

    @DeleteMapping( value = Constants.URL_API_PREFIX + "/user/{id}")
    public Mono<Integer> delete(Authentication authentication, @PathVariable("id") Long... id) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        if (logger.isInfoEnabled()) {
            logger.info("Request /api/user/{} [DELETE]. Current user is {}", id, userEntity.getUserId());
        }
        return userService.delete(userEntity, id);
    }
}
