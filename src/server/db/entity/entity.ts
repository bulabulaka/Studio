class baseEntity {
  id: number;
  creator_id: number;
  created_datetime: Date;
  modifier_id: number;
  modified_datetime: Date;
}

export class m_user extends baseEntity {
  username: string;
  password: string;
  auditstat: number;
  expiry_date: Date
}

export class m_userinfo extends baseEntity {
  user_id: number;
  name: string;
  sex: number;
  email: string;
  tel: string;
}

export class m_role extends baseEntity {
  auditstat: number;
  name: string;
  description: string;
  order_no: number;
}

export class m_permission_group extends baseEntity {
  name: string;
  auditstat: number;
  description: string;
  order_no: number;
}

export class m_user_role extends baseEntity {
  user_id: number;
  role_id: number;
}

export class m_role_permission_group extends baseEntity {
  role_id: number;
  permission_group_id: number;
}

export class m_permission extends baseEntity {
  name: string;
  auditstat: number;
  description: string;
  kind: number;
  order_no: number;
}

export class m_permission_group_permission extends baseEntity {
  permission_id: number;
  permission_group_id: number;
}

export class m_user_permission_group extends baseEntity {
  user_id: number;
  permission_group_id: number;
  flag: number;
}

export class m_service_api extends baseEntity {
  permission_id: number;
  method: string;
  route: string;
}

export class m_page extends baseEntity {
  permission_id: number;
  auditstat: number;
  title: string;
  route: string;
}

export class m_operate_log extends baseEntity {
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
  finish_datetime: Date;
}

export class m_dictionary_index extends baseEntity {
  description: string;
  key: string;
  order_no: number;
  auditstat: number;
}

export class m_dictionary_data extends baseEntity {
  dictionary_index_id: number;
  name: string;
  value: string;
  order_no: number;
  auditstat: number;
}

export class m_log_detail extends baseEntity {
  operate_log_id: number;
  kind: number;
  return_code: number;
  return_message: string;
  error_message: string;
}
