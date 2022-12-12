/**
 * Copyright(c) Jinghong Technology Co.,Ltd.
 * All Rights Reserved.
 * <p>
 * This software is the confidential and proprietary information of Jinghong
 * Technology Co.,Ltd. ("Confidential Information"). You shall not disclose
 * such Confidential Information and shall use it only in accordance with the
 * terms of the license agreement you entered into with Jinghong Technology Co.,Ltd.
 * For more information about Jinghong, welcome to https://www.imagego.com
 * <p>
 * Revision History:
 * Date         Version     Name                Description
 * 2020-04-29  1.0         Franklin            Generated automatically
 */
package com.macrame.wiredcraft.demo.services;

import com.macrame.wiredcraft.demo.configuration.BaseServiceTest;
import com.macrame.wiredcraft.demo.documents.Following;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.repositories.mongo.FollowingRepository;
import com.macrame.wiredcraft.demo.repositories.mongo.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDate;

/**
 * Description:
 * 
 *
 * @author Ayden Franklin
 * Date  12/12/2022
 */
public class FollowingServiceTests extends BaseServiceTest {
    private final static Logger logger = LoggerFactory.getLogger(FollowingServiceTests.class);
    @Autowired
    private FollowingService followingService;
    @Autowired
    private UserService userService;

    @Test
    public void testInsert(){
        RegisterDto registerDto1 = new RegisterDto();
        registerDto1.setName("user-A");
        registerDto1.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto1.setDescription("This is user-A for testing");
        registerDto1.setDob(LocalDate.of(2000,1,1));
        registerDto1.setAddress("New York");
        registerDto1.setCoordinate(new Double[]{40.765218, -73.913133});
        RegisterDto registerDto2 = new RegisterDto();
        registerDto2.setName("user-B");
        registerDto2.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto2.setDescription("This is user-B for testing");
        registerDto2.setDob(LocalDate.of(2000,1,1));
        registerDto2.setAddress("Long Island");
        registerDto2.setCoordinate(new Double[]{40.823439, -73.039149});
        StepVerifier.create(Mono.zip(userService.save(registerDto1), userService.save(registerDto2)).flatMap(result -> {
            Long userA = result.getT1().getUserId();
            Long userB = result.getT2().getUserId();
            return followingService.save(userA, userB);
        })).expectNextCount(1).expectComplete().verify();
    }

    @Test
    public void testFollowing(){
        RegisterDto registerDto1 = new RegisterDto();
        registerDto1.setName("user-A");
        registerDto1.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto1.setDescription("This is user-A for testing");
        registerDto1.setDob(LocalDate.of(2000,1,1));
        registerDto1.setAddress("New York");
        registerDto1.setCoordinate(new Double[]{40.765218, -73.913133});
        RegisterDto registerDto2 = new RegisterDto();
        registerDto2.setName("user-B");
        registerDto2.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto2.setDescription("This is user-B for testing");
        registerDto2.setDob(LocalDate.of(2000,1,1));
        registerDto2.setAddress("Long Island");
        registerDto2.setCoordinate(new Double[]{40.823439, -73.039149});
        // Test: user-A is following user-B
        StepVerifier.create(Mono.zip(userService.save(registerDto1), userService.save(registerDto2)).flatMap(result -> {
            Long userA = result.getT1().getUserId();
            Long userB = result.getT2().getUserId();
            return followingService.save(userA, userB).map(following -> userA);
        }).map(userA -> followingService.findFollowing(userA, 14.6).filter(user-> user.getName().equals("user-B")))).expectNextCount(1).expectComplete().verify();
    }


    @Test
    public void testFollower(){
        RegisterDto registerDto1 = new RegisterDto();
        registerDto1.setName("user-A");
        registerDto1.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto1.setDescription("This is user-A for testing");
        registerDto1.setDob(LocalDate.of(2000,1,1));
        registerDto1.setAddress("New York");
        registerDto1.setCoordinate(new Double[]{40.765218, -73.913133});
        RegisterDto registerDto2 = new RegisterDto();
        registerDto2.setName("user-B");
        registerDto2.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto2.setDescription("This is user-B for testing");
        registerDto2.setDob(LocalDate.of(2000,1,1));
        registerDto2.setAddress("Long Island");
        registerDto2.setCoordinate(new Double[]{40.823439, -73.039149});
        // Test: user-B has a follower user-A
        StepVerifier.create(Mono.zip(userService.save(registerDto1), userService.save(registerDto2)).flatMap(result -> {
            Long userA = result.getT1().getUserId();
            Long userB = result.getT2().getUserId();
            return followingService.save(userA, userB).map(following -> userB);
        }).map(userB -> followingService.findFollower(userB, 20.5).filter(user-> user.getName().equals("user-A")))).expectNextCount(1).expectComplete().verify();
    }

    @Test
    public void testDelete(){
        RegisterDto registerDto1 = new RegisterDto();
        registerDto1.setName("user-A");
        registerDto1.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto1.setDescription("This is user-A for testing");
        registerDto1.setDob(LocalDate.of(2000,1,1));
        registerDto1.setAddress("New York");
        registerDto1.setCoordinate(new Double[]{40.765218, -73.913133});
        RegisterDto registerDto2 = new RegisterDto();
        registerDto2.setName("user-B");
        registerDto2.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto2.setDescription("This is user-B for testing");
        registerDto2.setDob(LocalDate.of(2000,1,1));
        registerDto2.setAddress("Long Island");
        registerDto2.setCoordinate(new Double[]{40.823439, -73.039149});
        // Test: Delete the relationship
        StepVerifier.create(Mono.zip(userService.save(registerDto1), userService.save(registerDto2)).flatMap(result -> {
            Long userA = result.getT1().getUserId();
            Long userB = result.getT2().getUserId();
            return followingService.save(userA, userB).map(Following::getId);
        }).map(id -> followingService.delete(id))).expectNextCount(1).expectComplete().verify();
    }


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FollowingRepository followingRepository;
    @AfterMethod
    public void cleanUp()
    {
        logger.debug("Cleanup the records after testing.");
        userRepository.deleteAll().then().subscribe();
        followingRepository.deleteAll().then().subscribe();
    }
}