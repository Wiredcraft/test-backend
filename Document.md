## api design

```
1. GET /api/users api can get the available user list
2. POST /api/users api can create a user
3. DELETE /api/users/{userId} api can delete the user
4. PUT /api/users/{userId} api can update user
5. GET /api/users/followers api can get the user's followers information
6. GET /api/users/following api can get the user's following information
7. POST /api/users/{followId}/follow can follow someone
8. DELETE /api/users/{followId}/follow can unfollow someone
9. GET /api/users/nearby can get the user's nearby friends
```

## database design

```
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

```
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

## What's more
you can use swagger to make a quickly api test about the service. enjoy it.

here is the swagger website:
https://user.v2j.tech/swagger-ui/index.html