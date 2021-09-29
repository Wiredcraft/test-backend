DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '创建人',
  `dob` datetime DEFAULT NULL COMMENT 'date of birth',
  `address` varchar(255) DEFAULT NULL COMMENT 'user address',
  `createdBy` int(11) DEFAULT NULL COMMENT 'user created by',
  `updatedBy` int(11) DEFAULT NULL COMMENT 'user updated by',
  `createdAt` datetime DEFAULT NULL COMMENT 'user created date',
  `updatedAt` datetime DEFAULT NULL COMMENT 'user updated date',
  `status` int(2) unsigned DEFAULT NULL COMMENT '0 soft deleted， 1 normal',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE COMMENT 'unique name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


DROP TABLE IF EXISTS `user_relation`;

CREATE TABLE `user_relation` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`user_id` int(11) unsigned DEFAULT NULL COMMENT 'user id, related user table id field',
`flower_id` int(11) unsigned DEFAULT NULL COMMENT 'flower id, realetd user table id field',
PRIMARY KEY (`id`) USING BTREE,
KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;