package com.macrame.wiredcraft.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;

@SpringBootApplication
public class Application {
	private static Logger logger = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		ConfigurableEnvironment env = new StandardEnvironment();

		String externalConfigLocation = env.getProperty("spring.config.location");
		String defaultProfile = env.getProperty("spring.profiles.active");
		if (defaultProfile == null) {
			defaultProfile = "development";
		}
		if (externalConfigLocation != null){
			logger.debug("Found external configuration file [" + externalConfigLocation + "]. This will override the default properties.");
		}

		String user = env.getProperty("user.name");
		logger.debug("Current user is " + env.getProperty("user.name") + ". This will been used as the active profile. [application-\" + user + \".yml]  can be loaded if it is on the classpath.");

		SpringApplication app = new SpringApplication(Application.class);
		app.setAdditionalProfiles("default",defaultProfile, user);

		//Add active profile to environment.
		ApplicationContext ctx = app.run(args);
		String[] activeProfiles = ctx.getEnvironment().getActiveProfiles();
		logger.debug("There are " + activeProfiles.length + " profiles.");
		if (activeProfiles.length>0){
			for (String activeProfile : activeProfiles) {
				logger.debug("Profile will be applied : " + activeProfile);
			}
		}
		logger.info("Application started.");
	}

}
