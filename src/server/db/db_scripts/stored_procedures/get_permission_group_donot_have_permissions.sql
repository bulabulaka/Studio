delimiter $$

CREATE PROCEDURE `get_permission_group_donot_have_permissions`(IN pg_id INT)
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
END$$

