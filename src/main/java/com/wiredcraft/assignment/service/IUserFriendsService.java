package com.wiredcraft.assignment.service;

import com.wiredcraft.assignment.entity.UserFriends;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wiredcraft.assignment.enums.FollowEnum;

import java.util.List;

/**
 * <p>
 * users follow table service
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-26
 */
public interface IUserFriendsService extends IService<UserFriends> {

    List<UserFriends> getFollowList(Long userId, FollowEnum followEnum);

    void follow(Long userId, Long followId, Integer state);
}
