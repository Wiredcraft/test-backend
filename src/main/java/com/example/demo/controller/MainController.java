package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class MainController {

    @Autowired
    private final UserServiceImpl service;

    public MainController(UserServiceImpl service) {
        this.service = service;
    }

    @GetMapping("/get/{userId}")
    @ResponseBody
    @Transactional
    public User getUser(@PathVariable int userId) {
        return service.getUser(userId);
    }

    @PostMapping("/create")
    @ResponseBody
    @Transactional
    public User createUser(@RequestBody Map<String, String> body) throws ParseException {
        User user = new User();
        user.setName(body.get("name"));
        user.setAddress(body.get("address"));
        user.setDescription(body.get("description"));
        user.setCreatedAt(new Date(System.currentTimeMillis()));

        // convert dob to Date
        String dob = body.get("dob");
        if (dob != null) {
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            Date date = df.parse(body.get("dob"));
            user.setDob(date);
        }
        return service.createUser(user);
    }

    @PutMapping("/update/{userId}")
    @ResponseBody
    @Transactional
    public User updateUser(@PathVariable int userId, @RequestBody Map<String, String> body) throws ParseException {
        User user = new User();
        user.setName(body.get("name"));
        user.setAddress(body.get("address"));
        user.setDescription(body.get("description"));

        // convert dob to Date
        String dob = body.get("dob");
        if (dob != null) {
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            Date date = df.parse(body.get("dob"));
            user.setDob(date);
        }

        return service.updateUser(userId, user);
    }

    @DeleteMapping("/delete/{userId}")
    @ResponseBody
    @Transactional
    public void deleteUser(@PathVariable int userId) {
        service.deleteUser(userId);
    }
}
