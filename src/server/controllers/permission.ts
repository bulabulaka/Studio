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

    if (mPermission.kind === 0) {
      let mPage: m_page = new m_page();
      mPage.route = permission.route;
      mPage.created_datetime = new Date();
      mPage.creator_id = permission.creator_id;
      mPage.auditstat = 0;
      callback(null, mPermission, null, mPage);
    } else {
      let mServiceApi: m_service_api = new m_service_api();
      mServiceApi.route = permission.route;
      mServiceApi.method = permission.method;
      mServiceApi.created_datetime = new Date();
      mServiceApi.creator_id = permission.creator_id;
      callback(null, mPermission, mServiceApi);
    }
  } else {
    error = 'data is invalidate';
    callback(error);
  }
}
