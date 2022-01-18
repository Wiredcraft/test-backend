package me.liang.wiredcraft.mapper;

import me.liang.wiredcraft.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM USER WHERE id = #{userId}")
    User getUser(@Param("userId") final String userId);

}
