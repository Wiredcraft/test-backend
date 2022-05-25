package com.wiredcraft.assignment.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.crypto.SecureUtil;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.wiredcraft.assignment.dto.req.UserCreateReq;
import com.wiredcraft.assignment.dto.req.UserLoginReq;
import com.wiredcraft.assignment.dto.resp.UserInfoResp;
import com.wiredcraft.assignment.entity.User;
import com.wiredcraft.assignment.enums.UserStateEnum;
import com.wiredcraft.assignment.exception.BusinessException;
import com.wiredcraft.assignment.mapper.UserMapper;
import com.wiredcraft.assignment.service.IUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wiredcraft.assignment.utils.TokenUtil;
import com.wiredcraft.assignment.web.ErrorCodeConfig;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

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

    @Override
    public List<User> getUserList() {
        QueryWrapper<User> query = new QueryWrapper();
        query.eq("deleted", UserStateEnum.NOT_DELETED.getValue());
        return this.list(query);
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
    public UserInfoResp login(UserLoginReq request) {
        User user = this.findByName(request.getName());
        if(user==null){
            throw new BusinessException(ErrorCodeConfig.ERR_USER_NOT_EXIST);
        }

        if(!SecureUtil.md5(request.getPassword()).equals(user.getPassword())){
            throw new BusinessException(ErrorCodeConfig.ERR_PASSWORD_ERROR);
        }
        String token = tokenUtil.getToken(user);
        UserInfoResp resp = new UserInfoResp();
        BeanUtil.copyProperties(user, resp, CopyOptions.create().setIgnoreNullValue(true));
        resp.setToken(token);
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
}
