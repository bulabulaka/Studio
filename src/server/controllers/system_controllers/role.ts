import {m_role,roleModel,permissionGroupModel} from '../../../shared/index';
import {ReturnModel} from '../../shared/index';
import {knex} from '../../db/connection';
import {QueryError, RowDataPacket} from 'mysql';

export function Get_Roles(currentPage:number,pageSize:number,callback: (returnVal:ReturnModel<roleModel[]>,totalCount:number) => void) {
  knex.raw(`SET @total_count = 0; CALL get_roles(${currentPage}, ${pageSize}, @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',rows[0][1]),totalCount);
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null,err),0);
    });
}


export function Add_Update_Role(flag: string, role: roleModel, callback: (returnVal:ReturnModel<boolean>) => void) {
  let mRole = new m_role();
  mRole.name = role.name;
  mRole.description = role.description;
  mRole.auditstat = role.auditstat;
  mRole.order_no = role.order_no;
  if (flag) {
    if (flag === String(process.env.INSERT)) {
      mRole.created_datetime = new Date();
      mRole.creator_id = role.creator_id;
    } else if (flag === String(process.env.UPDATE)) {
      mRole.id = role.id;
      mRole.modified_datetime = new Date();
      mRole.modifier_id = role.modifier_id;
    } else {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'param is invalid',false));
    }
  } else {
    return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'param is invalid',false));
  }

  if(flag === String(process.env.INSERT)){
    knex('m_role').returning('id').insert(mRole)
      .then((ids) => {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE), 'OK', true));
      })
      .catch((e) => {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',false, e));
      })
  }else{
    knex('m_role').where('id', '=', mRole.id).update(mRole)
      .then(() => {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE), 'OK', true));
      })
      .catch((e) => {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',false, e));
      })
  }
}

export function Get_Role_Permission_Groups(currentPage:number, pageSize:number,roleId:number, callback: (returnVal:ReturnModel<permissionGroupModel[]>,totalCount:number) => void) {
  knex.raw(`SET @total_count = 0; CALL get_role_permission_groups(${roleId},${currentPage},${pageSize},@total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      let totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',rows[0][1]),totalCount);
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null,err),0);
    })
}

export function Get_Role_Donot_Have_Permission_Groups(roleId:number, callback: (returnVal:ReturnModel<permissionGroupModel[]>) => void) {
  knex.raw(`SELECT id,name,description,auditstat,created_datetime
            FROM m_permission_group
            WHERE auditstat = 1 
            AND id NOT IN (SELECT B.id FROM m_role_permission_group AS A 
                           INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
			                  	 WHERE A.role_id = ${roleId} AND A.auditstat = 1)`)
    .then((rows) => {
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',rows[0]));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',null,err));
    })
}

export function Add_Role_Permission_Groups(permissionGroupIdArray:string,roleId:number,permissionGroupIdArrayLength:number,operatorId:number, callback: (returnVal:ReturnModel<boolean>) => void) {
  knex.raw(`SET @return_code = 0;CALL add_role_permission_groups(${roleId},'${permissionGroupIdArray}',${permissionGroupIdArrayLength},${operatorId},@return_code);SELECT @return_code AS returnCode;`)
    .then((rows: RowDataPacket[]) => {
      let returnCode = rows[0][2][0].returnCode;
      if (returnCode === parseInt(process.env.SUCCESS_CODE)) {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE),'OK',true));
      }
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Fail',false));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE),'Error',false,err));
    })
}


