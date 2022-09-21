package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class MainControllerTests {

    private MainController controller;

    private UserServiceImpl service;

    private static final String DEFAULT_NAME = "foo";
    private static final String DEFAULT_ADDRESS = "rd";
    private static final String DEFAULT_DESCRIPTION = "desc";
    private static final String DEFAULT_DOB = "1997-07-01";
    private static final Date DEFAULT_DATE = new GregorianCalendar(1997, Calendar.JULY, 1).getTime();

    private static final Map<String, String> REQUEST_BOY = Map.ofEntries(
            Map.entry("name", DEFAULT_NAME),
            Map.entry("address", DEFAULT_ADDRESS),
            Map.entry("description", DEFAULT_DESCRIPTION),
            Map.entry("dob", DEFAULT_DOB)
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
    public void testCreateUser() {

//        when(service.createUser(DEFAULT_USER)).thenReturn(DEFAULT_USER);
//        User user = controller.createUser(REQUEST_BOY);
//        assertEquals(user.getName(), DEFAULT_NAME);
    }
}
