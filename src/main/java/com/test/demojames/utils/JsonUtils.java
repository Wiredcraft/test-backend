package com.test.demojames.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JsonUtils<T> {
    public static ObjectMapper objectMapper ;
    static {
        objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    public static String toString(Object o) {

        try {
            return objectMapper.writeValueAsString(o);
        } catch (Exception e) {
            log.error("convert exception", e);
        }
        return "";
    }

    public static <T> T toObject(String str, Class<T> T) {
        try {
            return objectMapper.readValue(str, T);
        } catch (JsonProcessingException e) {
            log.error("convert Obj exception", e);
        }
        return null;
    }
}
