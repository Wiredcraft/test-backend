package com.macrame.wiredcraft.demo.utils;


import java.util.Random;

public class RandomUtility {
    public static String generateRandomNumberInMillisecond(int length) {
        return generateNumber(new Random(System.currentTimeMillis()), length);
    }
    public static String generateRandomNumber(int length) {
        return generateNumber(new Random(), length);
    }

    public static String generateRandomString(int length) {
        String o = generateNumber(new Random(), length);
        Long l = Long.valueOf(o);
        return Long.toString(l, 26);
    }
    public static String generateRandomString(int length, int radix) {
        String o = generateNumber(new Random(), length);
        Long l = Long.valueOf(o);
        return Long.toString(l, radix);
    }

    private static String generateNumber(Random random, int length){
        StringBuffer sbRandomString = new StringBuffer();

        for (int i = 0; i < length; i++) {
            sbRandomString.append(random.nextInt(9));
        }
        return sbRandomString.toString();
    }
}