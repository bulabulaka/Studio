import * as bcrypt from 'bcryptjs';
import {knex} from '../../db/connection';
import {ReturnModel, comparePass} from '../../shared/index';
import {RegisterModel, m_user, LoginModel, UserModel} from '../../../shared/index';
import jwt = require('jsonwebtoken');
import {QueryError, RowDataPacket} from 'mysql';

/*get userinfo by userId*/
export function getUserInfoById(userId: number, callback: (returnVal: ReturnModel<UserModel>) => void) {
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

