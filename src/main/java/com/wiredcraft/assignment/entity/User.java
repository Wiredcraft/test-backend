package com.wiredcraft.assignment.entity;

import java.time.LocalDateTime;
import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * users information table
 * </p>
 *
 * @author jarvis.jia
 * @since 2022-05-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value="id",type = IdType.AUTO)
    private Long id;

    /**
     * user name
     */
    private String name;

    /**
     * user password
     */
    private String password;

    /**
     * date of birth
     */
    private String dob;

    /**
     * user address
     */
    private String address;

    /**
     * user address
     */
    private String description;

    /**
     * user state. 1.deleted  0:not deleted
     */
    private Integer deleted;

    /**
     * create time
     */
    private Date createdAt;

    /**
     * update time
     */
    private Date updateAt;


}
