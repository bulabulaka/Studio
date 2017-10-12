CREATE DEFINER=`root`@`localhost` PROCEDURE `get_permissions`(IN current_page INT,IN page_size INT,INOUT total_count INT)
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
END