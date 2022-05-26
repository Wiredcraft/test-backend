package com.wiredcraft.assignment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wiredcraft.assignment.entity.UserFriends;
import com.wiredcraft.assignment.enums.FollowEnum;
import com.wiredcraft.assignment.mapper.UserFriendsMapper;
import com.wiredcraft.assignment.service.IUserFriendsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * users follow table 服务实现类
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-26
 */
@Service
public class UserFriendsServiceImpl extends ServiceImpl<UserFriendsMapper, UserFriends> implements IUserFriendsService {

    @Override
    public List<UserFriends> getFollowList(Long userId, FollowEnum followEnum) {
        QueryWrapper<UserFriends> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("state", 1);
        if(followEnum == FollowEnum.FOLLOW){
            queryWrapper.eq("uid", userId);
        }else{
            queryWrapper.eq("follower_id", userId);
        }
        return this.list(queryWrapper);
    }

    @Override
    public void follow(Long userId, Long followId, Integer state) {
        Date now = new Date();
        QueryWrapper<UserFriends> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("uid", userId)
                .eq("follower_id", followId)
                .last("limit 1");
        UserFriends userFriendRelation = this.getOne(queryWrapper);
        if(userFriendRelation == null){
            userFriendRelation =  new UserFriends();
            userFriendRelation.setCreatedAt(now);
            userFriendRelation.setUid(userId);
            userFriendRelation.setFollowerId(followId);
            userFriendRelation.setState(state);
            this.save(userFriendRelation);
        }else{
            userFriendRelation.setState(state);
            userFriendRelation.setUpdateAt(now);
            this.updateById(userFriendRelation);
        }





    }
}
