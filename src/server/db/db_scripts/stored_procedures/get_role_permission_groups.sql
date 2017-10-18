CREATE PROCEDURE `get_role_permission_groups`(IN role_id INT,IN current_page INT,IN page_size INT,INOUT total_count INT)
BEGIN
DECLARE offset INT;
SET offset = (current_page - 1) * page_size;

SELECT sql_calc_found_rows B.id, B.name, B.auditstat, B.description FROM
m_role_permission_group AS A
INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
WHERE A.role_id = role_id AND A.auditstat = 1
ORDER BY B.created_datetime
LIMIT offset, page_size;

SET total_count = FOUND_ROWS();
END
