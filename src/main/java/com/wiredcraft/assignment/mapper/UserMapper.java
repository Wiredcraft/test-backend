package com.wiredcraft.assignment.mapper;

import com.wiredcraft.assignment.dto.resp.UserInfoResp;
import com.wiredcraft.assignment.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * users information table Mapper
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    List<UserInfoResp> getUserNearByList(Map<String, Object> condition);
}
