CREATE PROCEDURE `get_user_roles` (IN user_id INT, IN current_page INT,IN page_size INT,INOUT total_count INT)
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
END
