package com.macrame.wiredcraft.demo.controllers;

import com.beust.ah.A;
import com.macrame.wiredcraft.demo.configuration.BaseWebTest;
import com.macrame.wiredcraft.demo.documents.Following;
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.dto.AuthorizationDto;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.repositories.mongo.UserRepository;
import com.macrame.wiredcraft.demo.services.FollowingService;
import com.macrame.wiredcraft.demo.services.UserService;
import io.restassured.RestAssured;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.keyvalue.repository.support.SimpleKeyValueRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import java.time.LocalDate;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.document;

public class FriendsControllerTests extends BaseWebTest {
    private final static Logger logger = LoggerFactory.getLogger(FriendsControllerTests.class);
    @Autowired
    private UserService userService;
    @Autowired
    private FollowingService followingService;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void follow(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("user-1");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        User user = userService.save(registerDto).block();
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("friend/post",
                        pathParameters(parameterWithName("id").description("The user id to be followed.")),
                        responseFields(
                                fieldWithPath("id").description("Entity ID"),
                                fieldWithPath("userId").description("User Id"),
                                fieldWithPath("destinationUserId").description("Destination user Id"),
                                fieldWithPath("creationTime").description("creationTime")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .post("/api/following/{id}", user.getUserId())
                .then().assertThat().statusCode(is(HttpStatus.OK.value()))
                .body("destinationUserId", equalTo(user.getUserId().toString()));
    }

    @Test
    public void following(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("user-A");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        User user = userService.save(registerDto).block();
        followingService.save(1L, user.getUserId()).subscribe();
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("friend/following",
                        responseFields(
                                fieldWithPath("[].userId").description("User Id"),
                                fieldWithPath("[].name").description("Name"),
                                fieldWithPath("[].address").description("Address"),
                                fieldWithPath("[].coordinate").description("Coordinate"),
                                fieldWithPath("[].description").description("Description"),
                                fieldWithPath("[].dob").description("Date of birthday"),
                                fieldWithPath("[].status").description("Status"),
                                fieldWithPath("[].lastLoginTime").description("lastLoginTime"),
                                fieldWithPath("[].createdAt").description("createdAt")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .get("/api/following")
                .then().assertThat().statusCode(is(HttpStatus.OK.value()))
                .body("$.size()", equalTo(1));
    }

    @Test
    public void follower(){
        RegisterDto registerDto1 = new RegisterDto();
        registerDto1.setName("follower-A");
        registerDto1.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto1.setDescription("This is user-A for testing");
        registerDto1.setDob(LocalDate.of(2000,1,1));
        registerDto1.setAddress("New York");
        registerDto1.setCoordinate(new Double[]{40.765218, -73.913133});
        RegisterDto registerDto2 = new RegisterDto();
        registerDto2.setName("follower-B");
        registerDto2.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto2.setDescription("This is user-B for testing");
        registerDto2.setDob(LocalDate.of(2000,1,1));
        registerDto2.setAddress("Long Island");
        registerDto2.setCoordinate(new Double[]{40.823439, -73.039149});
        User user1 = userService.save(registerDto1).block();
        User user2 = userService.save(registerDto2).block();
        AuthorizationDto authorizationDto = new AuthorizationDto();
        authorizationDto.setName(user1.getName());
        authorizationDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        String token = userService.signIn(authorizationDto).block();
        followingService.save(user2.getUserId(), user1.getUserId()).subscribe();
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("friend/follower",
                        responseFields(
                                fieldWithPath("[].userId").description("User Id"),
                                fieldWithPath("[].name").description("Name"),
                                fieldWithPath("[].address").description("Address"),
                                fieldWithPath("[].coordinate").description("Coordinate"),
                                fieldWithPath("[].description").description("Description"),
                                fieldWithPath("[].dob").description("Date of birthday"),
                                fieldWithPath("[].status").description("Status"),
                                fieldWithPath("[].lastLoginTime").description("lastLoginTime"),
                                fieldWithPath("[].createdAt").description("createdAt")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization",token)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .get("/api/follower")
                .then().assertThat().statusCode(is(HttpStatus.OK.value()))
                .body("$.size()", equalTo(1));
    }
    @Test
    public void delete(){
        RegisterDto registerDto1 = new RegisterDto();
        registerDto1.setName("following-A");
        registerDto1.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto1.setDescription("This is user-A for testing");
        registerDto1.setDob(LocalDate.of(2000,1,1));
        registerDto1.setAddress("New York");
        registerDto1.setCoordinate(new Double[]{40.765218, -73.913133});
        RegisterDto registerDto2 = new RegisterDto();
        registerDto2.setName("following-B");
        registerDto2.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto2.setDescription("This is user-B for testing");
        registerDto2.setDob(LocalDate.of(2000,1,1));
        registerDto2.setAddress("Long Island");
        registerDto2.setCoordinate(new Double[]{40.823439, -73.039149});
        User user1 = userService.save(registerDto1).block();
        User user2 = userService.save(registerDto2).block();
        AuthorizationDto authorizationDto = new AuthorizationDto();
        authorizationDto.setName(user1.getName());
        authorizationDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        String token = userService.signIn(authorizationDto).block();
        Following following = followingService.save(user1.getUserId(), user2.getUserId()).block();
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("friend/delete"))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization",token)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .delete("/api/following/{id}", following.getId())
                .then().assertThat().statusCode(is(HttpStatus.OK.value()));
    }
    @AfterMethod
    public void cleanUp()
    {
        logger.debug("Cleanup the records after testing.");
        userRepository.deleteAll().subscribe(System.out::println);
    }
}
