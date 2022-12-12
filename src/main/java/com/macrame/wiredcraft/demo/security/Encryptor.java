package com.macrame.wiredcraft.demo.security;

import com.macrame.wiredcraft.demo.constants.Constants;
import com.macrame.wiredcraft.demo.exception.CryptographException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class Encryptor {
    @Autowired
    private BCryptPasswordEncoder bcryptPasswordEncoder;

    @Autowired
    private RSAEncryptor rsaEncryptor;

    public String encryptWithBcrypt(String value){
        return bcryptPasswordEncoder.encode(value);
    }

    public String encryptWithPBKDF2(String value){
        return PBKDF2PasswordEncoder.encodePassword(value, Constants.HASH_SALT_VALUE);
    }

    public String encryptWithPBKDF2(String value, String salt){
        return PBKDF2PasswordEncoder.encodePassword(value, salt);
    }


    public boolean matches(String rawPassword, String encodedPassword){
        return bcryptPasswordEncoder.matches(rawPassword, encodedPassword);
    }

    public String encryptWithRSA(String value) {
        return encryptWithRSAWithPublicKey(value);
    }
    public String encryptWithRSAWithPublicKey(String value) {
        try {
            return rsaEncryptor.encode(value);
        } catch (Exception e) {
            throw new CryptographException(e.getMessage());
        }
    }
    public String encryptWithRSAWithPrivateKey(String value){
        try {
            return rsaEncryptor.encode(value);
        } catch (Exception e) {
            throw new CryptographException(e.getMessage());
        }
    }
    public String encryptWithRSA(String value, String userId) {
        try {
            return rsaEncryptor.encode(value, userId);
        } catch (Exception e) {
            throw new CryptographException(e.getMessage());
        }
    }

    public String decryptWithRSA(String value) {
        return decryptWithRSAWithPrivateKey(value);
    }
    public String decryptWithRSAWithPublicKey(String value) {
        try {
            return rsaEncryptor.decodeWithPublicKey(value);
        } catch (Exception e) {
            throw new CryptographException(e.getMessage());
        }
    }

    public String decryptWithRSAWithPrivateKey(String value) {
        try {
            return rsaEncryptor.decode(value);
        } catch (Exception e) {
            throw new CryptographException(e.getMessage());
        }
    }
}
