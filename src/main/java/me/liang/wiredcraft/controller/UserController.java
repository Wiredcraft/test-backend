package me.liang.wiredcraft.controller;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import me.liang.wiredcraft.mapper.UserMapper;
import me.liang.wiredcraft.model.User;
import me.liang.wiredcraft.util.UserValidator;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@AllArgsConstructor
@Log4j2
public class UserController {

    private UserMapper userMapper;

    /**
     * getUser returns the user given the userId
     * @param userId userId
     * @return the user
     * @return 404 if the user is not found
     * @return TODO 403 if the caller is not authorized
     */
    @GetMapping(value="user/{userId}")
    public User getUser(@PathVariable String userId) {
        Long userIdAsLong = Long.parseLong(userId);
        final User user = userMapper.getUser(userIdAsLong);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        return user;
    }

    /**
     * create the user given the user
     * @param user the user to be created
     */
    @PutMapping(value="user")
    public void createUser(@RequestBody User user) {
        UserValidator.validateUser(user);
        userMapper.insertUser(user);
    }

    /**
     * update the user given the user. Pay attention that the `version` field should be fetched by the getUser API
     * @param user the new user value to be updated
     * @return 1 if the update succeeds and 0 if it fails
     */
    @PostMapping(value="user")
    public int updateUser(@RequestBody User user) {
        UserValidator.validateUser(user);
        return userMapper.updateUser(user);
    }

    /**
     * delete the user given the userId
     * @param userId the userId specifying the user
     * @return 1 if the user is deleted by this request and 0 if no user is deleted
     */
    @DeleteMapping(value = "user/{userId}")
    public int delete(@PathVariable String userId) {
        Long userIdAsLong = Long.parseLong(userId);
        return userMapper.deleteUser(userIdAsLong);
    }
}
