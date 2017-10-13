import * as express from 'express';
import * as _ from 'lodash';
import {handleResponse, handleReturn, ReturnModel} from '../shared/index';
import {RoleModel, PermissionGroupModel} from '../../shared/index';
import {
  getRoles,
  addUpdateRole,
  getRolePermissionGroups,
  getRoleDonotHavePermissionGroups,
  addRolePermissionGroups
} from '../controllers/system_controllers/role';

const router = express.Router();

/*get all the roles paging*/
router.get('/get_roles', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 || parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getRoles(parseInt(query.page, 10), parseInt(query.pageSize, 10), (returnVal: ReturnModel<RoleModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add role*/
router.post('/add_role', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: RoleModel = req.body.role;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  addUpdateRole(String(process.env.INSERT), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*update role*/
router.put('/update_role', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: RoleModel = req.body.role;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  addUpdateRole(String(process.env.UPDATE), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*query the permission group that this role has paging*/
router.get('/get_role_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.roleId || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 ||
    parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getRolePermissionGroups(parseInt(query.page, 10), parseInt(query.pageSize, 10), parseInt(query.roleId, 10),
    (returnVal: ReturnModel<PermissionGroupModel[]>) => {
      handleReturn(returnVal, res, next);
    });
});

/*query the permission group that this role does not have  client paging*/
router.get('/get_role_donot_have_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.roleId) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getRoleDonotHavePermissionGroups(parseInt(query.roleId, 10), (returnVal: ReturnModel<PermissionGroupModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add permission group to the role  batch add*/
router.post('/add_role_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const permissionGroupIdArray = req.body.permissionGroupIdArray;
  const roleId = req.body.roleId;
  const permissionGroupIdArrayLength = req.body.permissionGroupIdArrayLength;
  const operatorId = req.body.operatorId;
  if (!permissionGroupIdArray || !roleId || !permissionGroupIdArrayLength || !operatorId) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  addRolePermissionGroups(permissionGroupIdArray, parseInt(roleId, 10), parseInt(permissionGroupIdArrayLength, 10),
    parseInt(operatorId, 10), (returnVal: ReturnModel<boolean>) => {
      handleReturn(returnVal, res, next);
    });
});

export const roleRouter = router;
