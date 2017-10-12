CREATE DEFINER=`root`@`localhost` PROCEDURE `get_permission_groups`(IN current_page INT,IN page_size INT,INOUT total_count INT)
BEGIN
DECLARE offset INT;
SET offset = (current_page - 1) * page_size;
SELECT sql_calc_found_rows id,name,description,auditstat 
    FROM m_permission_group
    WHERE auditstat >= 0
	ORDER BY created_datetime 
    LIMIT offset, page_size;
SET total_count = FOUND_ROWS();
END