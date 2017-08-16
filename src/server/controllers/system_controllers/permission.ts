import {permission, m_permission, m_service_api, m_page, m_permission_group} from '../../../shared/index';
import {handleResponse} from '../../shared/index';
import * as express from 'express';
import * as _ from 'lodash';
import {knex} from '../../db/connection';
import {createConnection, QueryError, RowDataPacket} from 'mysql';

export function Get_Permissions(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let currentPage = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);
  let offset = (currentPage - 1) * pageSize;

  let connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'WJL52wld',
    port: 3306,
    database: 'studio',
    multipleStatements: true
  });

  connection.connect();
  connection.query(`SET @total = 0; CALL get_permissions(${currentPage}, ${pageSize}, @total);SELECT @total AS totalPage;`, (err: QueryError, rows: RowDataPacket[]) => {
    if (err) console.log(err);
    console.log(rows[3][0].totalPage);
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[1]);
  });
  connection.end();

  /*knex.raw('CALL get_permissions(1, 1, @total_page)')
    .then((response) => {
      console.log(response);
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', null);
    })
    .catch((err) => {
      return next(err);
    });*/
}

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
