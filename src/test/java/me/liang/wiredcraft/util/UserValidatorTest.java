package me.liang.wiredcraft.util;

import me.liang.wiredcraft.model.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Modifier;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class UserValidatorTest {

    @Test
    public void constractorTestCoverage() throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        Constructor<UserValidator> constructor = UserValidator.class.getDeclaredConstructor();
        assertTrue(Modifier.isPrivate(constructor.getModifiers()));
        constructor.setAccessible(true);
        constructor.newInstance();
    }

    @Test
    void validateUserHappyPath() {
        User user = User.builder()
                .userId(1L)
                .name("name")
                .address("address")
                .description("description")
                .dateOfBirth("2020-02-12")
                .latitude(new BigDecimal(121))
                .longitude(new BigDecimal(31))
                .build();
        UserValidator.validateUser(user);
    }

    @Test
    void validateUserWithNullUserId() {
        User user = User.builder()
                .userId(null)
                .name("name")
                .address("address")
                .description("description")
                .dateOfBirth("2020-02-12")
                .latitude(new BigDecimal(121))
                .longitude(new BigDecimal(31))
                .build();
        Assertions.assertThrowsExactly(IllegalArgumentException.class, () -> UserValidator.validateUser(user));
    }

    @Test
    void validateUserWithNullName() {
        User user = User.builder()
                .userId(2L)
                .name("")
                .address("address")
                .description("description")
                .dateOfBirth("2020-02-12")
                .latitude(new BigDecimal(121))
                .longitude(new BigDecimal(31))
                .build();
        Assertions.assertThrowsExactly(IllegalArgumentException.class, () -> UserValidator.validateUser(user));
    }

    @Test
    void validateUserWithEmptyName() {
        User user = User.builder()
                .userId(2L)
                .name(null)
                .address("address")
                .description("description")
                .dateOfBirth("2020-02-12")
                .latitude(new BigDecimal(121))
                .longitude(new BigDecimal(31))
                .build();
        Assertions.assertThrowsExactly(IllegalArgumentException.class, () -> UserValidator.validateUser(user));
    }

    @Test
    void validateUserWithInvalidDob() {
        User user = User.builder()
                .userId(3L)
                .name("name")
                .address("address")
                .description("description")
                .dateOfBirth("20200212")
                .latitude(new BigDecimal(121))
                .longitude(new BigDecimal(31))
                .build();
        Assertions.assertThrowsExactly(IllegalArgumentException.class, () -> UserValidator.validateUser(user));
    }

    @Test
    void validateUserWithEarlyDob() {
        User user = User.builder()
                .userId(3L)
                .name("name")
                .address("address")
                .description("description")
                .dateOfBirth("1800-02-12")
                .latitude(new BigDecimal(121))
                .longitude(new BigDecimal(31))
                .build();
        Assertions.assertThrowsExactly(IllegalArgumentException.class, () -> UserValidator.validateUser(user));
    }
}