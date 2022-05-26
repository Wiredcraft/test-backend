package com.wiredcraft.assignment.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.spatial4j.core.context.SpatialContext;
import com.spatial4j.core.distance.DistanceUtils;
import com.spatial4j.core.shape.Rectangle;
import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.dto.req.UserLoginReq;
import com.wiredcraft.assignment.dto.resp.UserInfoResp;
import com.wiredcraft.assignment.dto.resp.UserLoginResp;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.entity.UserFriends;
import com.wiredcraft.assignment.enums.FollowEnum;
import com.wiredcraft.assignment.enums.UserStateEnum;
import com.wiredcraft.assignment.exception.BusinessException;
import com.wiredcraft.assignment.mapper.UserMapper;
import com.wiredcraft.assignment.service.IUserFriendsService;
import com.wiredcraft.assignment.service.IUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wiredcraft.assignment.utils.CoordinateUtils;
import com.wiredcraft.assignment.utils.TokenUtil;
import com.wiredcraft.assignment.web.ErrorCodeConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * <p>
 * users information table 服务实现类
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {


    @Autowired
    private TokenUtil tokenUtil;
    @Autowired
    private IUserFriendsService userFriendsService;
    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserInfoResp> getUserList() {
        QueryWrapper<User> query = new QueryWrapper();
        query.eq("deleted", UserStateEnum.NOT_DELETED.getValue());
        List<User> users = this.list(query);
        List<UserInfoResp> resp = new ArrayList<>();
        for(User userItem : users){
            UserInfoResp userInfoResp = new UserInfoResp();
            BeanUtil.copyProperties(userItem, userInfoResp, CopyOptions.create().setIgnoreNullValue(true));
            resp.add(userInfoResp);
        }
        return resp;
    }

    @Override
    public void deleteByUserId(Long userId) {
        UpdateWrapper<User> updateWrapper = new UpdateWrapper();
        updateWrapper.eq("id", userId)
                .set("deleted", UserStateEnum.DELETED.getValue())
                .set("update_at", new Date());
        this.update(null, updateWrapper);
    }

    @Override
    public void updateUserInfo(Long userId, User user) {
        User userInfo = this.getById(userId);
        if(userInfo == null){
            throw new BusinessException(ErrorCodeConfig.ERR_USER_NOT_EXIST);
        }
        BeanUtil.copyProperties(user, userInfo, CopyOptions.create().setIgnoreNullValue(true).setIgnoreProperties("id"));
        userInfo.setUpdateAt(new Date());
        this.updateById(userInfo);
    }

    @Override
    public User findByName(String username) {
        QueryWrapper<User> query = new QueryWrapper();
        query.eq("name", username).last("limit 1");
        return this.getOne(query);
    }

    @Override
    public UserLoginResp login(UserLoginReq request) {
        User user = this.findByName(request.getName());
        if(user==null){
            throw new BusinessException(ErrorCodeConfig.ERR_USER_NOT_EXIST);
        }
        if(!SecureUtil.md5(request.getPassword()).equals(user.getPassword())){
            throw new BusinessException(ErrorCodeConfig.ERR_PASSWORD_ERROR);
        }
        String token = tokenUtil.getToken(user);
        UserLoginResp resp = new UserLoginResp();
        resp.setToken(token);
        UserInfoResp userInfo = new UserInfoResp();
        BeanUtil.copyProperties(user, userInfo, CopyOptions.create().setIgnoreNullValue(true));
        resp.setUserInfo(userInfo);
        return resp;
    }

    @Override
    public void createUser(UserCreateReq request) {
        User user = this.findByName(request.getName());
        if(user != null){
            throw new BusinessException(ErrorCodeConfig.ERR_USER_HAS_EXIST);
        }else{
            user = new User();
        }
        BeanUtil.copyProperties(request, user, CopyOptions.create().setIgnoreNullValue(true));
        user.setCreatedAt(new Date());
        user.setPassword(SecureUtil.md5(request.getPassword()));
        this.save(user);
    }

    @Override
    public List<UserInfoResp> getFollowList(Long userId, FollowEnum followEnum) {
        List<UserInfoResp> respList = new ArrayList<>();
        List<UserFriends> userFriends = userFriendsService.getFollowList(userId, followEnum);
        for(UserFriends userFriendItem : userFriends){
            UserInfoResp userFollowResp = new UserInfoResp();
            Long uid;
            if(followEnum == FollowEnum.FOLLOW){
                uid = userFriendItem.getFollowerId();
            }else {
                uid = userFriendItem.getUid();
            }
            User user = this.getById(uid);
            BeanUtil.copyProperties(user, userFollowResp, CopyOptions.create().setIgnoreNullValue(true));
            respList.add(userFollowResp);
        }

        return respList;
    }



    @Override
    public List<UserInfoResp> getNearByFriends(Long userId, Double distance) {
        User user = this.getById(userId);
        Rectangle rectangle = CoordinateUtils.getRectangle(distance, user.getLongitude(), user.getLatitude());
        Map<String, Object> condition = new HashMap<>();
        condition.put("userId", userId);
        condition.put("minX", rectangle.getMinX());
        condition.put("maxX", rectangle.getMaxX());
        condition.put("minY", rectangle.getMinY());
        condition.put("maxY", rectangle.getMaxY());
        List<UserInfoResp> friends = userMapper.getUserNearByList(condition);
        friends = friends.stream()
                .filter(item -> CoordinateUtils.getDistance(item.getLongitude(), item.getLatitude(), user.getLongitude(), user.getLatitude()) <= distance)
                .collect(Collectors.toList());
        return friends;
    }
}
