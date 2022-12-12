package com.macrame.wiredcraft.demo.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.io.IOException;
import java.time.LocalDateTime;

import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;

public class JsonUtility {
    public static <T> T parse(String jsonString, Class<T> classType) throws IOException {
        if (jsonString == null)
            return null;
        if (classType == null){
            throw new NullPointerException("Target classType cannot be null.");
        }
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addDeserializer(LocalDateTime.class,new LocalDateTimeDeserializer(ISO_DATE_TIME));
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(ISO_DATE_TIME));
        ObjectMapper mapper = new ObjectMapper();
        //Enable Jackson to handle the unquoted field name.
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        mapper.registerModule(javaTimeModule);
        return mapper.readValue(jsonString, classType);
    }

    /**
     * Parse to an instance from given JSON content String.
     * @param jsonString
     * @param typeReference Example new TypeReference<Map<Integer, RbtCounter>>(){}
     * @param <T>
     * @return
     * @throws IOException
     */
    public static <T> T parse(String jsonString, TypeReference<T> typeReference) throws IOException {
        if (jsonString == null)
            return null;
        if (typeReference == null){
            throw new NullPointerException("TypeReference cannot be null.");
        }

        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addDeserializer(LocalDateTime.class,new LocalDateTimeDeserializer(ISO_DATE_TIME));
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(ISO_DATE_TIME));
        ObjectMapper mapper = new ObjectMapper();
        //Enable Jackson to handle the unquoted field name.
        mapper.enable(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES);
        mapper.registerModule(javaTimeModule);
        return mapper.readValue(jsonString, typeReference);
    }
    public static <T> String convertToString(T t, Class<T> classType, boolean condensed) throws IOException {
        if (t == null)
            return null;
        if (classType == null){
            throw new NullPointerException("Target classType cannot be null.");
        }
        ObjectMapper mapper = new ObjectMapper();
        //Enable Jackson to handle the unquoted field name.
        mapper.enable(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES);
        if (condensed){
            mapper.disable(SerializationFeature.INDENT_OUTPUT);
        }
        mapper.registerModule(new JavaTimeModule());
        return mapper.writeValueAsString(t);
    }
    public static <T> String convertToString(T t, Class<T> classType) throws IOException {
        return  convertToString(t, classType, false);
    }
}
