package com.macrame.wiredcraft.demo.security;

import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.pkcs.RSAPrivateKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.*;
import java.security.*;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class RSACryptUtility {
    private static final Logger logger = LoggerFactory.getLogger(RSACryptUtility.class);
    private static String ALGORITHM = "RSA";

    public static boolean cacheMode = true;

    private static Map<String, Key> cachedEncryptKeyMap = new HashMap<>();
    private static Map<String, Key>  cachedDecryptKeyMap = new HashMap<>();
    static {
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    }

    public static byte[] encrypt(byte[] source, String publicKeyFileName) throws Exception {
        Key encryptKey = null;
        if (cacheMode) {
            if (cachedEncryptKeyMap.get(publicKeyFileName) == null) {
                encryptKey = getPublicKey(new FileInputStream(publicKeyFileName));

                cachedEncryptKeyMap.put(publicKeyFileName, encryptKey);
            }
            encryptKey = cachedEncryptKeyMap.get(publicKeyFileName);
        }else{
            encryptKey = getPublicKey(new FileInputStream(publicKeyFileName));
        }
        Cipher encryptCipher = getEncryptCipher(encryptKey);
        return encryptCipher.doFinal(source);
    }
    private static byte[] encrypt(byte[] source, FileInputStream publicKeyInputStream) throws IOException, ClassNotFoundException, IllegalBlockSizeException, InvalidKeyException, BadPaddingException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeySpecException {
        Key key = getPublicKey(publicKeyInputStream);
        return encrypt(source, key);
    }
    private static PublicKey getPublicKey(InputStream keyInputStream) throws IOException, ClassNotFoundException, NoSuchAlgorithmException, InvalidKeySpecException {
        BufferedReader br= new BufferedReader(new InputStreamReader(keyInputStream));
        String readLine= null;
        StringBuilder sb= new StringBuilder();
        while((readLine= br.readLine())!=null){
            if(readLine.charAt(0)=='-'){
                continue;
            }else{
                sb.append(readLine);
            }
        }
        String content = sb.toString();
        byte[] buffer= Base64.getDecoder().decode(content);

        KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(buffer);
        keyInputStream.close();
        return keyFactory.generatePublic(keySpec);
    }

    private static PrivateKey getPrivateKey(FileInputStream keyInputStream) throws IOException, ClassNotFoundException, NoSuchAlgorithmException, InvalidKeySpecException {
        BufferedReader br= new BufferedReader(new InputStreamReader(keyInputStream));
        String readLine= null;
        StringBuilder sb= new StringBuilder();
        while((readLine= br.readLine())!=null){
            if(readLine.charAt(0)=='-'){
                continue;
            }else{
                sb.append(readLine);
            }
        }
        String content = sb.toString();

        byte[] buffer= Base64.getDecoder().decode(content);
        KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);
        ASN1Sequence seq = ASN1Sequence.getInstance(buffer);
        RSAPrivateKey asn1PrivKey = RSAPrivateKey.getInstance(seq);
        RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec(asn1PrivKey.getModulus(), asn1PrivKey.getPrivateExponent());
        keyInputStream.close();
        return keyFactory.generatePrivate(keySpec);
    }


    private static PublicKey getPublicKeyFromCertificate(InputStream certificateInputStream) throws CertificateException {

        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        X509Certificate x509Cert = (X509Certificate)cf.generateCertificate(certificateInputStream);
        return x509Cert.getPublicKey();
    }
    private static byte[] encrypt(byte[] source, Key key) throws InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = getEncryptCipher(key);
        return cipher.doFinal(source);
    }
    private static Cipher getEncryptCipher(Key key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher;
    }



    public static byte[] decrypt(byte[] cryptograph, String privateKeyFileName) throws Exception {
        Key decryptKey = null;
        if (cacheMode) {
            if (cachedDecryptKeyMap.get(privateKeyFileName) == null) {
                decryptKey = getPrivateKey(new FileInputStream(privateKeyFileName));
                cachedDecryptKeyMap.put(privateKeyFileName, decryptKey);
            }
            decryptKey = cachedDecryptKeyMap.get(privateKeyFileName);
        }else{
            decryptKey = getPrivateKey(new FileInputStream(privateKeyFileName));
        }
        Cipher decryptCipher = getDecryptCipher(decryptKey);
        if (logger.isTraceEnabled()) {
            logger.trace("Try to decrypt this data:\n {} \nLength = {}", new String(Hex.encode(cryptograph)), cryptograph.length);
        }
        return decryptCipher.doFinal(cryptograph);
    }
    private static Cipher getDecryptCipher(Key key) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher;
    }

}
