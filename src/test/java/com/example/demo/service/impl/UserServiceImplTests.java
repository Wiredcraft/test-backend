package com.example.demo.service.impl;

import com.example.demo.dao.UserDao;
import com.example.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class UserServiceImplTests {

    private UserServiceImpl service;

    private UserDao userDao;

    private static final String DEFAULT_NAME = "foo";
    private static final String DEFAULT_ADDRESS = "rd";
    private static final String DEFAULT_DESCRIPTION = "desc";
    private static final String DEFAULT_DOB = "1997-07-01";
    private static final Date DEFAULT_DATE = new GregorianCalendar(1997, Calendar.JULY, 1).getTime();

    private static User DEFAULT_USER = new User();

    @BeforeEach
    public void setup() {
        userDao = mock(UserDao.class);
        service = new UserServiceImpl(userDao);

        DEFAULT_USER.setName(DEFAULT_NAME);
        DEFAULT_USER.setAddress(DEFAULT_ADDRESS);
        DEFAULT_USER.setDescription(DEFAULT_DESCRIPTION);
        DEFAULT_USER.setDob(DEFAULT_DATE);
    }

    @Test
    public void testGetUserSuccess() {
        when(userDao.findById(1)).thenReturn(Optional.of(DEFAULT_USER));
        service.getUser(1);
        verify(userDao).findById(1);
    }

    @Test
    public void testGetUserFail() {
        when(userDao.findById(1)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getUser(1));
    }

    @Test
    public void testCreateUser() {
        service.createUser(DEFAULT_USER);
        ArgumentCaptor<User> argument = ArgumentCaptor.forClass(User.class);
        verify(userDao).save(argument.capture());

        assertEquals(DEFAULT_NAME, argument.getValue().getName());
        assertEquals(DEFAULT_ADDRESS, argument.getValue().getAddress());
        assertEquals(DEFAULT_DESCRIPTION, argument.getValue().getDescription());
        assertEquals(DEFAULT_DATE, argument.getValue().getDob());
    }

    @Test
    public void testUpdateUserSuccess() {
        when(userDao.findById(1)).thenReturn(Optional.of(DEFAULT_USER));
        service.updateUser(1, DEFAULT_USER);
        ArgumentCaptor<User> argument = ArgumentCaptor.forClass(User.class);
        verify(userDao).save(argument.capture());

        assertEquals(DEFAULT_NAME, argument.getValue().getName());
        assertEquals(DEFAULT_ADDRESS, argument.getValue().getAddress());
        assertEquals(DEFAULT_DESCRIPTION, argument.getValue().getDescription());
        assertEquals(DEFAULT_DATE, argument.getValue().getDob());
    }

    @Test
    public void testUpdateUserFail() {
        when(userDao.findById(1)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.updateUser(1, DEFAULT_USER));
    }

    @Test
    public void testDeleteUserSuccess() {
        when(userDao.findById(1)).thenReturn(Optional.of(DEFAULT_USER));
        service.deleteUser(1);
        verify(userDao).deleteById(1);
    }

    @Test
    public void testDeleteUserFail() {
        when(userDao.findById(1)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.deleteUser(1));
    }
}
