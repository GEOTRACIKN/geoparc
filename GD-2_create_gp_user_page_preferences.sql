-- GD-2 - Préférences communes des pages GeoParc
--
-- Cette table est volontairement séparée des tables GeoTracking
-- `preferences_columns` et `user_page_preferences`.
--
-- Une ligne représente une préférence d'un utilisateur pour une page.
-- `preference_value` contient toujours une valeur JSON produite par
-- JSON.stringify (chaîne, nombre, booléen, tableau, objet ou null).

CREATE TABLE IF NOT EXISTS `gp_user_page_preferences` (
  `id_preference` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_user` INT(11) NOT NULL,
  `page_key` VARCHAR(100) NOT NULL,
  `preference_key` VARCHAR(100) NOT NULL,
  `preference_value` LONGTEXT
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_bin
    NOT NULL
    CHECK (JSON_VALID(`preference_value`)),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_preference`),
  UNIQUE KEY `uq_gp_user_page_preference`
    (`id_user`, `page_key`, `preference_key`),
  KEY `idx_gp_preference_page` (`page_key`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- Contrats SQL prévus pour l'API GeoParc :
--
-- Lecture d'une page :
-- SELECT preference_key, preference_value, updated_at
-- FROM gp_user_page_preferences
-- WHERE id_user = ? AND page_key = ?;
--
-- Sauvegarde / mise à jour :
-- INSERT INTO gp_user_page_preferences
--   (id_user, page_key, preference_key, preference_value)
-- VALUES (?, ?, ?, ?)
-- ON DUPLICATE KEY UPDATE
--   preference_value = VALUES(preference_value),
--   updated_at = CURRENT_TIMESTAMP;
--
-- Réinitialisation complète d'une page :
-- DELETE FROM gp_user_page_preferences
-- WHERE id_user = ? AND page_key = ?;
