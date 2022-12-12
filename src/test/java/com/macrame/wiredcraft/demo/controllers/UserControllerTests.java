package com.macrame.wiredcraft.demo.controllers;

import com.macrame.wiredcraft.demo.configuration.BaseWebTest;
import com.macrame.wiredcraft.demo.documents.User;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import com.macrame.wiredcraft.demo.dto.UpdateUserDto;
import com.macrame.wiredcraft.demo.services.UserService;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.util.Arrays;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.document;

public class UserControllerTests extends BaseWebTest {
    @Autowired
    private UserService userService;
    @Test
    public void list(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-list");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        userService.save(registerDto).then().subscribe();
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("user/get",
                        responseFields(
                                fieldWithPath("pageable").description("The pageable information of data"),
                                fieldWithPath("pageable.pageSize").description("The size of items per page"),
                                fieldWithPath("pageable.pageNumber").description("The index of current page in the total pages"),
                                fieldWithPath("pageable.offset").description("The offset to be taken according to the underlying page and page size"),
                                fieldWithPath("pageable.paged").description("Whether the current content representing pagination information"),
                                fieldWithPath("pageable.unpaged").description("Whether the current content representing no pagination information"),
                                fieldWithPath("pageable.sort").description("The index of current page in the total pages"),
                                fieldWithPath("pageable.sort.sorted").description("The index of current page in the total pages"),
                                fieldWithPath("pageable.sort.unsorted").description("The index of current page in the total pages"),
                                fieldWithPath("pageable.sort.empty").description("Whether the elements is sorted"),
                                fieldWithPath("pageable").description("The pageable information of data"),
                                fieldWithPath("totalPages").description("The number of total pages"),
                                fieldWithPath("totalElements").description("The total amount of elements"),
                                fieldWithPath("numberOfElements").description("The number of elements currently on this page"),
                                fieldWithPath("number").description("The number of the current page."),
                                fieldWithPath("size").description("The size of the current page."),
                                fieldWithPath("sort").description("The sorting information for "),
                                fieldWithPath("sort.sorted").description("The index of current page in the total pages"),
                                fieldWithPath("sort.unsorted").description("The index of current page in the total pages"),
                                fieldWithPath("sort.empty").description("Whether the elements is sorted"),
                                fieldWithPath("first").description("Whether the current page is the first one."),
                                fieldWithPath("last").description("Whether the current page is the last one."),
                                fieldWithPath("empty").description("Whether the data is empty"),
                                fieldWithPath("content").description("The page content as list."),
                                fieldWithPath("content[].userId").description("User Id"),
                                fieldWithPath("content[].name").description("Name"),
                                fieldWithPath("content[].address").description("Address"),
                                fieldWithPath("content[].coordinate").description("Coordinate"),
                                fieldWithPath("content[].description").description("Description"),
                                fieldWithPath("content[].dob").description("Date of birthday"),
                                fieldWithPath("content[].status").description("Status"),
                                fieldWithPath("content[].lastLoginTime").description("lastLoginTime"),
                                fieldWithPath("content[].createdAt").description("createdAt")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .get("/api/users?page=0&size=20")
                .then().assertThat().statusCode(is(HttpStatus.OK.value()))
                .body("totalElements", greaterThan(0));
    }

    @Test
    public void load(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-load");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        User user = userService.save(registerDto).block();
        RestAssured.given(documentationSpec)
            .accept(MediaType.APPLICATION_JSON_VALUE)
            .when()
            .filter(document("user/load",
                    pathParameters(parameterWithName("id").description("The user id to be loaded.")),
                    responseFields(
                            fieldWithPath("userId").description("User Id"),
                            fieldWithPath("name").description("Name"),
                            fieldWithPath("address").description("Address"),
                            fieldWithPath("coordinate").description("Coordinate"),
                            fieldWithPath("description").description("Description"),
                            fieldWithPath("dob").description("Date of birthday"),
                            fieldWithPath("status").description("Status"),
                            fieldWithPath("lastLoginTime").description("lastLoginTime"),
                            fieldWithPath("createdAt").description("createdAt")
                    )
            ))
            .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
            .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .when()
            .get("/api/user/{id}", user.getUserId())
            .then().assertThat().statusCode(is(HttpStatus.OK.value()))
            .body("name", equalTo("test-load"));
    }


    @Test
    public void save(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-save");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("user/post",
                        responseFields(
                                fieldWithPath("userId").description("User Id"),
                                fieldWithPath("name").description("Name"),
                                fieldWithPath("address").description("Address"),
                                fieldWithPath("coordinate").description("Coordinate"),
                                fieldWithPath("description").description("Description"),
                                fieldWithPath("dob").description("Date of birthday"),
                                fieldWithPath("status").description("Status"),
                                fieldWithPath("lastLoginTime").description("lastLoginTime"),
                                fieldWithPath("createdAt").description("createdAt")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(registerDto)
                .when()
                .post("/api/user/")
                .then().assertThat().statusCode(is(HttpStatus.OK.value()))
                .body("name", equalTo("test-save"));
    }


    @Test
    public void update(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-update");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        User user = userService.save(registerDto).block();
        UpdateUserDto newUser = new UpdateUserDto();
        newUser.setAddress("Chicago");
        newUser.setCoordinate(new Double[]{43.885776, -75.467075});
        newUser.setDescription("I changed this user");
        newUser.setDob(LocalDate.of(2000,1,2));
        RestAssured.given(documentationSpec)
                .accept(MediaType.APPLICATION_JSON_VALUE)
                .when()
                .filter(document("user/patch",
                        pathParameters(parameterWithName("id").description("The user id to be updated.")),
                        requestFields(
                                fieldWithPath("address").description("Address"),
                                fieldWithPath("coordinate").description("Coordinate"),
                                fieldWithPath("description").description("Description"),
                                fieldWithPath("dob").description("Date of birthday")
                        ),
                        responseFields(
                                fieldWithPath("userId").description("User Id"),
                                fieldWithPath("name").description("Name"),
                                fieldWithPath("address").description("Address"),
                                fieldWithPath("coordinate").description("Coordinate"),
                                fieldWithPath("description").description("Description"),
                                fieldWithPath("dob").description("Date of birthday"),
                                fieldWithPath("status").description("Status"),
                                fieldWithPath("lastLoginTime").description("lastLoginTime"),
                                fieldWithPath("createdAt").description("createdAt")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(newUser)
                .when()
                .patch("/api/user/{id}", user.getUserId())
                .then().assertThat().statusCode(is(HttpStatus.OK.value()))
                .body("address", equalTo("Chicago"));
    }


    @Test
    public void delete(){

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-delete");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000,1,1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});
        User user = userService.save(registerDto).block();
        ExtractableResponse<Response> response = RestAssured.given(documentationSpec)
                .when()
                .filter(document("user/delete",
                        pathParameters(parameterWithName("id").description("The user id to be deleted."))
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .header("Authorization","5fa6b5c309c3b91d62b7a2bc80f9f0769a154bef1cd4df9b0c6e260ce7662355d1b0432cca4580d8798329f9cfa98ed30adbb42eb6bdf016734c3ce96019f205c7f71ad60be2584e5fc6637b33294b78fd25db9c64dcbd9d9af09ee304dc4a8254497b319aafb6fb05302135b2c78ce34b500762ee3b851ab5fb3dfd08529228a63fb8c2437ae623656471d6f91f2065456572617201126e65ea233f37defcecd09c9eadbe5387a784745faeaa568ffa2c96ed49f2f9151316e12b5e1212ea355cb64cb192726cd1694d55f3c878d5f4b7a32fd9df2164a25f83b2ec235ee9096f1b1ee372b4f52066cfc4b3c5ec4815feac723f20f78e9f850756c255e4a281")
                .when()
                .delete("/api/user/{id}", user.getUserId())
                .then().extract();
        Assert.assertEquals(response.statusCode(), HttpStatus.OK.value());
        Assert.assertEquals(response.body().as(Integer.class),1);
    }
}
