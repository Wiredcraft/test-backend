package com.macrame.wiredcraft.demo.security;

import com.macrame.wiredcraft.demo.domain.TokenEntity;
import com.macrame.wiredcraft.demo.exception.AuthorizationException;
import com.macrame.wiredcraft.demo.utils.JsonUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@ConditionalOnProperty(name = "config.security.rsa.enabled", havingValue = "true")
public class TokenProcessor {
    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private Encryptor encryptor;

    @Value("${auth.token.expiration.seconds}")
    private Long tokenExpirationSeconds;

    public Optional<String> generateToken(String userId, int version){
        TokenEntity tokenEntity = new TokenEntity();
        tokenEntity.setUserId(userId);
        tokenEntity.setVersion(version);
        LocalDateTime now = LocalDateTime.now();
        if (tokenExpirationSeconds > 0) {
            LocalDateTime targetTime = now.plusSeconds(tokenExpirationSeconds);
            logger.debug("Set token expiration time for user: [" + userId + "]. Target ExpirationTime = " + targetTime);
            tokenEntity.setTokenExpirationTime(targetTime);
        }
        try {
            String tokenString = JsonUtility.convertToString(tokenEntity, TokenEntity.class);
            return Optional.ofNullable(encryptor.encryptWithRSA(tokenString));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }
    public Optional<TokenEntity> parseToken(Optional<String> content){
        if (content.isPresent()){
            try {
                String token = content.get();
                if (!token.isBlank()) {
                    String tokenString = encryptor.decryptWithRSA(token);
                    TokenEntity tokenEntity = JsonUtility.parse(tokenString, TokenEntity.class);
                    if (tokenExpirationSeconds > 0) {
                        LocalDateTime instant = tokenEntity.getTokenExpirationTime();
                        LocalDateTime nowTime = LocalDateTime.now();
                        nowTime.plusSeconds(tokenExpirationSeconds);
                        if (instant.compareTo(nowTime) < 0) {
                            //DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL);//.ofPattern("MM dd, yyyy - HH:mm");//DateTimeFormatter.ISO_DATE_TIME;
                            logger.debug("But token has expired. UserId = " + tokenEntity.getUserId() + ". Target ExpirationTime = " + instant + ",  Now = " + LocalDateTime.now());
                            throw new AuthorizationException("Token has expired.", Long.valueOf(tokenEntity.getUserId()));
                        }
                    }
                    return Optional.of(tokenEntity);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return Optional.empty();
    }
}
