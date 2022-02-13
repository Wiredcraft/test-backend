package com.wiredcraft.myhomework;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.wiredcraft.myhomework.mapper")
public class MyHomeWorkApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyHomeWorkApplication.class, args);
  }

}
