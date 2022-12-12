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
 * 10/13/2015	1.0			Franklin			Creation File
 */
package com.macrame.wiredcraft.demo.configuration;

import com.macrame.wiredcraft.demo.Application;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

/**
 * description:
 *
 * @author Ayden Franklin
 * date  12/12/2022
 */
@TestPropertySource("/application-test.yml")
@ActiveProfiles("test")
@SpringBootTest(classes = Application.class)
public abstract class TestConfiguration extends AbstractTestNGSpringContextTests {
    private static final Logger logger = LoggerFactory.getLogger(TestConfiguration.class);
    public final static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo").withExposedPorts(27017);
    public final static GenericContainer redisContainer = new GenericContainer("redis:5.0.3-alpine").withExposedPorts(6379);
    @DynamicPropertySource
    static void changeDynamicProperties(DynamicPropertyRegistry registry) {
        logger.info("MongoDB container is running on {}:{}", mongoDBContainer.getHost(), mongoDBContainer.getFirstMappedPort());
        registry.add("spring.data.mongodb.host", mongoDBContainer::getHost);
        registry.add("spring.data.mongodb.port", mongoDBContainer::getFirstMappedPort);
        logger.info("Redis container is running on {}:{}", redisContainer.getHost(), redisContainer.getFirstMappedPort());
        registry.add("spring.redis.host", redisContainer::getHost);
        registry.add("spring.redis.port", redisContainer::getFirstMappedPort);
    }

    @BeforeSuite
    public static void startContainer() {
        logger.info("Starting up the redis container.");
        redisContainer.start();
        logger.info("Starting up the mongodb container.");
        mongoDBContainer.start();
    }

    @AfterSuite
    public static void stopContainer() {
        logger.info("Stopping the redis container.");
        redisContainer.stop();
        logger.info("Stopping the mongodb container.");
        mongoDBContainer.stop();
    }
}
