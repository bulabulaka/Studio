CREATE PROCEDURE `get_user_info` (IN user_id INT)
BEGIN
  SELECT * FROM m_user WHERE id = user_id;

  SELECT DISTINCT H.*
  FROM m_user AS A 
  INNER JOIN m_user_role AS C ON C.user_id = A.id AND C.auditstat = 1
  INNER JOIN m_role AS D ON D.id = C.role_id AND D.auditstat = 1
  INNER JOIN m_role_permission_group AS E ON E.role_id = D.id AND E.auditstat = 1
  INNER JOIN m_permission_group AS F ON F.id = E.permission_group_id AND F.auditstat = 1
  INNER JOIN m_permission_group_permission AS G ON G.permission_group_id = F.id AND F.auditstat = 1
  INNER JOIN m_permission AS H ON H.id = G.permission_id
  WHERE A.id = user_id
  ORDER BY H.id;
END
