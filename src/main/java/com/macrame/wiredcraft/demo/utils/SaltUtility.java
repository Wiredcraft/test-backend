package com.macrame.wiredcraft.demo.utils;

import org.springframework.security.crypto.codec.Hex;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class SaltUtility {
    // The length of salt
    public static final int SALT_SIZE = 64;


    /**
     * Generate a salt
     * @param size length
     * @return The value of salt
     */
    public static String generateSalt(int size) {
        try{
            SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
            byte[] bytes = new byte[SALT_SIZE / 2];
            random.nextBytes(bytes);
            return new String(Hex.encode(bytes));
        }catch (NoSuchAlgorithmException e){
            throw new RuntimeException("Fail to generate salt as NoSuchAlgorithmException");
        }
    }
    /**
     * Generate salt randomly
     */
    public static String generateSalt() {
        return generateSalt(SALT_SIZE);
    }
}
