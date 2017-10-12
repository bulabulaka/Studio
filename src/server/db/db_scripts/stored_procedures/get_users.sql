CREATE DEFINER=`root`@`localhost` PROCEDURE `get_users`(IN current_page INT, IN page_size INT, INOUT total_count INT)
BEGIN
   DECLARE offset INT;
   SET offset = (current_page - 1) * page_size;
   SELECT sql_calc_found_rows id, username, auditstat, expiry_date
   FROM m_user 
   WHERE auditstat >= 0
   ORDER BY id
   LIMIT offset,page_size;
SET total_count = FOUND_ROWS();
END