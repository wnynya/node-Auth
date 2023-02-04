

DROP TABLE IF EXISTS `auth_elements`;
CREATE TABLE `auth_elements` (
  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation` datetime NOT NULL,
  `lastused` datetime NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `auth_permissions`;
CREATE TABLE `auth_permissions` (
  `element` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `array` longtext COLLATE utf8mb4_unicode_ci DEFAULT '[]',
  PRIMARY KEY (`element`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `auth_accounts`;
CREATE TABLE `auth_accounts` (
  `element` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salt` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` longtext COLLATE utf8mb4_unicode_ci DEFAULT '{}',
  PRIMARY KEY (`element`, `eid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `auth_keys`;
CREATE TABLE `auth_keys` (
  `element` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire` datetime NOT NULL,
  `meta` longtext COLLATE utf8mb4_unicode_ci DEFAULT '{}',
  PRIMARY KEY (`element`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `auth_sessions`;
CREATE TABLE `auth_sessions` (
  `sid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci DEFAULT '{}',
  `creation` datetime NOT NULL,
  `lastused` datetime NOT NULL,
  `expire` datetime NOT NULL,
  `account` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agent` longtext COLLATE utf8mb4_unicode_ci DEFAULT 'Unknown',
  `system` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT 'Unknown',
  `browser` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT 'Unknown',
  `ip` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ips` longtext COLLATE utf8mb4_unicode_ci DEFAULT '[]',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

DELETE FROM `auth_elements`;
DELETE FROM `auth_permissions`;
DELETE FROM `auth_accounts`;
DELETE FROM `auth_keys`;
DELETE FROM `auth_sessions`;