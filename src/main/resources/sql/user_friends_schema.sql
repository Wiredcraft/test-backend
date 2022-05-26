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