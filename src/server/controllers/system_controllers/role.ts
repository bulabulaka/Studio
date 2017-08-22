import {m_role} from '../../../shared/index';
import {handleResponse} from '../../shared/index';
import * as express from 'express';
import * as _ from 'lodash';
import {knex} from '../../db/connection';
import {QueryError, RowDataPacket} from 'mysql';

export function Get_Roles(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let currentPage = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);

  knex.raw(`SET @total_count = 0; CALL get_roles(${currentPage}, ${pageSize}, @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[0][1], totalCount);
    })
    .catch((err: QueryError) => {
      return next(err);
    });
}

export function Add_Update_Role(flag: string, role: m_role, callback: any) {
  let error = '';
  if (role) {
    let mRole = new m_role();
    mRole.name = role.name;
    mRole.description = role.description;
    mRole.auditstat = role.auditstat;
    mRole.order_no = role.order_no;
    if (flag) {
      if (flag.toUpperCase() === 'INSERT') {
        mRole.created_datetime = new Date();
        mRole.creator_id = role.creator_id;
      } else if (flag.toUpperCase() === 'UPDATE') {
        mRole.id = role.id;
        mRole.modified_datetime = new Date();
        mRole.modifier_id = role.modifier_id;
      } else {
        error = 'flag is invalid';
        return callback(error);
      }
    } else {
      error = 'flag is invalid';
      return callback(error);
    }
    callback(null, mRole)
  } else {
    error = 'data is invalid';
    callback(error);
  }
}

export function Get_Role_Permission_Groups(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.roleId || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let currentPage = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);
  let roleId = parseInt(query.roleId);
  knex.raw(`SET @total_count = 0; CALL get_role_permission_groups(${roleId},${currentPage},${pageSize},@total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[0][1], totalCount);
    })
    .catch((err: QueryError) => {
      return next(err);
    })
}

export function Get_Role_Donot_Have_Permission_Groups(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let query = req.query;
  if (_.isEmpty(query) || !query.roleId) {
    error = 'query is invalid';
    res.locals.errorCode = 400;
    return next(error);
  }
  let roleId = parseInt(query.roleId);
  knex.raw(`SELECT id,name,description,auditstat,created_datetime
            FROM m_permission_group
            WHERE auditstat = 1 
            AND id NOT IN (SELECT B.id FROM m_role_permission_group AS A 
                           INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
			                  	 WHERE A.role_id = ${roleId} AND A.auditstat = 1)`)
    .then((rows: RowDataPacket[]) => {
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', rows[0]);
    })
    .catch((err: QueryError) => {
      return next(err);
    })
}

export function Add_Role_Permission_Groups(req: express.Request, res: express.Response, next: any) {
  let error = '';
  let permissionGroupIdArray = req.body.permissionGroupIdArray;
  let roleId = req.body.roleId;
  let permissionGroupIdArrayLength = req.body.permissionGroupIdArrayLength;
  let operatorId = req.body.operatorId;
  if (!permissionGroupIdArray || !roleId || !permissionGroupIdArrayLength || !operatorId) {
    error = `data is invalid`;
    return next(error);
  }
  knex.raw(`SET @return_code = 0;CALL add_role_permission_groups(${roleId},'${permissionGroupIdArray}',${permissionGroupIdArrayLength},${operatorId},@return_code);SELECT @return_code AS returnCode;`)
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


