package com.macrame.wiredcraft.demo.security;

import org.springframework.security.crypto.codec.Hex;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

public class PBKDF2PasswordEncoder {
    public static final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";


    public static final int HASH_SIZE = 64;

    public static final int PBKDF2_ITERATIONS = 1000;


    public static String encodePassword(String origin, String salt) {
        try {
            byte[] bytes = Hex.decode(salt);
            KeySpec spec = new PBEKeySpec(origin.toCharArray(), bytes, PBKDF2_ITERATIONS, HASH_SIZE);
            SecretKeyFactory secretKeyFactory = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
            byte[] hash = secretKeyFactory.generateSecret(spec).getEncoded();
            //将byte数组转换为16进制的字符串
            return new String(Hex.encode(hash));
        }catch (NoSuchAlgorithmException | InvalidKeySpecException e ){
            throw new RuntimeException("Fail to digest the value by MD5: " + origin);
        }
    }
}
