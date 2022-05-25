package com.wiredcraft.assignment.controller;

import com.alibaba.fastjson.JSONObject;
import com.wiredcraft.assignment.dto.req.UserLoginReq;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.service.IUserService;
import com.wiredcraft.assignment.utils.TokenUtil;
import com.wiredcraft.assignment.web.ApiResponse;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
@RestController
@Validated
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private IUserService userService;

    @ApiOperation(value="user login")
    @PostMapping("/login")
    public ApiResponse login(@RequestBody @Valid UserLoginReq request) {
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        apiResponse.setData(userService.login(request));
        return apiResponse;
    }

}
