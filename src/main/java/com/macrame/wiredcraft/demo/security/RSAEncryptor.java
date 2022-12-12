package com.macrame.wiredcraft.demo.security;

import org.springframework.security.crypto.codec.Hex;
import org.springframework.util.StringUtils;

import java.util.HexFormat;

public class RSAEncryptor {
    private String publicKeyFile;
    private String privateKeyFile;

    public RSAEncryptor(String publicKeyFile, String privateKeyFile) {
        this.publicKeyFile = publicKeyFile;
        this.privateKeyFile = privateKeyFile;
    }
    //Encode with server's public key file
    public String encode(String content) throws Exception {
        return encodeWithPublicKey(content);
    }
    public String encodeWithPublicKey(String content) throws Exception {
        if (StringUtils.isEmpty(content)){
            throw new NullPointerException("Content is null");
        }
        return new String(Hex.encode(RSACryptUtility.encrypt(content.getBytes(), publicKeyFile)));
    }
    public String encodeWithPrivateKey(String content) throws Exception {
        if (StringUtils.isEmpty(content)){
            throw new NullPointerException("Content is null");
        }
        return new String(Hex.encode(RSACryptUtility.encrypt(content.getBytes(), privateKeyFile)));
    }
    public String encode(String content, String publicKeyFile) throws Exception {
        if (StringUtils.isEmpty(content)){
            throw new NullPointerException("Content is null");
        }
        return new String(Hex.encode(RSACryptUtility.encrypt(content.getBytes(), publicKeyFile)));
    }
    public String decode(String content) throws Exception{
        return decodeWithPrivateKey(content);
    }
    public String decodeWithPrivateKey(String content) throws Exception{
        if (StringUtils.isEmpty(content)){
            throw new NullPointerException("Content is null");
        }
        return new String(RSACryptUtility.decrypt(Hex.decode(content), privateKeyFile));
    }
    public String decodeWithPublicKey(String content) throws Exception{
        if (StringUtils.isEmpty(content)){
            throw new NullPointerException("Content is null");
        }
        return new String(RSACryptUtility.decrypt(Hex.decode(content), publicKeyFile));
    }
}
