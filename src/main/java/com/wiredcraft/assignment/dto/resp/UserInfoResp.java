package com.wiredcraft.assignment.dto.resp;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResp {

    /**
     * user id
     */
    private Integer id;

    /**
     * user name
     */
    private String name;

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
     * longitude
     */
    private Double longitude;

    /**
     * latitude
     */
    private Double latitude;


    /**
     * create time
     */
    private Date createdAt;

}
