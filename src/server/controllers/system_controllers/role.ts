import {m_role, RoleModel, PermissionGroupModel} from '../../../shared/index';
import {ReturnModel} from '../../shared/index';
import {knex} from '../../db/connection';
import {QueryError, RowDataPacket} from 'mysql';

export function getRoles(currentPage: number, pageSize: number, callback: (returnVal: ReturnModel<RoleModel[]>) => void) {
  knex.raw(`SET @total_count = 0; CALL get_roles(${currentPage}, ${pageSize}, @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      const totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0][1], null, 0, null, totalCount));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    });
}

export function addUpdateRole(flag: string, role: RoleModel, callback: (returnVal: ReturnModel<boolean>) => void) {
  const mRole = new m_role();
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
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false));
    }
  } else {
    return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false));
  }

  if (flag === String(process.env.INSERT)) {
    knex('m_role').returning('id').insert(mRole)
      .then(() => {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', true));
      })
      .catch((e) => {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', false, e));
      })
  } else {
    knex('m_role').where('id', '=', mRole.id).update(mRole)
      .then(() => {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', true));
      })
      .catch((e) => {
        return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', false, e));
      })
  }
}

export function getRolePermissionGroups(currentPage: number, pageSize: number, roleId: number,
                                        callback: (returnVal: ReturnModel<PermissionGroupModel[]>) => void) {
  knex.raw(`SET @total_count = 0; CALL get_role_permission_groups(${roleId},${currentPage},${pageSize},
  @total_count);SELECT @total_count AS totalCount;`)
    .then((rows: RowDataPacket[]) => {
      const totalCount = rows[0][3][0].totalCount || 0;
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0][1], null, 0, null, totalCount));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    })
}
export function getRoleDonotHavePermissionGroups(roleId: number, callback: (returnVal: ReturnModel<PermissionGroupModel[]>) => void) {
  knex.raw(`SELECT id,name,description,auditstat,created_datetime
            FROM m_permission_group
            WHERE auditstat = 1 
            AND id NOT IN (SELECT B.id FROM m_role_permission_group AS A 
                           INNER JOIN m_permission_group AS B ON B.id = A.permission_group_id AND B.auditstat = 1
			                  	 WHERE A.role_id = ${roleId} AND A.auditstat = 1);`)
    .then((rows) => {
      return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', rows[0]));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', null, err));
    })
}

export function addRolePermissionGroups(permissionGroupIdArray: string, roleId: number, permissionGroupIdArrayLength: number,
                                        operatorId: number, callback: (returnVal: ReturnModel<boolean>) => void) {
  knex.raw(`SET @return_code = 0;CALL add_role_permission_groups(${roleId},'${permissionGroupIdArray}',${permissionGroupIdArrayLength},
  ${operatorId},@return_code);SELECT @return_code AS returnCode;`)
    .then((rows: RowDataPacket[]) => {
      const returnCode = rows[0][2][0].returnCode;
      if (returnCode === parseInt(process.env.SUCCESS_CODE, 10)) {
        return callback(new ReturnModel(parseInt(process.env.SUCCESS_CODE, 10), 'OK', true));
      }
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Fail', false));
    })
    .catch((err: QueryError) => {
      return callback(new ReturnModel(parseInt(process.env.FAIL_CODE, 10), 'Error', false, err));
    })
}


