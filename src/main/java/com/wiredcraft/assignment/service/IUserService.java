package com.wiredcraft.assignment.service;

import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.dto.req.UserLoginReq;
import com.wiredcraft.assignment.dto.resp.UserInfoResp;
import com.wiredcraft.assignment.dto.resp.UserLoginResp;
import com.wiredcraft.assignment.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wiredcraft.assignment.enums.FollowEnum;

import java.util.List;

/**
 * <p>
 * users information table service
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
public interface IUserService extends IService<User> {

    List<UserInfoResp> getUserList();

    UserInfoResp getUserInfo(Long userId);

    void deleteByUserId(Long userId);

    void updateUserInfo(Long userId, User user);


    User findByName(String username);


    UserLoginResp login(UserLoginReq request);

    User createUser(UserCreateReq request);

    List<UserInfoResp> getFollowList(Long userId, FollowEnum followEnum);


    List<UserInfoResp> getNearByFriends(Long userId, Double distance);
}
