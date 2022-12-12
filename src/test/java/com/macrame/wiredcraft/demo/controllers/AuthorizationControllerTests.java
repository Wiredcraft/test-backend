package com.macrame.wiredcraft.demo.controllers;

import com.macrame.wiredcraft.demo.configuration.BaseWebTest;
import com.macrame.wiredcraft.demo.dto.AuthorizationDto;
import com.macrame.wiredcraft.demo.dto.RegisterDto;
import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.LocalDate;

import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.document;

public class AuthorizationControllerTests extends BaseWebTest {

    @Test
    public void signUp() {

        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-sign-up");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000, 1, 1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});

        ExtractableResponse<Response> response = RestAssured.given(documentationSpec)
                .when()
                .filter(document("signup/post",
                        requestFields(
                                fieldWithPath("name").description("Name"),
                                fieldWithPath("password").description("Password"),
                                fieldWithPath("description").description("Description"),
                                fieldWithPath("dob").description("date of birth"),
                                fieldWithPath("address").description("Address"),
                                fieldWithPath("coordinate").description("Coordinate")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(registerDto)
                .when()
                .post("/public/api/user")
                .then().extract();
        Assert.assertEquals(response.statusCode(), HttpStatus.OK.value());
        Assert.assertNotNull(response.body().asString());
    }

    @Test
    public void signIn() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("test-sign-in");
        registerDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");
        registerDto.setDescription("This is a user for testing");
        registerDto.setDob(LocalDate.of(2000, 1, 1));
        registerDto.setAddress("New York");
        registerDto.setCoordinate(new Double[]{42.885776, -76.467075});

        RestAssured.given(documentationSpec)
                .when()
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(registerDto)
                .when()
                .post("/public/api/user")
                .then().extract();

        // Use the same name and password to sign in
        AuthorizationDto authorizationDto = new AuthorizationDto();
        authorizationDto.setName("test-sign-in");
        authorizationDto.setPassword("703342a2ba0f6cd601895902d96c472072a87558135aa879b8de5becb50962bb93f8f0567c0226cc5ffd44633959f5a23ea5e39f4e1b736a144db2b6d11f5445da63ab182fe3385b948c8635e2b29db1d2ab7c095c225658d6bb41a320bd5b65a054b9e5ae716e112c03a0028a0f2398e1494f4e48b81f4993140956c6aa776ad78883ee63aff290d5563bb787bf776ad196a4adfbfa6cf1d41768efebad5cc9ba203054c3448a3e1fbb3b3ef88c7e65b339df2798b45c8d53485b8aaf8f59ddb82bc7f0516e182ea171561bc3ff5bfeb493e23b812df4e1ccbf02c314e543603f7680cccb62c67302cad08c49e4267a825fc63d3cd4678adf6e80721cdc839a");

        ExtractableResponse<Response> response = RestAssured.given(documentationSpec)
                .when()
                .filter(document("signin/post",
                        requestFields(
                                fieldWithPath("name").description("Name"),
                                fieldWithPath("password").description("Password")
                        )
                ))
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(authorizationDto)
                .when()
                .post("/public/api/user/session")
                .then().extract();
        Assert.assertEquals(response.statusCode(), HttpStatus.OK.value());
        Assert.assertNotNull(response.body().asString());
    }

}
