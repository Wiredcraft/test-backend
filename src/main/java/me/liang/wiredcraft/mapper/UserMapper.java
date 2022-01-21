package me.liang.wiredcraft.mapper;

import me.liang.wiredcraft.model.User;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM USER WHERE user_id = #{userId}")
    User getUser(@Param("userId") final Long userId);

    @Insert("INSERT INTO USER (" +
            "user_id," +
            "name," +
            "date_of_birth," +
            "address," +
            "latitude," +
            "longitude," +
            "description," +
            "version" +
            ") VALUES (" +
            "#{userId}," +
            "#{name}," +
            "#{dateOfBirth}," +
            "#{address}," +
            "#{latitude}," +
            "#{longitude}," +
            "#{description}," +
            "1)")
    void insertUser(final User user);

    @Update("UPDATE USER SET " +
            "name = #{name}," +
            "date_of_birth = #{dateOfBirth}," +
            "address = #{address}," +
            "latitude = #{latitude}," +
            "longitude = #{longitude}," +
            "description = #{description}," +
            "version = version + 1" +
            " WHERE user_id = #{userId} AND version = #{version}")
    int updateUser(final User user);

    @Delete("DELETE FROM USER WHERE user_id = #{userId}")
    int deleteUser(final Long userId);

}
