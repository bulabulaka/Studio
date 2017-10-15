import * as bcrypt from 'bcryptjs';
import {knex} from '../../db/connection';
import {comparePass, ReturnModel} from '../../shared/index';
import {RegisterModel, m_user, LoginModel, UserModel, RoleModel, PermissionGroupModel, PermissionModel} from '../../../shared/index';
import jwt = require('jsonwebtoken');
import {QueryError, RowDataPacket} from 'mysql';

/*get userinfo by userId*/

/*export function getUserInfoById(userId: number, callback: (returnVal: ReturnModel<UserModel>) => void) {
  knex('m_user').where('id', userId).first()
    .then((user) => {
      if (!user) {
        return callback(new ReturnModel<UserModel>(parseInt(process.env.FAIL_CODE, 10), 'User not found'));
      }
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', user));
    })
    .catch((err) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
}*/

export function getUserInfoById(userId: number, callback: (returnVal: ReturnModel<UserModel>) => void) {
  knex.raw(`CALL get_user_info(${userId})`)
    .then((result) => {
      const userInfo: UserModel = result[0][0][0];
      const permissions: PermissionModel[] = result[0][1];
      console.log(userInfo);
      console.log(permissions);
    });
  return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', null));
}

/*register user*/
export function registerUser(_register: RegisterModel, callback: (returnVal: ReturnModel<number>) => void) {
  if (_register.username.length < 6) {
    return callback(new ReturnModel<number>(parseInt(process.env.FAIL_CODE, 10), 'Username must be longer than 6 characters'));
  }
  if (_register.password.length < 6) {
    return callback(new ReturnModel<number>(parseInt(process.env.FAIL_CODE, 10), 'Password must be longer than 6 characters'));
  }
  const salt = bcrypt.genSaltSync();
  const password = bcrypt.hashSync(_register.password, salt);
  knex('m_user')
    .insert({
      username: _register.username,
      password: password,
      auditstat: 0,
      creator_id: 1,
      created_datetime: knex.raw('now()')
    })
    .then((ids) => {
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', ids[0]));
    })
    .catch((err) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', 0, err));
    });
}

/*login*/
export function login(paramObj: LoginModel, callback: (returnVal: ReturnModel<UserModel>) => void) {
  knex('m_user').where('username', paramObj.username).first()
    .then((user) => {
      if (!user) {
        return callback(new ReturnModel<UserModel>(parseInt(process.env.FAIL_CODE, 10), 'User not found'));
      }
      if (!comparePass(paramObj.password, user.password)) {
        return callback(new ReturnModel<UserModel>(parseInt(process.env.FAIL_CODE, 10), 'User not found'));
      } else {
        const token = jwt.sign(user.id, process.env.JWT_SECRET);
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', user, null, 0, token));
      }
    })
    .catch((err) => {
      return callback(new ReturnModel<UserModel>(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
}

/*get all users*/
export function getUsers(currentPage: number, pageSize: number, callback: (returnValue: ReturnModel<UserModel[]>) => void) {
  knex.raw(`SET @total_count = 0; CALL get_users(${currentPage}, ${pageSize}, @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      const totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0][1], null, 0, null, totalCount));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
}

/*get user roles*/
export function getUserRoles(userId: number, currentPage: number, pageSize: number, callback: (returnValue: ReturnModel<RoleModel[]>)
  => void) {
  knex.raw(`SET @total_count = 0; CALL get_user_roles(${userId}, ${currentPage}, ${pageSize},
   @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      const totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0][1], null, 0, null, totalCount));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
}

/*get user don't have roles */
export function getUserDonotHaveRoles(userId: number,
                                      callback: (returnVal: ReturnModel<RoleModel[]>) => void) {
  knex.raw(`SELECT id,name,description,auditstat,created_datetime
            FROM m_role
            WHERE auditstat = 1 
            AND id NOT IN (SELECT B.id FROM m_user_role AS A 
                           INNER JOIN m_role AS B ON B.id = A.role_id AND B.auditstat = 1
			                  	 WHERE A.user_id = ${userId} AND A.auditstat = 1);`)
    .then((rows) => {
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0]));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    })
}

/*add user roles*/
export function addUserRoles(userId: number, roleIdArray: string, roleIdArrayLength: number,
                             operatorId: number, callback: (returnVal: ReturnModel<boolean>) => void) {
  knex.raw(`SET @return_code = 0;CALL add_user_roles(${userId},'${roleIdArray}',
  ${roleIdArrayLength},${operatorId},@return_code);SELECT @return_code AS returnCode;`)
    .then((rows: RowDataPacket[]) => {
      const returnCode = rows[0][2][0].returnCode;
      if (returnCode === parseInt(process.env.SUCCESS_CODE, 10)) {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', true));
      }
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Fail', false));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    })
}

/*get user add or minus permission groups*/
export function getUserAddOrMinusPermissionGroup(flag: number, userId: number, currentPage: number, pageSize: number,
                                                 callback: (returnValue: ReturnModel<PermissionGroupModel[]>) => void) {
  knex.raw(`SET @total_count = 0; CALL get_user_add_or_minus_permission_groups(${flag}, ${userId}, ${currentPage}, ${pageSize},
   @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      const totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0][1], null, 0, null, totalCount));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
}


/*get user haven't processing permission groups client paging*/
export function getUserHaveNotProcessingPermissionGroups(userId: number,
                                                         callback: (returnVal: ReturnModel<PermissionGroupModel[]>) => void) {
  knex.raw(`SELECT id,name,description,auditstat,created_datetime
            FROM m_permission_group
            WHERE auditstat = 1 
            AND id NOT IN (SELECT B.id FROM m_user_permission_group AS A 
                           INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
			                  	 WHERE A.user_id = ${userId} AND A.auditstat = 1);`)
    .then((rows) => {
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0]));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    })
}

/*processing permission groups*/
export function processingPermissionGroups(userId: number, permissionGroupIdArray: string, permissionGroupIdArrayLength: number,
                                           operatorId: number, flag: number, callback: (returnVal: ReturnModel<boolean>) => void) {
  knex.raw(`SET @return_code = 0;CALL processing_user_permission_groups(${flag}, ${userId},'${permissionGroupIdArray}',
  ${permissionGroupIdArrayLength},${operatorId},@return_code);SELECT @return_code AS returnCode;`)
    .then((rows: RowDataPacket[]) => {
      const returnCode = rows[0][2][0].returnCode;
      if (returnCode === parseInt(process.env.SUCCESS_CODE, 10)) {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', true));
      }
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Fail', false));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    })
}


