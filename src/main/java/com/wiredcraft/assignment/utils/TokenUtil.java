package com.wiredcraft.assignment.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.exception.BusinessException;
import com.wiredcraft.assignment.service.IUserService;
import com.wiredcraft.assignment.web.ErrorCodeConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
@Component
public class TokenUtil {


    private static final String ISS = "wiredcraft";
    public static final long EXPIRATION = 3600L;

    @Autowired
    private IUserService userService;


    /**
     * get token
     */
    public String getToken(User user) {
        String token = JWT.create()
                .withIssuer(ISS)
                .withAudience(user.getId().toString())
                .withSubject(user.getName())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION * 1000))
                .sign(Algorithm.HMAC256(user.getPassword()));
        return token;
    }


    public void verifyToken(String token) throws Exception {
        if (token == null) {
            throw new BusinessException(ErrorCodeConfig.ERR_NO_TOKEN);
        }
        String userId;
        Date expiresAt;
        try {
            userId = JWT.decode(token).getAudience().get(0);
            expiresAt = JWT.decode(token).getExpiresAt();
        } catch (JWTDecodeException j) {
            throw new BusinessException(ErrorCodeConfig.ERR_NEED_AUTH);
        }
        User user = userService.getById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCodeConfig.ERR_USER_NOT_EXIST);
        }
        // 验证 token
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(user.getPassword()))
                .withIssuer(ISS)
                .withAudience(user.getId().toString())
                .withSubject(user.getName())
                .build();
        try {
            jwtVerifier.verify(token);
        } catch (JWTVerificationException e) {
            throw new BusinessException(ErrorCodeConfig.ERR_NEED_AUTH);
        }


        Date now = new Date();
        if (expiresAt.before(now)) {
            throw new BusinessException(ErrorCodeConfig.ERR_TOKEN_EXPIRED);
        }

    }




}
