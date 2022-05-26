package com.wiredcraft.assignment.controller;


import cn.hutool.crypto.SecureUtil;
import com.alibaba.fastjson.JSONObject;
import com.wiredcraft.assignment.annotations.UserLoginToken;
import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.enums.FollowEnum;
import com.wiredcraft.assignment.enums.FollowStateEnum;
import com.wiredcraft.assignment.service.IUserFriendsService;
import com.wiredcraft.assignment.service.IUserService;
import com.wiredcraft.assignment.utils.TokenUtil;
import com.wiredcraft.assignment.web.ApiResponse;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.commons.codec.digest.Md5Crypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
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
    private IUserFriendsService userFriendsService;
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



    @ApiOperation(value="get the user's followers information")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", name = "token", value = "token", dataType = "String", required = true),
    })
    @UserLoginToken
    @GetMapping("/users/followers")
    public ApiResponse getFollowerList(HttpServletRequest httpServletRequest){
        String token = httpServletRequest.getHeader("token");
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        apiResponse.setData(userService.getFollowList(tokenUtil.getUserByToken(token), FollowEnum.FOLLOW));
        return apiResponse;
    }

    @ApiOperation(value="get the user's following information")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", name = "token", value = "token", dataType = "String", required = true),
    })
    @UserLoginToken
    @GetMapping("/users/following")
    public ApiResponse getFollowingList(HttpServletRequest httpServletRequest){
        String token = httpServletRequest.getHeader("token");
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        apiResponse.setData(userService.getFollowList(tokenUtil.getUserByToken(token), FollowEnum.FOLLOWING));
        return apiResponse;
    }

    @ApiOperation(value="follow someone")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", name = "token", value = "token", dataType = "String", required = true),
    })
    @UserLoginToken
    @PostMapping("/users/{followId}/follow")
    public ApiResponse follow(HttpServletRequest httpServletRequest, @ApiParam(name = "followId", value = "ex: 1", required = true) @PathVariable Long followId){
        String token = httpServletRequest.getHeader("token");
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        userFriendsService.follow(tokenUtil.getUserByToken(token), followId, FollowStateEnum.VALID.getValue());
        return apiResponse;
    }

    @ApiOperation(value="unfollow someone")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", name = "token", value = "token", dataType = "String", required = true),
    })
    @UserLoginToken
    @DeleteMapping("/users/{followId}/follow")
    public ApiResponse unFollow(HttpServletRequest httpServletRequest, @ApiParam(name = "followId", value = "ex: 1", required = true) @PathVariable Long followId){
        String token = httpServletRequest.getHeader("token");
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        userFriendsService.follow(tokenUtil.getUserByToken(token), followId, FollowStateEnum.NOT_VALID.getValue());
        return apiResponse;
    }

    @ApiOperation(value="get the user's nearby friends")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", name = "token", value = "token", dataType = "String", required = true),
    })
    @UserLoginToken
    @GetMapping("/users/nearby")
    public ApiResponse getNearByFriends(HttpServletRequest httpServletRequest, @ApiParam(name = "distance", value = "ex: 12.2", required = true) @RequestParam Double distance){
        String token = httpServletRequest.getHeader("token");
        ApiResponse apiResponse = ApiResponse.buildSuccess();
        apiResponse.setData(userService.getNearByFriends(tokenUtil.getUserByToken(token), distance));
        return apiResponse;
    }





}
