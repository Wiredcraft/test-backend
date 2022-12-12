package com.macrame.wiredcraft.demo.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

@EnableMongoRepositories(basePackages = {"com.macrame.wiredcraft.demo.repositories.mongo"})
@Configuration
public class DefaultDataConfiguration {
}
