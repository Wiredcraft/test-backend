package me.liang.wiredcraft.controller;

import lombok.AllArgsConstructor;
import me.liang.wiredcraft.mapper.UserMapper;
import me.liang.wiredcraft.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/user")
@AllArgsConstructor
public class UserController {

    private UserMapper userMapper;

    @GetMapping(value="/{userId}")
    public User getUser(@PathVariable String userId) {
        return userMapper.getUser(userId);
    }

    @PutMapping(value="/")
    public User createUser(@RequestBody User user) {
        return User.builder().build();
    }

    @PostMapping(value="/")
    public User updateUser(@RequestBody User user) {
        return User.builder().build();
    }

    @DeleteMapping(value = "{userId}")
    public void delete(@PathVariable String userId) {
        return ;
    }

}
