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