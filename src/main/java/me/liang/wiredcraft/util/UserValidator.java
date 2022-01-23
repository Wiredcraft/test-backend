package me.liang.wiredcraft.util;

import com.google.common.base.Strings;
import lombok.extern.log4j.Log4j2;
import me.liang.wiredcraft.model.User;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

@Log4j2
public class UserValidator {

    private static final Date MIN_DATE = new GregorianCalendar(1900, Calendar.FEBRUARY, 1).getTime();

    private UserValidator() {}

    public static void validateUser(final User user) {
        // validate user
        if (user == null) {
            log.error("the user is null");
            throw new NullPointerException();
        }

        validateUserId(user);
        validateName(user);
        validateDateOfBirth(user);
    }

    private static void validateUserId(final User user) {
        if (user.getUserId() == null) {
            log.error("the userId is required for user {}", user);
            throw new IllegalArgumentException("userId is null");
        }
    }

    private static void validateName(final User user) {
        if (Strings.isNullOrEmpty(user.getName())) {
            log.error("the name is required for user {}", user);
            throw new IllegalArgumentException("user name is empty");
        }
    }

    private static void validateDateOfBirth(final User user) {
        final DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Date date;
        try {
            date = df.parse(user.getDateOfBirth());
        } catch (ParseException e) {
            log.error("The dateOfBirth should follow the format yyyy-MM-dd for user {}", user);
            throw new IllegalArgumentException(e);
        }
        if (date.before(MIN_DATE)) {
            log.error("The dateOfBirth should be after or equal to 1900-01-01 for user {}", user);
            throw new IllegalArgumentException("dateOfBirth should be after or equal to 1900-01-01.");
        }
    }
}
