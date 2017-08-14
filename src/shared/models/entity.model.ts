export class BaseEntity {
  id: number;
  creator_id: number;
  created_datetime: Date;
  modifier_id: number;
  modified_datetime: Date;
}

export class m_user extends BaseEntity {
  username: string;
  password: string;
  auditstat: number;
  expiry_date: Date;
}

export class m_userinfo extends BaseEntity {
  user_id: number;
  name: string;
  sex: number;
  email: string;
  tel: string;
}

export class m_role extends BaseEntity {
  name: string;
  description: string;
  order_no: number;
  auditstat: number;
}

export class m_permission_group extends BaseEntity {
  name: string;
  description: string;
  order_no: number;
  auditstat: number;
}

export class m_user_role extends BaseEntity {
  user_id: number;
  role_id: number;
}

export class m_role_permission_group extends BaseEntity {
  role_id: number;
  permission_group_id: number;
}

export class m_permission extends BaseEntity {
  name: string;
  auditstat: number;
  description: string;
  kind: number;
  order_no: number;
}

export class m_permission_group_permission extends BaseEntity {
  permission_id: number;
  permission_group_id: number;
}

export class m_user_permission_group extends BaseEntity {
  user_id: number;
  permission_group_id: number;
  flag: number;
}

export class m_service_api extends BaseEntity {
  permission_id: number;
  method: string;
  route: string;
}

export class m_page extends BaseEntity {
  permission_id: number;
  title: string;
  route: string;
  auditstat: number;
}

export class m_operate_log extends BaseEntity {
  ip: string;
  user_agent: string;
  accept_encoding: string;
  content_type: string;
  access_token: string;
  params: string;
  query: string;
  method: string;
  route: string;
  user_id: number;
  duration_time: number;
}

export class m_dictionary_index extends BaseEntity {
  description: string;
  key: string;
  order_no: number;
  auditstat: number;
}

export class m_dictionary_data extends BaseEntity {
  dictionary_index_id: number;
  name: string;
  value: string;
  order_no: number;
  auditstat: number;
}

export class m_log_detail extends BaseEntity {
  operate_log_id: number;
  kind: number;
  return_code: number;
  return_message: string;
  error_message: string;
}
