import * as bcrypt from 'bcryptjs';
import {knex} from '../../db/connection';
import {ReturnModel,comparePass} from '../../shared/index';
import {registerModel,m_user,loginModel,userModel} from '../../../shared/index';
import jwt = require('jsonwebtoken');

/*get userinfo by userId*/
export function getUserInfoById(userId:number,callback:(returnVal:ReturnModel<userModel>) => void){
   knex('m_user').where('id', userId).first()
    .then((user) => {
       if (!user) return callback(new ReturnModel<userModel>(parseInt(process.env.FAIL_CODE),'User not found'));
       return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',user));
    })
    .catch((err) => {
       return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null,err));
    });
}

/*register user*/
export function registerUser(_register:registerModel,callback:(returnVal:ReturnModel<number>) => void){
   if(_register.username.length < 6){
     return callback(new ReturnModel<number>(parseInt(process.env.FAIL_CODE),'Username must be longer than 6 characters'));
   }
   if(_register.password.length < 6){
     return callback(new ReturnModel<number>(parseInt(process.env.FAIL_CODE),'Password must be longer than 6 characters'));
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
    .then((ids) =>{
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',ids[0]));
    })
    .catch((err) =>{
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',0 ,err));
    });
}

/*login*/
export function login(paramObj:loginModel,callback:(returnVal:ReturnModel<userModel>) => void){
  knex('m_user').where('username', paramObj.username).first()
    .then((user) => {
      if (!user) return callback(new ReturnModel<userModel>(parseInt(process.env.FAIL_CODE),'User not found'));
      if (!comparePass(paramObj.password, user.password)) {
        return callback(new ReturnModel<userModel>(parseInt(process.env.FAIL_CODE),'User not found'));
      } else {
        let token = jwt.sign(user.id, process.env.JWT_SECRET);
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',user,null,0,token));
      }
    })
    .catch((err) => {
      return callback(new ReturnModel<userModel>(parseInt(process.env.FAIL_CODE),'Error',null ,err));
    });
}


