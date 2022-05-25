package com.wiredcraft.assignment.controller;


import cn.hutool.crypto.SecureUtil;
import com.alibaba.fastjson.JSONObject;
import com.wiredcraft.assignment.annotations.UserLoginToken;
import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.service.IUserService;
import com.wiredcraft.assignment.utils.TokenUtil;
import com.wiredcraft.assignment.web.ApiResponse;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.commons.codec.digest.Md5Crypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;

/**
 * <p>
 * User Api
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
@RestController
@Validated
@RequestMapping("/api")
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private TokenUtil tokenUtil;

    @ApiOperation(value="get users list")
    @GetMapping("/users")
    public ApiResponse getUserList() {
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        apiResponse.setData(userService.getUserList());
        return apiResponse;
    }

    @ApiOperation(value="get user information")
    @GetMapping("/users/{userId}")
    public ApiResponse getUserInfo(@ApiParam(name = "userId", value = "ex: 1", required = true)  @PathVariable Long userId) {
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        apiResponse.setData(userService.getById(userId));
        return apiResponse;
    }

    @ApiOperation(value="create the user")
    @PostMapping("/users")
    public ApiResponse createUser(@RequestBody @Valid UserCreateReq user) {
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        userService.createUser(user);
        return apiResponse;
    }


    @ApiOperation(value="delete the user")
    @DeleteMapping("/users/{userId}")
    public ApiResponse deleteUser(@ApiParam(name = "userId", value = "ex: 1", required = true) @PathVariable Long userId) {
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        userService.deleteByUserId(userId);
        return apiResponse;
    }

    @ApiOperation(value="update the user")
    @PutMapping("/users/{userId}")
    public ApiResponse updateUser(@ApiParam(name = "userId", value = "ex: 1", required = true) @PathVariable Long userId, @RequestBody User user) {
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        userService.updateUserInfo(userId, user);
        return apiResponse;
    }


    @UserLoginToken
    @GetMapping("/getMessage")
    public String getMessage(){
        SecureUtil.md5("11111");
        return "你已通过验证" + SecureUtil.md5("11111");
    }


}
