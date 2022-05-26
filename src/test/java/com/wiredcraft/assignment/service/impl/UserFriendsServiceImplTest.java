package com.wiredcraft.assignment.service.impl;

import com.wiredcraft.assignment.entity.UserFriends;
import com.wiredcraft.assignment.enums.FollowEnum;
import com.wiredcraft.assignment.service.IUserFriendsService;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @author jarvis.jia
 * @date 2022/5/26
 */
@RunWith(SpringRunner.class)
@SpringBootTest
class UserFriendsServiceImplTest {

    @Autowired
    private IUserFriendsService userFriendsService;

    @Test
    void getFollowList() {
        List<UserFriends> userFriends = userFriendsService.getFollowList(1L, FollowEnum.FOLLOW);
        Assert.assertEquals(2, userFriends.size());
    }

    @Test
    void follow() {
        List<UserFriends> userFriends = userFriendsService.getFollowList(1L, FollowEnum.FOLLOWING);
        Assert.assertEquals(1, userFriends.size());
    }
}