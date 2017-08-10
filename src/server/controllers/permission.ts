import {permission, m_permission, m_service_api, m_page} from '../../shared/index';

export function VerifyPermissionData(permission: permission, callback: any) {
  let error = '';
  if (permission) {
    let mPermission: m_permission = new m_permission();
    mPermission.name = permission.name;
    mPermission.description = permission.description;
    mPermission.auditstat = permission.auditstat;
    mPermission.order_no = permission.order_no;
    mPermission.kind = permission.kind;
    mPermission.created_datetime = new Date();
    mPermission.creator_id = permission.creator_id;

    let service_api: m_service_api = new m_service_api();
    service_api.route = permission.route;
    service_api.method = permission.method;
    service_api.created_datetime = new Date();
    service_api.creator_id = permission.creator_id;

    callback(null, mPermission, service_api);
  } else {
    error = 'data is invalidate';
    callback(error);
  }
}
