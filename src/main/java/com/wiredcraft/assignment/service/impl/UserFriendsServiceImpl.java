package com.wiredcraft.assignment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wiredcraft.assignment.entity.UserFriends;
import com.wiredcraft.assignment.enums.FollowEnum;
import com.wiredcraft.assignment.exception.BusinessException;
import com.wiredcraft.assignment.mapper.UserFriendsMapper;
import com.wiredcraft.assignment.service.IUserFriendsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wiredcraft.assignment.web.ErrorCodeConfig;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * users follow table service
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-26
 */
@Service
public class UserFriendsServiceImpl extends ServiceImpl<UserFriendsMapper, UserFriends> implements IUserFriendsService {

    /**
     * get user's follower/following list
     * @param userId userId
     * @param followEnum follow enum. ex: FollowEnum.FOLLOW: follower. FollowEnum.FOLLOWING: following
     * @return follower/following list
     */
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

    /**
     * follow other users
     * @param userId
     * @param followId
     * @param state follow state. 1: valid  0:not valid
     */
    @Override
    public void follow(Long userId, Long followId, Integer state) {
        if(userId == followId){
            throw new BusinessException(ErrorCodeConfig.ERR_USER_CAN_NOT_FOLLOW_THEMSELVES);
        }
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
