-- MySQL Script generated by MySQL Workbench
-- Fri 18 Aug 2017 02:17:06 PM CST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema studio
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema studio
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `studio` DEFAULT CHARACTER SET latin1 ;
USE `studio` ;

-- -----------------------------------------------------
-- Table `studio`.`m_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `auditstat` TINYINT NOT NULL,
  `expiry_date` DATETIME NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_userinfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_userinfo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(20) NULL,
  `sex` TINYINT NULL,
  `email` VARCHAR(50) NULL,
  `tel` VARCHAR(30) NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_m_userinfo_m_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_m_userinfo_m_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `studio`.`m_user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `auditstat` TINYINT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(200) NULL,
  `order_no` TINYINT(1) NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_permission_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_permission_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `auditstat` TINYINT NULL,
  `description` VARCHAR(200) NULL,
  `order_no` TINYINT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_user_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_user_role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  `auditstat` TINYINT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_m_user_role_m_role_idx` (`role_id` ASC),
  INDEX `fk_m_user_role_m_user_idx` (`user_id` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_m_user_role_m_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `studio`.`m_user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_m_user_role_m_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `studio`.`m_role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_role_permission_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_role_permission_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `permission_group_id` INT NOT NULL,
  `auditstat` TINYINT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  INDEX `fk_m_role_permission_group_m_permission_group_idx` (`permission_group_id` ASC),
  INDEX `fk_m_role_permission_group_m_role_idx` (`role_id` ASC),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_m_role_permission_group_m_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `studio`.`m_role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_m_role_permission_group_m_permission_group`
    FOREIGN KEY (`permission_group_id`)
    REFERENCES `studio`.`m_permission_group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_permission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `auditstat` TINYINT NOT NULL COMMENT 'permission status default 1 delete 10',
  `description` VARCHAR(200) NULL,
  `kind` TINYINT NOT NULL COMMENT '0:page_info  1:page_operator',
  `order_no` INT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_permission_group_permission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_permission_group_permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `permission_id` INT NOT NULL,
  `permission_group_id` INT NOT NULL,
  `auditstat` TINYINT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  INDEX `fk_m_permission_group_permission_m_permission_group_idx` (`permission_group_id` ASC),
  INDEX `fk_m_permission_group_permission_m_permission_idx` (`permission_id` ASC),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_m_permission_group_permission_m_permission`
    FOREIGN KEY (`permission_id`)
    REFERENCES `studio`.`m_permission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_m_permission_group_permission_m_permission_group`
    FOREIGN KEY (`permission_group_id`)
    REFERENCES `studio`.`m_permission_group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_user_permission_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_user_permission_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `permission_group_id` INT NOT NULL,
  `flag` TINYINT NULL COMMENT 'add or minus permission group',
  `auditstat` TINYINT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  INDEX `fk_m_user_permission_group_m_permission_group_idx` (`permission_group_id` ASC),
  INDEX `fk_m_user_permission_group_m_user_idx` (`user_id` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_m_user_permission_group_m_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `studio`.`m_user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_m_user_permission_group_m_permission_group`
    FOREIGN KEY (`permission_group_id`)
    REFERENCES `studio`.`m_permission_group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_service_api`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_service_api` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `permission_id` INT NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `route` VARCHAR(1000) NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_m_service_api_m_permission_idx` (`permission_id` ASC),
  CONSTRAINT `fk_m_service_api_m_permission`
    FOREIGN KEY (`permission_id`)
    REFERENCES `studio`.`m_permission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_page`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_page` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `permission_id` INT NOT NULL,
  `auditstat` TINYINT NOT NULL COMMENT 'page status  e.g. maintain',
  `title` VARCHAR(100) NULL,
  `route` VARCHAR(1000) NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  INDEX `fk_m_page_m_permission_idx` (`permission_id` ASC),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_m_page_m_permission`
    FOREIGN KEY (`permission_id`)
    REFERENCES `studio`.`m_permission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_operate_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_operate_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ip` VARCHAR(50) NOT NULL,
  `user_agent` VARCHAR(500) NULL,
  `accept_encoding` VARCHAR(100) NOT NULL,
  `content_type` VARCHAR(100) NULL,
  `access_token` VARCHAR(200) NULL,
  `params` TEXT NULL,
  `query` VARCHAR(1024) NULL,
  `method` VARCHAR(10) NOT NULL,
  `route` VARCHAR(1000) NOT NULL,
  `user_id` INT NULL,
  `duration_time` INT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_dictionary_index`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_dictionary_index` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(200) NOT NULL,
  `key` VARCHAR(50) NOT NULL,
  `order_no` TINYINT NULL,
  `auditstat` TINYINT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `key_UNIQUE` (`key` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_dictionary_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_dictionary_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dictionary_index_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `value` VARCHAR(500) NOT NULL,
  `order_no` TINYINT NULL,
  `auditstat` TINYINT NOT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_m_dictionary_data_m_dictionary_index_idx` (`dictionary_index_id` ASC),
  CONSTRAINT `fk_m_dictionary_data_m_dictionary_index`
    FOREIGN KEY (`dictionary_index_id`)
    REFERENCES `studio`.`m_dictionary_index` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `studio`.`m_log_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studio`.`m_log_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operate_log_id` INT NOT NULL,
  `kind` TINYINT NOT NULL COMMENT 'log kind: error or info',
  `return_code` INT NOT NULL,
  `return_message` TEXT NULL,
  `error_message` TEXT NULL,
  `creator_id` INT NOT NULL,
  `created_datetime` DATETIME NOT NULL,
  `modifier_id` INT NULL,
  `modified_datetime` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_m_log_detail_m_operate_log_idx` (`operate_log_id` ASC),
  CONSTRAINT `fk_m_log_detail_m_operate_log`
    FOREIGN KEY (`operate_log_id`)
    REFERENCES `studio`.`m_operate_log` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
