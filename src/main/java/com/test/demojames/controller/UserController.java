package com.test.demojames.controller;

import com.test.demojames.model.Location;
import com.test.demojames.model.common.Result;
import com.test.demojames.model.entity.User;
import com.test.demojames.service.GeoService;
import com.test.demojames.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    private final GeoService geoService;

    public UserController(UserService userService, GeoService geoService) {
        this.userService = userService;
        this.geoService = geoService;
    }

    @GetMapping("/get/{id}")
    public Result get(@PathVariable("id") Long id) {
        return Result.success(userService.get(id));
    }

    @PostMapping("/delete/{id}")
    public Result delete(@PathVariable("id") Long id) {
        userService.delete(id);
        return Result.success("delete success");
    }

    @PostMapping("/add/")
    public Result add(@RequestBody User user) {
        return Result.success(userService.add(user));
    }

    @PostMapping("/position/add")
    public Result position(@RequestBody Location location) {
        //id will be used in user repository
        geoService.addPostion(location);
        return Result.success("add position success");
    }

    @GetMapping("/position/{id}/{distance}")
    public Result getPosition(@PathVariable("id") Long id, @PathVariable("distance") Integer distance) {
        return Result.success(userService.getUserNearBy(id,distance));
    }
}
