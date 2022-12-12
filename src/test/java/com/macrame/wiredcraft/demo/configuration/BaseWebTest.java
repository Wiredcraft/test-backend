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
 * Date			Version		Name				Description
 * 10/10/2015	1.0			Franklin			Creation File
 */
package com.macrame.wiredcraft.demo.configuration;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.restdocs.ManualRestDocumentation;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.lang.reflect.Method;

import static org.springframework.restdocs.http.HttpDocumentation.httpRequest;
import static org.springframework.restdocs.http.HttpDocumentation.httpResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.removeHeaders;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestBody;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseBody;
import static org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.documentationConfiguration;

/**
 * description:
 *
 * @author Ayden Franklin
 * date  12/12/2022
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseWebTest extends TestConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(BaseWebTest.class);

    @LocalServerPort
    protected int port;

    private final ManualRestDocumentation restDocumentation = new ManualRestDocumentation();
    protected RequestSpecification documentationSpec;

    @BeforeMethod
    public void setup(Method method) {
        logger.debug("Setting up restDocumentation for testing...");
        RestAssured.port = port;
        this.documentationSpec = new RequestSpecBuilder().addFilter(
                documentationConfiguration(this.restDocumentation)
                        .operationPreprocessors()
                        .withRequestDefaults(
                                removeHeaders("user_identity"),removeHeaders("user_name"),removeHeaders("Host"),removeHeaders("Content-Length")
                                ,prettyPrint())
                        .withResponseDefaults(
                                prettyPrint())
                        .and()
                        .snippets()
                        .withEncoding("utf-8")
                        //.withTemplateFormat(TemplateFormats.markdown())
                        .withDefaults(
                                httpRequest(),httpResponse(),requestBody(),responseBody()
                        )
        ).build();
        this.restDocumentation.beforeTest(getClass(), method.getName());
    }

    @AfterMethod
    public void finish(){
        this.restDocumentation.afterTest();
        logger.debug("Completing for testing");
    }
}
