import * as bcrypt from 'bcryptjs';
import {knex} from '../../db/connection';
import {comparePass, ReturnModel} from '../../shared/index';
import {RegisterModel, m_user, LoginModel, UserModel, RoleModel, PermissionGroupModel, PermissionModel} from '../../../shared/index';
import jwt = require('jsonwebtoken');
import {QueryError, RowDataPacket} from 'mysql';
import * as _ from 'lodash';

/*get userinfo by userId*/

export function getUserInfoById(userId: number, callback: (returnVal: ReturnModel<UserModel>) => void) {
  knex.raw(`CALL get_user_info(${userId})`)
    .then((result) => {
      if (!result) {
        return callback(new ReturnModel<UserModel>(parseInt(process.env.FAIL_CODE, 10), 'User not found'));
      }
      const userInfo: UserModel = result[0][0][0];
      const userPermissionGroupPermissions: PermissionModel[] = result[0][1];
      userInfo.permissionList = result[0][2];
      /*merge permissions*/
      if (!_.isEmpty(userPermissionGroupPermissions)) {
        const addPermissions = _.filter<PermissionModel>(userPermissionGroupPermissions, (p) => {
          return p.flag === 1;
        });
        const reducedPermissions = _.filter<PermissionModel>(userPermissionGroupPermissions, (p) => {
          return p.flag === 2;
        });

        if (!_.isEmpty(addPermissions)) {
          if (!_.isEmpty(userInfo.permissionList)) {
            _.forEach(addPermissions, (p) => {
              if (!_.find(userInfo.permissionList, (up) => {
                  return up.id === p.id;
                })) {
                userInfo.permissionList.push(p);
              }
            });
          } else {
            userInfo.permissionList = addPermissions;
          }
        }
        if (!_.isEmpty(reducedPermissions)) {
          if (!_.isEmpty(userInfo.permissionList)) {
            _.forEach(reducedPermissions, (p) => {
              if (_.find(userInfo.permissionList, (rp) => {
                  return rp.id === p.id;
                })) {
                userInfo.permissionList = _.remove(userInfo.permissionList, (up) => {
                  return up.id !== p.id;
                });
              }
            });
          }
        }
      }
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', userInfo));
    })
    .catch((err) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
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

/*check user permission*/
export function verifyPermission(userId: number, router: string, method: string, callback: (returnVal: ReturnModel<boolean>) => void) {
  getUserInfoById(userId, (returnVal: ReturnModel<UserModel>) => {
    if (returnVal.RCode === parseInt(process.env.SUCCESS_CODE, 10)) {
      const userInfo: UserModel = returnVal.Data;
      if (!_.isEmpty(userInfo)) {
        if (_.find(userInfo.permissionList, (p) => {
            return _.toUpper(p.route) === _.toUpper(router) && _.toUpper(p.method) === _.toUpper(method);
          })) {
          return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', true));
        } else {
          return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Permission Deny', false));
        }
      } else {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Permission Deny', false));
      }
    } else if (returnVal.error) {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', false, returnVal.error));
    } else {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Fail', false));
    }
  });
}


