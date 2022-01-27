package com.test.demojames.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "com.test.demojames.repository")
@EntityScan(basePackages = "com.test.demojames.model.entity")
public class PersistenceJPAConfig {
}
