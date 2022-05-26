# Application test-backend

---
Build a RESTful API that can `get/create/update/delete` user data from a persistence database

* [Requirement](Requirement.md)

## Table of Contents

* [Dependencies](#dependencies)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
  * [Run Application](#run-application)
  * [Run Unit Test](#run-unit-test)
* [Logging](#logging)
  * [General Logging](#general-logging)
  * [Request Logging](#request-logging)
* [API Documentation](#api-documentation)

---

## Dependencies

| Modules                 | Dependency         |
|-------------------------|--------------------|
| IDE                     | `IDEA`             |
| JDK version             | `1.8`              |
| Database                | `MySQL`            |
| Persistence Framework   | `MyBatis-Plus`     |
| Web Framework           | `springboot`       |
| Logging Framework       | `Slf4j`            |
| Documentation           | `swagger3`         |
| Unit Test               | `junit`            |
| user auth strategy      | `JWT`              |

---

## Project Structure


```
├── README.md
├── Requirement.md
├── log (log directory)
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── wiredcraft
│   │   │           └── assignment
│   │   │               ├── AssignmentApplication.java (project entry）
│   │   │               ├── annotations （2 annotations can control that the controller method need user login or not)
│   │   │               ├── config (config components)
│   │   │               ├── controller
│   │   │               ├── dto (request data structure or response data structure)
│   │   │               ├── entity
│   │   │               ├── enums (state enums for the entity)
│   │   │               ├── exception (handle the global exception and log the error)
│   │   │               ├── filter (log the request and response data by filter)
│   │   │               ├── interceptor (handle the request which need user login or not globally)
│   │   │               ├── mapper (dao layer)
│   │   │               ├── service (service layer)
│   │   │               ├── utils (project util tools)
│   │   │               └── web (define the business error code types, define http response data structure)
│   │   └── resources
│   │       ├── application.properties
│   │       ├── logback-spring.xml (define the log format)
│   │       └── mapper
│   │           ├── UserFriendsMapper.xml
│   │           └── UserMapper.xml
│   └── test (unit test)
│     
└── target
```    

## Getting Started

### Run Application
1. Install JDK1.8 
2. Prepare a local or remote MySQL db.
3. Open the project with IDEA IDE, and the ide can autoload the project. 
4. Modify the `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`, `spring.sql.init.username`, `spring.sql.init.password` value in `src/main/application.properties` file according to your real MySQL environment.
4. Run the IDEA. The MySQL schema and data can be auto generated. You can check it.
5. Enjoy with the [APIs](#api-documentation). Or you can check the api document in `http://localhost:9999/swagger-ui/index.html`.
6. I also deploy the project online. You can check it in `https://wiredcraft.v2j.tech/swagger-ui/index.html`

### Run Unit Test
open the test/java/com/wiredcraft/assignment/service/impl/UserFriendsServiceImplTest file, right click the button nearby the `UserFriendsServiceImplTest` class, click `Run xxx with Coverage`
open the test/java/com/wiredcraft/assignment/service/impl/UserServiceImplTest file, right click the button nearby the `UserServiceImplTest` class, click `Run xxx with Coverage`


## Logging
The project use the Slf4j framework to log. And I define 2 kinds of log below.

### General Logging

```java
log.info("foo");
log.error("error");
```

```
# Output
2022-05-24 00:16:57  INFO 25726 --- [nio-9999-exec-1] c.w.a.controller.UserController          : hello
2022-05-26 00:16:57  ERROR 25726 --- [nio-9999-exec-1] c.w.a.controller.UserController         : error
```

### Request And Response Logging

I use the springboot filter feature to handle all the request and response information, and make the key information to JSON format and auto log it.
Because of the consistent log format, we can upload the log to elasticsearch, zabbix or some cloud logging platform to analyze, monitor and warn it.

What's more, the logger can also can get `traceId` information from request header or generate a new unique one(Kong, openresty can also generate it),
it is a very useful information for distributed system.

```
# Output
2022-05-24 10:29:54  INFO 25928 --- [nio-9999-exec-1] c.w.a.filter.ARequestLoggingFilter       : {"traceId":"81e94501-5997-46c0-b14c-1bcbc2ac08dd","code":"SUCCESS","method":"GET","createTime":"2022-05-24 10:29:54","reqBody":{},"rspBody":{"msg":"OK","code":"SUCCESS","data":[{"createdAt":"2022-05-22 10:00:00","address":"beijing qianmen","dob":"1990-11-10","latitude":39.999375,"name":"peter","description":"hello world","id":1,"longitude":116.402843},{"createdAt":"2022-05-26 11:51:19","address":"beijing city, chaoyang street","dob":"1992-11-12","latitude":38.99932,"name":"sunny","description":"I am a good girl","id":2,"longitude":116.3967},{"createdAt":"2022-05-26 11:52:41","address":"tianjin city, chaoyang street","dob":"1972-10-12","latitude":39.918118,"name":"john","description":"I am a good boy","id":3,"longitude":116.40382}],"time":1653582594},"reqUrl":"http://localhost:9999/api/users","executeTime":"303ms"}
```

---

## API Documentation
By the way, you can see it on the [swagger online website](https://wiredcraft.v2j.tech/swagger-ui/index.html)
1. GET /api/users api can get the available user list
2. POST /api/users api can create a user
3. DELETE /api/users/{userId} api can delete the user
4. PUT /api/users/{userId} api can update user
5. GET /api/users/followers api can get the user's followers information
6. GET /api/users/following api can get the user's following information
7. POST /api/users/{followId}/follow can follow someone
8. DELETE /api/users/{followId}/follow can unfollow someone
9. GET /api/users/nearby can get the user's nearby friends

### Database Documentation

```sql
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '' COMMENT 'user name',
  `password` varchar(200) NOT NULL DEFAULT '' COMMENT 'user name',
  `dob` varchar(10) NOT NULL DEFAULT '' COMMENT 'date of birth',
  `address` varchar(200) NOT NULL DEFAULT '' COMMENT 'user address',
  `description` varchar(500) NOT NULL DEFAULT '' COMMENT 'user address',
  `longitude` decimal(10,6) NOT NULL DEFAULT '0.000000' COMMENT 'longitude',
  `latitude` decimal(10,6) NOT NULL DEFAULT '0.000000' COMMENT 'latitude',
  `deleted` tinyint(2) NOT NULL DEFAULT '0' COMMENT 'user state. 1.deleted  0:not deleted',
  `created_at` datetime DEFAULT NULL COMMENT 'create time',
  `update_at` datetime DEFAULT NULL COMMENT 'create time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_longitude` (`longitude`),
  KEY `idx_latitude` (`latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='users information table';
```

```sql
CREATE TABLE `user_friends` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL COMMENT 'uid',
  `follower_id` bigint(20) NOT NULL COMMENT 'follower id',
  `state` tinyint(2) NOT NULL COMMENT 'follow state. 1:valid 0:not valid',
  `created_at` datetime DEFAULT NULL COMMENT 'create time',
  `update_at` datetime DEFAULT NULL COMMENT 'create time',
  PRIMARY KEY (`id`),
  KEY `idx_uid_follower` (`uid`,`follower_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='users follow table';
```