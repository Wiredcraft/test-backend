package com.wiredcraft.assignment.mapper;

import com.wiredcraft.assignment.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * users information table Mapper 接口
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
