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
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.domain.UserEntity;
import com.macrame.wiredcraft.demo.dto.AuthorizationDto;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.dto.UpdateUserDto;
import com.macrame.wiredcraft.demo.repositories.mongo.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
public class UserServiceTests extends BaseServiceTest {
    private final static Logger logger = LoggerFactory.getLogger(UserServiceTests.class);
    @Autowired
    private UserService userService;

    @Test
    public void testInsert(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-insert");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        StepVerifier.create(userService.save(registerDto)).expectNextCount(1).expectComplete().verify();
    }

    @Test
    public void testUpdate(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-update");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        UserEntity userEntity = new UserEntity(1L, "ayden");
        StepVerifier.create(userService.save(registerDto).flatMap(changedUser -> {
                    UpdateUserDto updateUserDto = new UpdateUserDto();
                    updateUserDto.setAddress("Chicago");
                    updateUserDto.setCoordinate(new Double[]{43.885776, -75.467075});
                    updateUserDto.setDescription("I changed this user");
                    updateUserDto.setDob(LocalDate.of(2000,1,2));
                    return userService.update(userEntity, changedUser.getUserId(), updateUserDto);
        }))
                .expectNextMatches(updatedUser -> updatedUser.getAddress().equals("Chicago"))
                .expectComplete()
                .verify();
    }

    @Test
    public void testList(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-list");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        PageRequest page = PageRequest.of(0, 20);
        StepVerifier.create(userService.save(registerDto).flatMap(result -> userService.list(page)).map(entities -> entities.getTotalElements()))
                .expectNextMatches(totalElements -> totalElements > 0)
                .expectComplete()
                .verify();
    }

    @Test
    public void testDelete(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-delete");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        UserEntity userEntity = new UserEntity(1L, "ayden");
        StepVerifier.create(userService.save(registerDto).map(User::getUserId).flatMap(id -> userService.delete(userEntity, id)))
                .expectNextCount(1).verifyComplete();
    }

    @Test
    public void testLoad(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-load");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        StepVerifier.create(userService.save(registerDto).map(User::getUserId).flatMap(id -> userService.load(id)))
                .expectNextCount(1).verifyComplete();
    }

    @Test
    public void testSignUp(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-sign-up");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        StepVerifier.create(userService.signUp(registerDto)).expectNextCount(1).verifyComplete();
    }
    @Test
    public void testSignIn(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-sign-in");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        AuthorizationDto authorizationDto = new AuthorizationDto();
        authorizationDto.setName("test-sign-in");
        authorizationDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        StepVerifier.create(userService.save(registerDto).flatMap(token -> userService.signIn(authorizationDto)))
                .expectNextCount(1).verifyComplete();
    }
    @Test
    public void testSignOut(){
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-sign-out");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        AuthorizationDto authorizationDto = new AuthorizationDto();
        authorizationDto.setName("test-sign-out");
        authorizationDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        StepVerifier.create(userService.save(registerDto).map(User::getUserId)
                        .flatMap(userId -> Mono.zip(Mono.just(userId), userService.signIn(authorizationDto)))
                        .flatMap(tuple -> userService.signOut(tuple.getT1(), tuple.getT2())))
                .expectNextCount(1).verifyComplete();
    }
    @Autowired
    private UserRepository userRepository;
    @AfterMethod
    public void cleanUp()
    {
        logger.debug("Cleanup the records after testing.");
        userRepository.deleteAll().subscribe(System.out::println);
    }
}