import {permissionModel, m_permission, m_service_api, m_page, m_permission_group} from '../../../shared/index';
import {handleResponse,ReturnModel} from '../../shared/index';
import * as express from 'express';
import * as _ from 'lodash';
import {knex} from '../../db/connection';
import {QueryError, RowDataPacket} from 'mysql';

export function Get_Permissions(currentPage:number,pageSize:number,callback:any) {
  knex.raw(`SET @total_count = 0; CALL get_permissions(${currentPage}, ${pageSize}, @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',rows[0][1]),totalCount);
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null,err),0);
    });
}

export function Add_Update_Permission(flag: string, permission: permissionModel, callback: any) {
    let mPermission: m_permission = new m_permission();
    let mPage: m_page;
    let mServiceApi: m_service_api;
    //initial permission
    mPermission.name = permission.name;
    mPermission.description = permission.description;
    mPermission.auditstat = permission.auditstat;
    mPermission.order_no = permission.order_no;
    mPermission.kind = permission.kind;
    if (flag) {
      if (flag === String(process.env.INSERT)) {
        mPermission.created_datetime = new Date();
        mPermission.creator_id = permission.creator_id;
      } else if (flag === String(process.env.UPDATE)) {
        mPermission.id = permission.id;
        mPermission.modified_datetime = new Date();
        mPermission.modifier_id = permission.modifier_id;
      } else {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'param is invalid'));
      }
    } else {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'param is invalid'));
    }

    if (mPermission.kind === 0) {
      mPage = new m_page();
      mPage.route = permission.route;
      mPage.auditstat = 0;
      if (flag === String(process.env.INSERT)) {
        mPage.created_datetime = new Date();
        mPage.creator_id = permission.creator_id;
      } else {
        mPage.permission_id = permission.id;
        mPage.modifier_id = permission.modifier_id;
        mPage.modified_datetime = new Date();
      }
    } else {
      mServiceApi = new m_service_api();
      mServiceApi.route = permission.route;
      mServiceApi.method = permission.method;
      if (flag === String(process.env.INSERT)) {
        mServiceApi.created_datetime = new Date();
        mServiceApi.creator_id = permission.creator_id;
      } else {
        mServiceApi.permission_id = permission.id;
        mServiceApi.modified_datetime = new Date();
        mServiceApi.modifier_id = permission.modifier_id;
      }
    }

    let error:Error = null;
    if(flag === String(process.env.INSERT)){
      knex.transaction((trx) => {
        knex('m_permission')
          .transacting(trx)
          .insert(mPermission)
          .then((ids) => {
            if (mServiceApi) {
              mServiceApi.permission_id = ids[0];
              return knex('m_service_api').insert(mServiceApi).transacting(trx);
            }
            mPage.permission_id = ids[0];
            return knex('m_page').insert(mPage).transacting(trx);
          })
          .then(trx.commit)
          .catch((e) => {
            trx.rollback();
            error = e;
          })
      }).then((res) => {
          if (res) {
            return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE), 'OK', true));
          }
      }).catch((e) => {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null, _.isEmpty(e) ? error : e));
      });
    }else{
      knex.transaction((trx) => {
        knex('m_permission')
          .transacting(trx)
          .where('id', '=', mPermission.id)
          .update(mPermission)
          .then(() => {
            if (mServiceApi) {
              return knex('m_service_api').where('permission_id', '=', mServiceApi.permission_id).update(mServiceApi).transacting(trx);
            }
            return knex('m_page').where('permission_id', '=', mPage.permission_id).update(mPage).transacting(trx);
          })
          .then(trx.commit)
          .catch((e) => {
            trx.rollback();
            error = e;
          })
      }).then((res) => {
          if (res) {
            return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE), 'OK', true));
          }
      }).catch((e) => {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null, _.isEmpty(e) ? error : e));
      });
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

export function Get_Permission_Groups(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let currentPage = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);

  knex.raw(`SET @total_count = 0; CALL get_permission_groups(${currentPage}, ${pageSize}, @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[0][1], totalCount);
    })
    .catch((err: QueryError) => {
      return next(err);
    });
}

export function Get_Permission_Group_Permissions(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.permissionGroupId || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let currentPage = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);
  let pgId = parseInt(query.permissionGroupId);
  knex.raw(`SET @total_count = 0; CALL get_permission_group_permissions(${pgId},${currentPage},${pageSize},@total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[0][1], totalCount);
    })
    .catch((err: QueryError) => {
      return next(err);
    })
}

export function Get_Permission_Group_Donot_Have_Permissions(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.permissionGroupId) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let pgId = parseInt(query.permissionGroupId);
  knex.raw(`CALL get_permission_group_donot_have_permissions(${pgId});`)
    .then((rows: RowDataPacket[]) => {
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[0][0]);
    })
    .catch((err: QueryError) => {
      return next(err);
    })
}

export function Add_Permission_Group_Permissions(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let permissionIdArray = req.body.permissionIdArray;
  let permissionGroupId = req.body.permissionGroupId;
  let permissionIdArrayLength = req.body.permissionIdArrayLength;
  let operatorId = req.body.operatorId;
  if (!permissionIdArray || !permissionGroupId || !permissionIdArrayLength || !operatorId) {
    error = `data is invalid`;
    return next(error);
  }
  knex.raw(`SET @return_code = 0;CALL add_permission_group_permissions(${permissionGroupId},'${permissionIdArray}',${permissionIdArrayLength},${operatorId},@return_code);SELECT @return_code AS returnCode;`)
    .then((rows: RowDataPacket[]) => {
      let returnCode = rows[0][2][0].returnCode;
      if (returnCode === parseInt(process.env.SUCCESS_CODE)) {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', true);
      }
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'OK', false);
    })
    .catch((err: QueryError) => {
      return next(err);
    })
}
