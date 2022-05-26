package com.wiredcraft.assignment.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author jarvis.jia
 * @date 2022/5/25
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResp {

    private UserInfoResp userInfo;

    /**
     * user jwt token
     */
    private String token;


}
