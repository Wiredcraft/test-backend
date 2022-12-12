package com.macrame.wiredcraft.demo.services;

import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.dto.AuthorizationDto;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.dto.UpdateUserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import reactor.core.publisher.Mono;

public interface UserService {
    Mono<User> load(Long id);
    Mono<Page<User>> list(PageRequest pageRequest);
    Mono<User> save(RegisterDto registerDto);
    Mono<User> update(UserEntity userEntity, Long userId, UpdateUserDto updateUserDto);
    Mono<Integer> delete(UserEntity userEntity, Long... id);

    Mono<String> signIn(AuthorizationDto authorizationDto);

    Mono<String> signUp(RegisterDto registerDto);

    Mono<Boolean> signOut(Long userId, String token);
}
