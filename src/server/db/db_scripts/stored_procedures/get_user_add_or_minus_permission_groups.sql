CREATE PROCEDURE `get_user_add_or_minus_permission_groups` (IN flag INT,IN user_id INT,IN current_page INT,IN page_size INT,INOUT total_count INT)
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
END
