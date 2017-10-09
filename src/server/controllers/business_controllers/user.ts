import * as bcrypt from 'bcryptjs';
import {knex} from '../../db/connection';
import {ReturnModel} from '../../shared/index';
import {registerModel,m_user} from '../../../shared/index';

/*根据用户ID查找用户信息*/
export function getUserInfoById(userId:number,callback:any){
   knex('m_user').where('id', userId).first()
    .then((user) => {
       if (!user) return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'User not found'));
       return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',user));
    })
    .catch((err) => {
       return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null,err));
    });
}

/*新建用户*/
export function createUser(_register:registerModel,callback:any){
   if(_register.username.length < 6){
     return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Username must be longer than 6 characters'));
   }
   if(_register.password.length < 6){
     return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Password must be longer than 6 characters'));
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
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'Regist Success',ids[0]));
    })
    .catch((err) =>{
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',0 ,err));
    });
}


