CREATE PROCEDURE `add_user_roles`(IN user_id INT,IN role_id_array VARCHAR(255),IN role_id_array_length INT,IN operator_id INT,INOUT return_code INT)
BEGIN
DECLARE _index INT;
DECLARE _role_id_str varchar(255);
DECLARE _role_id INT;

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
  INS:LOOP
    SET _index = _index + 1;
    IF _index > role_id_array_length THEN
      LEAVE INS;
    END IF;
    SELECT strSplit(role_id_array,',', _index) INTO _role_id_str;
    SET _role_id = CAST(_role_id_str AS SIGNED);
    INSERT INTO `m_user_role` (`user_id`,`role_id`,`auditstat`,`creator_id`,`created_datetime`)
    VALUES (user_id, _role_id,1,operator_id,NOW());
  END LOOP INS;
  SET return_code = 1;
COMMIT;
END
