package me.liang.wiredcraft.controller;

import me.liang.wiredcraft.mapper.UserMapper;
import me.liang.wiredcraft.model.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

class UserControllerTest {

    private static User NORMAL_USER = User.builder()
            .userId(1L)
            .name("name")
            .address("address")
            .description("description")
            .dateOfBirth("2020-02-12")
            .latitude(new BigDecimal(121))
            .longitude(new BigDecimal(31))
            .build();

    private UserController testedController;
    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        userMapper = Mockito.mock(UserMapper.class);
        testedController = new UserController(userMapper);
    }


    @Test
    void getUser() {
        Mockito.when(userMapper.getUser(Mockito.anyLong())).thenReturn(NORMAL_USER);
        Assertions.assertEquals(
                NORMAL_USER,
                testedController.getUser("1"));
    }

    @Test
    void getUserNotFound() {
        Mockito.when(userMapper.getUser(Mockito.anyLong())).thenReturn(null);
        Assertions.assertThrowsExactly(
                ResponseStatusException.class,
                () -> testedController.getUser("1"));
    }

    @Test
    void createUser() {
    }

    @Test
    void updateUser() {
    }

    @Test
    void delete() {
    }
}