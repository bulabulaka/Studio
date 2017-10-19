export const seed = (knex, Promise) => {
  return knex.raw(`DROP PROCEDURE IF EXISTS processing_user_permission_groups;`)
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS add_user_roles;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS add_role_permission_groups;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS add_permission_group_permissions;`);
    })
    .then(() => {
      return knex.raw(`DROP FUNCTION IF EXISTS strSplit;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_users;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_permission_group_donot_have_permissions;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_permission_group_permissions;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_permission_groups;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_permissions;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_role_permission_groups;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_roles;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_user_add_or_minus_permission_groups;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_user_roles;`);
    })
    .then(() => {
      return knex.raw(`DROP PROCEDURE IF EXISTS get_user_info;`);
    })
    .then(() => {
      return knex.raw(`CREATE FUNCTION \`strSplit\`(x varchar(255), delim varchar(12), pos int) 
                  RETURNS varchar(255) CHARSET latin1 DETERMINISTIC
                  BEGIN
                     RETURN replace(substring(substring_index(x, delim, pos), 
                     length(substring_index(x, delim, pos - 1)) + 1), delim, '');
	
                     -- end the stored function code block
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`add_permission_group_permissions\`(IN permission_group_id INT,
        IN permission_id_array VARCHAR(255),IN permission_id_array_length INT,IN operator_id INT,INOUT return_code INT)
                  BEGIN
                     DECLARE _index INT;
                     DECLARE _permission_id_str varchar(255);
                     DECLARE _permission_id INT;
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
                         IF _index > permission_id_array_length THEN
                            LEAVE INS;
                         END IF;
                         SELECT strSplit(permission_id_array,',', _index) INTO _permission_id_str;
                         SET _permission_id = CAST(_permission_id_str AS SIGNED);
                         INSERT INTO \`m_permission_group_permission\` (\`permission_id\`,\`permission_group_id\`,
                         \`auditstat\`,\`creator_id\`,\`created_datetime\`)
                         VALUES (_permission_id,permission_group_id,1,operator_id,NOW());
                      END LOOP INS;
                      SET return_code = 1;
                  COMMIT;
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`add_role_permission_groups\`(IN role_id INT,IN permission_group_id_array VARCHAR(255),
                                                 IN permission_group_id_array_length INT,IN operator_id INT,INOUT return_code INT)
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
                       INS:LOOP
                         SET _index = _index + 1;
                         IF _index > permission_group_id_array_length THEN
                           LEAVE INS;
                         END IF;
                         SELECT strSplit(permission_group_id_array,',', _index) INTO _permission_group_id_str;
                         SET _permission_group_id = CAST(_permission_group_id_str AS SIGNED);
                         INSERT INTO \`m_role_permission_group\`(\`role_id\`,\`permission_group_id\`,
                         \`auditstat\`,\`creator_id\`,\`created_datetime\`)
                          VALUES (role_id,_permission_group_id,1,operator_id,NOW());
                       END LOOP INS;
                       SET return_code = 1;
                    COMMIT;
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`add_user_roles\`(IN user_id INT,IN role_id_array VARCHAR(255),
                                     IN role_id_array_length INT,IN operator_id INT,INOUT return_code INT)
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
                            INSERT INTO \`m_user_role\` (\`user_id\`,\`role_id\`,\`auditstat\`,
                            \`creator_id\`,\`created_datetime\`)
                            VALUES (user_id, _role_id,1,operator_id,NOW());
                          END LOOP INS;
                          SET return_code = 1;
                      COMMIT;
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_permission_group_donot_have_permissions\`(IN pg_id INT)
                  BEGIN  
                    WITH cte AS 
                    (SELECT id,name,auditstat,kind,created_datetime FROM m_permission 
                    WHERE auditstat = 1 
                    AND id NOT IN (SELECT B.id FROM m_permission_group_permission AS A 
                    INNER JOIN m_permission AS B ON B.id = A.permission_id AND B.auditstat = 1 
                    WHERE A.permission_group_id = pg_id AND A.auditstat = 1))
                    SELECT C.* FROM 
                    (SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route FROM cte AS A
                    INNER JOIN m_service_api AS B ON B.permission_id = A.id WHERE A.kind = 1   
                    UNION 
                    SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route FROM cte AS A  
                    INNER JOIN m_page AS B ON B.permission_id = A.id WHERE A.kind = 0) AS C  
                    ORDER BY C.created_datetime;
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_permission_group_permissions\`(IN pg_id INT,IN current_page INT,
                                                                  IN page_size INT,INOUT total_count INT)
                  BEGIN  
                    DECLARE offset INT; 
                    SET offset = (current_page - 1) * page_size; 
                    WITH cte AS 
                    (SELECT B.id,B.name,B.auditstat,B.kind,B.created_datetime FROM m_permission_group_permission AS A 
                    INNER JOIN m_permission AS B ON B.id = A.permission_id AND B.auditstat = 1
                    WHERE A.permission_group_id = pg_id AND A.auditstat = 1)
                    SELECT sql_calc_found_rows C.* FROM    
                    (SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route FROM cte AS A 
                    INNER JOIN m_service_api AS B ON B.permission_id = A.id WHERE A.kind = 1   
                    UNION 
                    SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route FROM cte AS A 
                    INNER JOIN m_page AS B ON B.permission_id = A.id   
                    WHERE A.kind = 0) AS C  
                    ORDER BY C.created_datetime     
                    LIMIT offset, page_size; SET total_count = FOUND_ROWS(); 
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_permission_groups\`(IN flag INT,IN current_page INT,IN page_size INT,INOUT total_count INT)
                  BEGIN
                     DECLARE offset INT;
                     SET offset = (current_page - 1) * page_size;

                     IF flag = 0 THEN
                       SELECT sql_calc_found_rows id,name,description,auditstat 
                       FROM m_permission_group
                       WHERE auditstat >= 0
	                     ORDER BY created_datetime 
                       LIMIT offset, page_size;
                       SET total_count = FOUND_ROWS();
                     ELSE 
                       SELECT sql_calc_found_rows id,name,description,auditstat 
                       FROM m_permission_group
                       WHERE auditstat = 1
	                     ORDER BY created_datetime 
                       LIMIT offset, page_size;
                       SET total_count = FOUND_ROWS();
                     END IF;
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_permissions\`(IN current_page INT,IN page_size INT,INOUT total_count INT)
                  BEGIN
                    DECLARE offset INT;
                    SET offset = (current_page - 1) * page_size;
                    SELECT sql_calc_found_rows C.* FROM 
                    (SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route FROM m_permission AS A 
	                  INNER JOIN m_service_api AS B ON B.permission_id = A.id
	                  WHERE A.kind = 1 AND A.auditstat >= 0
                    UNION
	                  SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route FROM m_permission AS A
                    INNER JOIN m_page AS B ON B.permission_id = A.id
                    WHERE A.kind = 0 AND A.auditstat >= 0) AS C 
	                  ORDER BY C.created_datetime 
                    LIMIT offset, page_size;
                    SET total_count = FOUND_ROWS();
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_role_permission_groups\`(IN role_id INT,IN current_page INT,IN page_size INT,
                                                                                                       INOUT total_count INT)
                  BEGIN  
                    DECLARE offset INT; 
                    SET offset = (current_page - 1) * page_size; 
                    SELECT sql_calc_found_rows B.id, B.name, B.auditstat, B.description
                    FROM m_role_permission_group AS A 
                    INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
                    WHERE A.role_id = role_id AND A.auditstat = 1
                    ORDER BY B.created_datetime     
                    LIMIT offset, page_size;
                    SET total_count = FOUND_ROWS(); 
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_roles\`(IN current_page INT,IN page_size INT,INOUT total_count INT)
                  BEGIN
                    DECLARE offset INT;
                    SET offset = (current_page - 1) * page_size;
                    SELECT sql_calc_found_rows id,name,auditstat,description 
                    FROM m_role
                    WHERE auditstat >= 0
                    ORDER BY created_datetime 
                    LIMIT offset, page_size;
                    SET total_count = FOUND_ROWS();
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_user_add_or_minus_permission_groups\` (IN flag INT,
                  IN user_id INT,IN current_page INT,IN page_size INT,INOUT total_count INT)
                  BEGIN  
                    DECLARE offset INT; 
                    SET offset = (current_page - 1) * page_size; 

                    IF flag = 1 THEN
                      SELECT sql_calc_found_rows B.id, B.name, B.auditstat, B.description
                      FROM m_user_permission_group AS A 
                      INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
                      WHERE A.user_id = user_id AND A.auditstat = 1 AND A.flag = 1
                      ORDER BY B.created_datetime     
                      LIMIT offset, page_size;
                    ELSE
                      SELECT sql_calc_found_rows B.id, B.name, B.auditstat, B.description
                      FROM m_user_permission_group AS A 
                      INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
                      WHERE A.user_id = user_id AND A.auditstat = 1 AND A.flag = 2
                      ORDER BY B.created_datetime     
                      LIMIT offset, page_size;
                    END IF;
                    SET total_count = FOUND_ROWS(); 
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_user_info\`(IN user_id INT)
                  BEGIN
                     SELECT A.id, A.username, A.auditstat,A.expiry_date,A.created_datetime, B.name,B.sex,B.email,B.tel
                     FROM m_user AS A
                     LEFT JOIN m_userinfo AS B ON B.user_id = A.id
                     WHERE A.id = user_id;
  
                     WITH cte AS 
                     (SELECT DISTINCT A.flag,C.id,C.name,C.auditstat,C.kind,C.created_datetime 
                     FROM m_user_permission_group AS A
                     INNER JOIN m_permission_group_permission AS B ON B.permission_group_id = A.permission_group_id AND B.auditstat = 1
                     INNER JOIN m_permission AS C ON C.id = B.permission_id AND C.auditstat = 1
                     WHERE A.auditstat = 1 AND A.user_id = user_id)
                     SELECT C.* FROM    
                     (SELECT A.flag,A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route 
                     FROM cte AS A 
                     INNER JOIN m_service_api AS B ON B.permission_id = A.id 
                     WHERE A.kind = 1   
                     UNION 
                     SELECT A.flag,A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route 
                     FROM cte AS A 
                     INNER JOIN m_page AS B ON B.permission_id = A.id    
                     WHERE A.kind = 0) AS C 
                     ORDER BY C.created_datetime;  
  
                     WITH role_permissions_cte AS 
                     (SELECT DISTINCT F.id,F.name,F.auditstat,F.kind,F.created_datetime
                     FROM m_user_role AS A 
                     INNER JOIN m_role AS B ON B.id = A.role_id AND B.auditstat = 1
                     INNER JOIN m_role_permission_group AS C ON C.role_id = B.id AND C.auditstat = 1
                     INNER JOIN m_permission_group AS D ON D.id = C.permission_group_id AND D.auditstat = 1
                     INNER JOIN m_permission_group_permission AS E ON E.permission_group_id = D.id AND E.auditstat = 1
                     INNER JOIN m_permission AS F ON F.id = E.permission_id
                     WHERE A.user_id = user_id AND A.auditstat = 1)
                     SELECT C.* FROM    
                     (SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route 
                     FROM role_permissions_cte AS A 
                     INNER JOIN m_service_api AS B ON B.permission_id = A.id 
                     WHERE A.kind = 1   
                     UNION 
                     SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route 
                     FROM role_permissions_cte AS A 
                     INNER JOIN m_page AS B ON B.permission_id = A.id    
                     WHERE A.kind = 0) AS C 
                     ORDER BY C.created_datetime;    
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_user_roles\` (IN user_id INT, IN current_page INT,
                                                    IN page_size INT,INOUT total_count INT)
                  BEGIN
                    DECLARE offset INT; 
                    SET offset = (current_page - 1) * page_size; 
                    SELECT sql_calc_found_rows B.id, B.name, B.auditstat, B.description 
                    FROM m_user_role AS A 
                    INNER JOIN m_role AS B ON B.id = A.role_id AND B.auditstat = 1
                    WHERE A.user_id = user_id AND A.auditstat = 1
                    ORDER BY B.created_datetime     
                    LIMIT offset, page_size;
                    SET total_count = FOUND_ROWS(); 
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`get_users\`(IN current_page INT, IN page_size INT, INOUT total_count INT)
                  BEGIN
                    DECLARE offset INT;
                    SET offset = (current_page - 1) * page_size;
                    SELECT sql_calc_found_rows id, username, auditstat, expiry_date
                    FROM m_user 
                    WHERE auditstat >= 0
                    ORDER BY id
                    LIMIT offset,page_size;
                    SET total_count = FOUND_ROWS();
                  END`);
    })
    .then(() => {
      return knex.raw(`CREATE PROCEDURE \`processing_user_permission_groups\`(IN flag INT, IN user_id INT,
      IN permission_group_id_array VARCHAR(255),IN permission_group_id_array_length INT,IN operator_id INT,INOUT return_code INT)
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
                          SELECT strSplit(permission_group_id_array,',', _index) INTO _permission_group_id_str;
                          SET _permission_group_id = CAST(_permission_group_id_str AS SIGNED);
                          INSERT INTO \`m_user_permission_group\` (\`user_id\`,\`permission_group_id\`,\`flag\`,
                          \`auditstat\`,\`creator_id\`,\`created_datetime\`)
                          VALUES (user_id,_permission_group_id,flag,1,operator_id,NOW());
                       END LOOP INS;
                     ELSE 
                       INS:LOOP
                          SET _index = _index + 1;
                          IF _index > permission_group_id_array_length THEN
                             LEAVE INS;
                          END IF;
                          SELECT strSplit(permission_group_id_array,',', _index) INTO _permission_group_id_str;
                          SET _permission_group_id = CAST(_permission_group_id_str AS SIGNED);
                          INSERT INTO \`m_user_permission_group\` (\`user_id\`,\`permission_group_id\`,\`flag\`,
                          \`auditstat\`,\`creator_id\`,\`created_datetime\`)
                          VALUES (user_id,_permission_group_id,flag,1,operator_id,NOW());
                       END LOOP INS;
                     END IF;
                     SET return_code = 1;
                   COMMIT;
                END`);
    })
};
