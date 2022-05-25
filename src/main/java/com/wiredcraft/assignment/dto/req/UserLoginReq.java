package com.wiredcraft.assignment.dto.req;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginReq {

    @NotNull(message = "name required")
    @ApiModelProperty(value = "name",dataType="String",name="name",example="peter")
    private String name;

    @NotNull(message = "password required")
    @ApiModelProperty(value = "password",dataType="String",name="password",example="123456")
    private String password;


}
