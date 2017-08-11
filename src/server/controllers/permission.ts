import {permission, m_permission, m_service_api, m_page, m_permission_group} from '../../shared/index';

export function Add_Update_Permission(flag: string, permission: permission, callback: any) {
  let error = '';
  if (permission) {
    let mPermission: m_permission = new m_permission();
    mPermission.name = permission.name;
    mPermission.description = permission.description;
    mPermission.auditstat = permission.auditstat;
    mPermission.order_no = permission.order_no;
    mPermission.kind = permission.kind;

    if (flag) {
      if (flag.toUpperCase() === 'INSERT') {
        mPermission.created_datetime = new Date();
        mPermission.creator_id = permission.creator_id;
      } else if (flag.toUpperCase() === 'UPDATE') {
        mPermission.id = permission.id;
        mPermission.modified_datetime = new Date();
        mPermission.modifier_id = permission.modifier_id;
      } else {
        error = 'flag is invalid';
        return callback(error);
      }
    } else {
      error = 'flag is invalid';
      return callback(error);
    }

    if (mPermission.kind === 0) {
      let mPage: m_page = new m_page();
      mPage.route = permission.route;
      mPage.auditstat = 0;
      if (flag.toUpperCase() === 'INSERT') {
        mPage.created_datetime = new Date();
        mPage.creator_id = permission.creator_id;
      } else {
        mPage.permission_id = permission.id;
        mPage.modifier_id = permission.modifier_id;
        mPage.modified_datetime = new Date();
      }
      callback(null, mPermission, null, mPage);
    } else {
      let mServiceApi: m_service_api = new m_service_api();
      mServiceApi.route = permission.route;
      mServiceApi.method = permission.method;
      if (flag.toUpperCase() === 'INSERT') {
        mServiceApi.created_datetime = new Date();
        mServiceApi.creator_id = permission.creator_id;
      } else {
        mServiceApi.permission_id = permission.id;
        mServiceApi.modified_datetime = new Date();
        mServiceApi.modifier_id = permission.modifier_id;
      }
      callback(null, mPermission, mServiceApi);
    }
  } else {
    error = 'data is invalid';
    callback(error);
  }
}

export function Add_Update_Permission_Group(flag: string, permissionGroup: m_permission_group, callback: any) {
  let error = '';
  if (permissionGroup) {
    let mPermissionGroup = new m_permission_group();
    mPermissionGroup.name = permissionGroup.name;
    mPermissionGroup.description = permissionGroup.description;
    mPermissionGroup.order_no = permissionGroup.order_no;
    mPermissionGroup.auditstat = permissionGroup.auditstat;
    if (flag) {
      if (flag.toUpperCase() === 'INSERT') {
        mPermissionGroup.creator_id = permissionGroup.creator_id;
        mPermissionGroup.created_datetime = new Date();
      } else if (flag.toUpperCase() === 'UPDATE') {
        mPermissionGroup.id = permissionGroup.id;
        mPermissionGroup.modified_datetime = new Date();
        mPermissionGroup.modifier_id = permissionGroup.modifier_id;
      } else {
        error = 'flag is invalid';
        return callback(error);
      }
      callback(null, mPermissionGroup);
    } else {
      error = 'flag is invalid';
      callback(error);
    }
  } else {
    error = 'data is invalid';
    callback(error);
  }
}
