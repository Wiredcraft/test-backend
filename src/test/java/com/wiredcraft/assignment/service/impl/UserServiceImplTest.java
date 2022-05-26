package com.wiredcraft.assignment.service.impl;

import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.dto.req.UserLoginReq;
import com.wiredcraft.assignment.dto.resp.UserInfoResp;
import com.wiredcraft.assignment.dto.resp.UserLoginResp;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.enums.FollowEnum;
import com.wiredcraft.assignment.enums.UserStateEnum;
import com.wiredcraft.assignment.exception.BusinessException;
import com.wiredcraft.assignment.service.IUserService;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @author jarvis.jia
 * @date 2022/5/26
 */
@RunWith(SpringRunner.class)
@SpringBootTest
class UserServiceImplTest {

    @Autowired
    private IUserService userService;

    @Test
    void getUserList() {
        List<UserInfoResp> userList = userService.getUserList();
        Assert.assertEquals(3, userList);
    }

    @Test
    void getUserInfo() {
        UserInfoResp user = userService.getUserInfo(1L);
        Assert.assertEquals("peter", user.getName());
    }

    @Test
    @Transactional
    void deleteByUserId() {
        userService.deleteByUserId(1L);
        User user = userService.getById(1L);
        Assert.assertEquals(UserStateEnum.DELETED.getValue(), user.getDeleted());
    }

    @Test
    @Transactional
    void updateUserInfo() {
        User updateInfo = new User();
        updateInfo.setName("jia");
        userService.updateUserInfo(1L, updateInfo);

        User userInfo = userService.getById(1L);
        Assert.assertEquals("jia", userInfo.getName());
    }

    @Test
    void findByName() {
        User userInfo = userService.findByName("peter");
        Assert.assertEquals("peter", userInfo.getName());
    }

    @Test
    void login() {
        UserLoginReq request = new UserLoginReq();
        request.setName("peter");
        request.setPassword("123456");
        UserLoginResp loginInfo = userService.login(request);
        Assert.assertEquals("peter", loginInfo.getUserInfo().getName());
    }

    @Test
    void loginFail() {
        UserLoginReq request = new UserLoginReq();
        request.setName("peter");
        request.setPassword("111111");
        String errorCode = "";
        try{
            UserLoginResp loginInfo = userService.login(request);
        }catch (BusinessException ex){
            errorCode = ex.errorCode.getErrorCode();
        }
        Assert.assertEquals("ERR_PASSWORD_ERROR", errorCode);
    }

    @Test
    @Transactional
    void createUser() {
        UserCreateReq request = new UserCreateReq();
        request.setName("lucy");
        request.setPassword("123456");
        request.setDob("1990-12-01");
        request.setDescription("I am good");
        User result = userService.createUser(request);
        Assert.assertEquals("I am good", result.getDescription());
    }

    @Test
    void getFollowerList() {
        List<UserInfoResp> followList = userService.getFollowList(1L, FollowEnum.FOLLOW);
        Assert.assertEquals(2, followList.size());
    }

    @Test
    void getFollowingList() {
        List<UserInfoResp> followList = userService.getFollowList(1L, FollowEnum.FOLLOWING);
        Assert.assertEquals(1, followList.size());
    }

    @Test
    void getNearByFriends() {
        List<UserInfoResp> getNearByFriends = userService.getNearByFriends(1L, 12.0);
        Assert.assertEquals(1, getNearByFriends.size());
    }
}