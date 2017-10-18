CREATE PROCEDURE `get_permission_groups`(IN flag INT,IN current_page INT,IN page_size INT,INOUT total_count INT)
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
END
