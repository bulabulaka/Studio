delimiter $$

CREATE PROCEDURE `get_permission_group_permissions`(IN pg_id INT,IN current_page INT,IN page_size INT,INOUT total_count INT)
BEGIN
DECLARE offset INT;
SET offset = (current_page - 1) * page_size;
WITH cte AS
(SELECT B.id,B.name,B.auditstat,B.kind,B.created_datetime FROM m_permission_group_permission AS A INNER JOIN m_permission AS B ON B.id = A.permission_id AND B.auditstat = 1
WHERE A.permission_group_id = pg_id AND A.auditstat = 1)
SELECT sql_calc_found_rows C.* FROM
(SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route FROM cte AS A
INNER JOIN m_service_api AS B ON B.permission_id = A.id WHERE A.kind = 1
UNION
SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route FROM cte AS A
INNER JOIN m_page AS B ON B.permission_id = A.id     WHERE A.kind = 0) AS C  ORDER BY C.created_datetime
LIMIT offset, page_size; SET total_count = FOUND_ROWS();
END$$

