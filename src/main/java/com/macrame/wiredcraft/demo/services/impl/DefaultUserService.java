package com.macrame.wiredcraft.demo.services.impl;

import com.macrame.wiredcraft.demo.constants.Constants;
import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.dto.AuthorizationDto;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.dto.UpdateUserDto;
import com.macrame.wiredcraft.demo.exception.AuthorizationException;
import com.macrame.wiredcraft.demo.exception.BadRequestException;
import com.macrame.wiredcraft.demo.exception.CryptographException;
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.exception.RecordNotFoundException;
import com.macrame.wiredcraft.demo.repositories.mongo.UserRepository;
import com.macrame.wiredcraft.demo.security.Encryptor;
import com.macrame.wiredcraft.demo.security.TokenProcessor;
import com.macrame.wiredcraft.demo.services.IdGenerator;
import com.macrame.wiredcraft.demo.services.UserService;
import com.macrame.wiredcraft.demo.utils.SaltUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveSetOperations;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DefaultUserService implements UserService {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private static final String USER_TOKEN_KEY_PREFIX = "user:token:";
    private static final String USER_ID_KEY_PREFIX = "user:id:";

    @Value("${auth.token.expiration.seconds:36000}")
    private Long tokenExpirationSeconds;

    @Autowired
    private IdGenerator idGenerator;
    @Autowired
    private Encryptor encryptor;

    @Autowired
    private TokenProcessor tokenProcessor;
    @Autowired
    private ReactiveRedisTemplate reactiveRedisTemplate;

    @Autowired
    private UserRepository userRepository;
    @Override
    public Mono<String> signIn(AuthorizationDto authorizationDto) {
        //logger.debug("Try to login password: " + Encryptor.encodePassword(loginEntity.getPassword()));
        if (logger.isDebugEnabled()) {
            logger.debug("Try to login with password:{} ", authorizationDto.getPassword());
        }
        User example = new User();
        example.setName(authorizationDto.getName());
        return userRepository.count(Example.of(example)).flatMap(counter -> {
            if (counter == 0){
                if (logger.isDebugEnabled()) {
                    logger.debug("Could not find this user {}", authorizationDto.getName());
                }
                return Mono.error(new AuthorizationException("This user: " + authorizationDto.getName() + " has not been found.", 0L));
            }

            return userRepository.findOneByName(authorizationDto.getName()).flatMap(user -> {
                logger.debug("Found user: {}", user.getUserId());
                String encryptedPassword = authorizationDto.getPassword();
                //String securityPassword = null;
                String rawPassword = null;
                try {
                    rawPassword = encryptor.decryptWithRSA(encryptedPassword);
                    //securityPassword = encryptor.encryptWithMD5(password);
                    if (logger.isTraceEnabled()) {
                        logger.trace("Try to login with the essential password: {}", rawPassword);
                    }

                } catch (CryptographException e) {
                    return Mono.error(new AuthorizationException(String.format("Could not decrypt the password for user : %s", authorizationDto.getName()), user.getUserId()));
                }
                String salt = user.getSalt();
                String hashedPassword = null;
                try {
                    hashedPassword = encryptor.encryptWithPBKDF2(rawPassword, salt);
                } catch (Exception e) {
                    logger.warn("Fail to encrypt password for user {}", user.getName());
                    return Mono.error(new AuthorizationException(String.format("Could not encrypt the password for user : %s", authorizationDto.getName()), user.getUserId()));
                }
                if (logger.isTraceEnabled()) {
                    logger.trace("Compare the passwords, stored password({}) to received password({}): for user {}", user.getPassword(), hashedPassword, authorizationDto.getName());
                }
                if (hashedPassword.equals(user.getPassword())) {
                    if (logger.isDebugEnabled()) {
                        logger.debug("Check user status. Status : {} ", user.getStatus());
                    }
                    if (!Constants.STATUS_NORMAL.equals(user.getStatus())) {
                        return Mono.error(new AuthorizationException(String.format("User: %s is inactive.", user.getUserId()), user.getUserId()));
                    }


                    return generateToken(user);
                } else {
                    logger.warn("Fail to login for user {}, password does not match.", authorizationDto.getName());
                    return Mono.error(new AuthorizationException(String.format("Fail to login for user: %s", authorizationDto.getName()), user.getUserId()));
                }
            });
        });
    }

    @Override
    public Mono<String> signUp(RegisterDto registerDto) {
        return save(registerDto).flatMap(user -> generateToken(user));
    }

    private Mono<String> generateToken(User user) {
        if (logger.isDebugEnabled()) {
            logger.debug("Check token expiration time.");
        }
        Optional<String> encodedToken = tokenProcessor.generateToken(String.valueOf(user.getUserId()), user.getTokenVersion() + 1);
        if (!encodedToken.isPresent()) {
            throw new AuthorizationException("Fail to generate token", user.getUserId());
        }
        String token = encodedToken.get();
        if (logger.isDebugEnabled()) {
            logger.debug("encodedToken = {}", token);
        }
        LocalDateTime loginTime = LocalDateTime.now();



        String tokenKey = USER_TOKEN_KEY_PREFIX + token;
        String userTokenKey = USER_ID_KEY_PREFIX + user.getUserId();
        ReactiveValueOperations<String, UserEntity> tokenOperations = reactiveRedisTemplate.opsForValue();
        ReactiveSetOperations<String, String> reverseTokenOperations = reactiveRedisTemplate.opsForSet();
        final UserEntity userEntity = new UserEntity(user.getUserId(), user.getName(), tokenExpirationSeconds);
        return tokenOperations.set(tokenKey, userEntity, Duration.ofSeconds(tokenExpirationSeconds))
                .then(reverseTokenOperations.add(userTokenKey, token))
                .map(result -> token);
    }


    @Override
    public Mono<Boolean> signOut(Long userId, String token) {
        ReactiveValueOperations<String, UserEntity> tokenOperations = reactiveRedisTemplate.opsForValue();
        final String tokenKey = USER_TOKEN_KEY_PREFIX + token;
        return tokenOperations.get(tokenKey)
                .doOnNext(key -> logger.debug("Deleting the token with key - {}", tokenKey))
                .filter(userEntity -> userEntity.getUserId().equals(userId))
                .flatMap(userEntity -> tokenOperations.delete(tokenKey))
                .defaultIfEmpty(Boolean.FALSE);
    }

    @Override
    public Mono<User> load(Long id) {
        Mono<User> user = userRepository.findById(id);
        return user.switchIfEmpty(Mono.error(new RecordNotFoundException("Could not find this user.", id.toString())));
    }

    @Override
    public Mono<Page<User>> list(PageRequest pageRequest) {
        logger.debug("query condition is {}, ", pageRequest);
        return userRepository.findAllBy(pageRequest)
                .collectList()
                .zipWith(userRepository.count())
                .map(t -> {
                    logger.debug("Get the result, total is {}, data is {}", t.getT2(), t.getT1());
                    return new PageImpl<>(t.getT1(), pageRequest, t.getT2());
                });
    }

    @Override
    public Mono<User> save(RegisterDto registerDto) {
        return userRepository.countByName(registerDto.getName()).flatMap(counter -> {
            if (counter > 0){
                return Mono.error(new BadRequestException(String.format("At least one user has been found with username=%s.", registerDto.getName())));
            }
            User user = new User();
            user.setUserId(idGenerator.nextId());
            user.setName(registerDto.getName());
            user.setDescription(registerDto.getDescription());
            user.setDob(registerDto.getDob());
            user.setAddress(registerDto.getAddress());
            user.setCoordinate(registerDto.getCoordinate());
            user.setStatus(Constants.STATUS_NORMAL);
            user.setTokenVersion(0);
            LocalDateTime now = LocalDateTime.now();
            user.setCreatedAt(now);
            String encryptedPassword = registerDto.getPassword();
            String rawPassword;
            try {
                rawPassword = encryptor.decryptWithRSA(encryptedPassword);
                if (logger.isTraceEnabled()) {
                    logger.trace("Try to create user [{}] with the essential password: [{}]", registerDto.getName(), rawPassword);
                }
            } catch (CryptographException e) {
                return Mono.error( new AuthorizationException(String.format("Could not decrypt the password for user : %s", registerDto.getName()),  -1L ));
            }
            String salt = SaltUtility.generateSalt();
            String hashedPassword;
            try {
                hashedPassword = encryptor.encryptWithPBKDF2(rawPassword, salt);
            } catch (Exception e) {
                return Mono.error( new CryptographException(String.format("Could not encrypt the password for user : %s", user.getName())));
            }
            user.setSalt(salt);
            user.setPassword(hashedPassword);
            return userRepository.save(user);
        });
    }

    @Override
    public Mono<User> update(UserEntity userEntity, Long userId, UpdateUserDto updateUserDto) {
        logger.debug("User {} is updating a user: {}", userEntity.getUserId(), updateUserDto);
        return userRepository.findById(userId).flatMap(user -> {
            BeanUtils.copyProperties(updateUserDto, user);
            return userRepository.save(user);
        });
    }

    @Override
    public Mono<Integer> delete(UserEntity userEntity, Long... id) {
        logger.debug("User {} is deleting a user: {}", userEntity.getUserId(), id);
        for (Long key : id) {
            if (logger.isDebugEnabled()) {
                logger.debug("Attempt to delete user: id = {}", key);
            }
            userRepository.deleteById(key);
        }
        return Mono.just(id.length);
    }
}
