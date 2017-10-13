CREATE DEFINER=`root`@`localhost` PROCEDURE `processing_user_permission_groups`(IN flag INT, IN user_id INT,IN permission_group_id_array VARCHAR(255),IN permission_group_id_array_length INT,IN operator_id INT,INOUT return_code INT)
BEGIN
DECLARE _index INT;
DECLARE _permission_group_id_str varchar(255);
DECLARE _permission_group_id INT;

DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
--  Only For Debugger
--  GET DIAGNOSTICS CONDITION 1
--  @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
--  SELECT @p1 AS RETURNED_SQLSTATE, @p2 AS MESSAGE_TEXT;
  ROLLBACK;
END;
DECLARE EXIT HANDLER FOR SQLWARNING
BEGIN
--  GET DIAGNOSTICS CONDITION 1
--  @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
--  SELECT @p1 AS RETURNED_SQLSTATE, @p2 AS MESSAGE_TEXT;
  ROLLBACK;
END; 

START TRANSACTION;
  SET _index = 0;
  SET return_code = 0;
  IF flag = 1 THEN 
    INS:LOOP
      SET _index = _index + 1;
      IF _index > permission_group_id_array_length THEN
        LEAVE INS;
      END IF;
      SELECT studio.strSplit(permission_group_id_array,',', _index) INTO _permission_group_id_str;
      SET _permission_group_id = CAST(_permission_group_id_str AS SIGNED);
      INSERT INTO `studio`.`m_user_permission_group` (`user_id`,`permission_group_id`,`flag`,`auditstat`,`creator_id`,`created_datetime`)
      VALUES (user_id,_permission_group_id,flag,1,operator_id,NOW());
	END LOOP INS;
  ELSE 
   INS:LOOP
     SET _index = _index + 1;
     IF _index > permission_group_id_array_length THEN
       LEAVE INS;
     END IF;
     SELECT studio.strSplit(permission_group_id_array,',', _index) INTO _permission_group_id_str;
     SET _permission_group_id = CAST(_permission_group_id_str AS SIGNED);
     INSERT INTO `studio`.`m_user_permission_group` (`user_id`,`permission_group_id`,`flag`,`auditstat`,`creator_id`,`created_datetime`)
     VALUES (user_id,_permission_group_id,flag,1,operator_id,NOW());
   END LOOP INS;
  END IF;
  SET return_code = 1;
COMMIT;
END