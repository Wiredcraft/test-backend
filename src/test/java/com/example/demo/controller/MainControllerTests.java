package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class MainControllerTests {

    private MainController controller;

    private UserServiceImpl service;

    private static final String DEFAULT_NAME = "foo";
    private static final String DEFAULT_ADDRESS = "rd";
    private static final String DEFAULT_DESCRIPTION = "desc";
    private static final String DEFAULT_DOB = "1997-07-01";
    private static final String ERROR_FORMAT_DOB = "1997/07/01";
    private static final Date DEFAULT_DATE = new GregorianCalendar(1997, Calendar.JULY, 1).getTime();

    private static final Map<String, String> REQUEST_BOY = Map.ofEntries(
            Map.entry("name", DEFAULT_NAME),
            Map.entry("address", DEFAULT_ADDRESS),
            Map.entry("description", DEFAULT_DESCRIPTION),
            Map.entry("dob", DEFAULT_DOB)
    );

    private static final Map<String, String> REQUEST_BOY_2 = Map.ofEntries(
            Map.entry("name", DEFAULT_NAME),
            Map.entry("address", DEFAULT_ADDRESS),
            Map.entry("description", DEFAULT_DESCRIPTION),
            Map.entry("dob", ERROR_FORMAT_DOB)
    );

    private static User DEFAULT_USER = new User();

    @BeforeEach
    public void setup() {
        DEFAULT_USER.setName(DEFAULT_NAME);
        DEFAULT_USER.setAddress(DEFAULT_ADDRESS);
        DEFAULT_USER.setDescription(DEFAULT_DESCRIPTION);
        DEFAULT_USER.setDob(DEFAULT_DATE);

        service = mock(UserServiceImpl.class);
        controller = new MainController(service);
    }

    @Test
    public void testGetUser() {
        controller.getUser(1);
        verify(service).getUser(1);
    }

    @Test
    public void testCreateUserSuccess() throws ParseException {
        controller.createUser(REQUEST_BOY);

        ArgumentCaptor<User> argument = ArgumentCaptor.forClass(User.class);
        verify(service).createUser(argument.capture());

        assertEquals(DEFAULT_NAME, argument.getValue().getName());
        assertEquals(DEFAULT_ADDRESS, argument.getValue().getAddress());
        assertEquals(DEFAULT_DESCRIPTION, argument.getValue().getDescription());
        assertEquals(DEFAULT_DATE, argument.getValue().getDob());
    }

    @Test
    public void testCreateUserFail() {
        // throw parseExp when dob format is not valid
        assertThrows(ParseException.class, () -> controller.createUser(REQUEST_BOY_2));
    }

    @Test
    public void testUpdateUserSuccess() throws ParseException {
        controller.updateUser(1, REQUEST_BOY);

        ArgumentCaptor<User> argument2 = ArgumentCaptor.forClass(User.class);
        ArgumentCaptor<Integer> argument1 = ArgumentCaptor.forClass(Integer.class);
        verify(service).updateUser(argument1.capture(), argument2.capture());

        assertEquals(1, argument1.getValue());
        assertEquals(DEFAULT_NAME, argument2.getValue().getName());
        assertEquals(DEFAULT_ADDRESS, argument2.getValue().getAddress());
        assertEquals(DEFAULT_DESCRIPTION, argument2.getValue().getDescription());
        assertEquals(DEFAULT_DATE, argument2.getValue().getDob());
    }

    @Test
    public void testUpdateUserFail() {
        // throw parseExp when dob format is not valid
        assertThrows(ParseException.class, () -> controller.updateUser(1, REQUEST_BOY_2));
    }

    @Test
    public void testDeleteUser() {
        controller.deleteUser(1);
        verify(service).deleteUser(1);
    }
}
