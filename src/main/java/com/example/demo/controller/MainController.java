package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/user")
public class MainController {

    @Autowired
    private UserServiceImpl service;

    @GetMapping("/get")
    @ResponseBody
    public User getUser() {
        return null;
    }

    @PostMapping("/create")
    @ResponseBody
    public User createUser(@RequestBody Map<String, String> body) {
        User user = new User();
        user.setName(body.get("name"));
        user.setAddress(body.get("address"));
        user.setDescription(body.get("description"));

        service.save(user);

        return user;
    }

    @PostMapping("/update")
    @ResponseBody
    public void updateUser() {

    }

    @PostMapping("/delete")
    @ResponseBody
    public void deleteUser() {

    }
}
