package com.wiredcraft.assignment.service;

import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.dto.req.UserLoginReq;
import com.wiredcraft.assignment.dto.resp.UserInfoResp;
import com.wiredcraft.assignment.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * users information table 服务类
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
public interface IUserService extends IService<User> {

    List<User> getUserList();

    void deleteByUserId(Long userId);

    void updateUserInfo(Long userId, User user);


    User findByName(String username);


    UserInfoResp login(UserLoginReq request);

    void createUser(UserCreateReq request);
}
