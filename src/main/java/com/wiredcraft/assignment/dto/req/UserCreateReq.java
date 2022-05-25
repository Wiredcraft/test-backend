package com.wiredcraft.assignment.dto.req;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author jarvis.jia
 * @date 2022/5/26
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateReq {

    /**
     * user name
     */
    @NotNull(message = "name required")
    @ApiModelProperty(value = "name",dataType="String",name="name",example="peter")
    private String name;

    /**
     * user password
     */
    @NotNull(message = "password required")
    @ApiModelProperty(value = "password",dataType="String",name="password",example="123456")
    private String password;

    /**
     * date of birth
     */
    @ApiModelProperty(value = "dob",dataType="String",name="dob",example="1990-11-12")
    private String dob;

    /**
     * user address
     */
    @ApiModelProperty(value = "address",dataType="String",name="address",example="beijing city, chaoyang street")
    private String address;

    /**
     * user address
     */
    @ApiModelProperty(value = "description",dataType="String",name="description",example="I am a good guy, I love java")
    private String description;


}
