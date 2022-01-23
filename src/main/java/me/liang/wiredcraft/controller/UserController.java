package me.liang.wiredcraft.controller;

import lombok.AllArgsConstructor;
import me.liang.wiredcraft.mapper.UserMapper;
import me.liang.wiredcraft.model.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class UserController {

    private UserMapper userMapper;

    @GetMapping(value="user/{userId}")
    public User getUser(@PathVariable String userId) {
        Long userIdAsLong = Long.parseLong(userId);
        return userMapper.getUser(userIdAsLong);
    }

    @PutMapping(value="user")
    public void createUser(@RequestBody User user) {
        userMapper.insertUser(user);
    }

    @PostMapping(value="user")
    public int updateUser(@RequestBody User user) {
        return userMapper.updateUser(user);
    }

    @DeleteMapping(value = "user/{userId}")
    public int delete(@PathVariable String userId) {
        Long userIdAsLong = Long.parseLong(userId);
        return userMapper.deleteUser(userIdAsLong);
    }

    private void validateUser(final User user) {

    }

}
