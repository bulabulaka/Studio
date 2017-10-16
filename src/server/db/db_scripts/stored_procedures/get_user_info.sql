delimiter $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_info`(IN user_id INT)
BEGIN

  SELECT A.id, A.username, A.auditstat,A.expiry_date,A.created_datetime, B.name,B.sex,B.email,B.tel
  FROM m_user AS A
  LEFT JOIN m_userinfo AS B ON B.user_id = A.id
  WHERE A.id = user_id;
  
  
  WITH cte AS 
  (SELECT DISTINCT A.flag,C.id,C.name,C.auditstat,C.kind,C.created_datetime 
  FROM m_user_permission_group AS A
  INNER JOIN m_permission_group_permission AS B ON B.permission_group_id = A.permission_group_id AND B.auditstat = 1
  INNER JOIN m_permission AS C ON C.id = B.permission_id AND C.auditstat = 1
  WHERE A.auditstat = 1 AND A.user_id = user_id)
  SELECT C.* FROM    
  (SELECT A.flag,A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route 
  FROM cte AS A 
  INNER JOIN m_service_api AS B ON B.permission_id = A.id 
  WHERE A.kind = 1   
  UNION 
  SELECT A.flag,A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route 
  FROM cte AS A 
  INNER JOIN m_page AS B ON B.permission_id = A.id    
  WHERE A.kind = 0) AS C 
  ORDER BY C.created_datetime;  
  
  
  WITH role_permissions_cte AS 
  (SELECT DISTINCT F.id,F.name,F.auditstat,F.kind,F.created_datetime
  FROM m_user_role AS A 
  INNER JOIN m_role AS B ON B.id = A.role_id AND B.auditstat = 1
  INNER JOIN m_role_permission_group AS C ON C.role_id = B.id AND C.auditstat = 1
  INNER JOIN m_permission_group AS D ON D.id = C.permission_group_id AND D.auditstat = 1
  INNER JOIN m_permission_group_permission AS E ON E.permission_group_id = D.id AND E.auditstat = 1
  INNER JOIN m_permission AS F ON F.id = E.permission_id
  WHERE A.user_id = user_id AND A.auditstat = 1)
  SELECT C.* FROM    
  (SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,B.method,B.route 
  FROM role_permissions_cte AS A 
  INNER JOIN m_service_api AS B ON B.permission_id = A.id 
  WHERE A.kind = 1   
  UNION 
  SELECT A.id,A.name,A.auditstat,A.kind,A.created_datetime,'GET',B.route 
  FROM role_permissions_cte AS A 
  INNER JOIN m_page AS B ON B.permission_id = A.id    
  WHERE A.kind = 0) AS C 
  ORDER BY C.created_datetime;  
  
END$$

