import * as express from 'express';
import * as _ from 'lodash';
import {handleResponse, handleReturn, ReturnModel} from '../shared/index';
import {PermissionModel, PermissionGroupModel} from '../../shared/index';
import {
  getPermissions,
  addUpdatePermission,
  addUpdatePermissionGroup,
  getPermissionGroups,
  getPermissionGroupPermissions,
  getPermissionGroupDonotHavePermissions,
  addPermissionGroupPermissions
} from '../controllers/system_controllers/permission';

const router = express.Router();

/*get all permissions*/
router.get('/get_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 || parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getPermissions(parseInt(query.page, 10), parseInt(query.pageSize, 10), (returnVal: ReturnModel<PermissionModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add permission*/
router.post('/add_permission', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionModel = req.body.permission;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  addUpdatePermission(String(process.env.INSERT), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*update permission*/
router.put('/update_permission', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionModel = req.body.permission;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  addUpdatePermission(String(process.env.UPDATE), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add permission group*/
router.post('/add_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionGroupModel = req.body.permission_group;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  addUpdatePermissionGroup(String(process.env.INSERT), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*update permission group*/
router.put('/update_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionGroupModel = req.body.permission_group;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  addUpdatePermissionGroup(String(process.env.UPDATE), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*get all permission groups paging*/
router.get('/get_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 || parseInt(query.pageSize, 10) < 1 ||
    !query.flag || (parseInt(query.flag, 10) !== 0 && parseInt(query.flag, 10) !== 1)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getPermissionGroups(parseInt(query.flag, 10), parseInt(query.page, 10), parseInt(query.pageSize, 10),
    (returnVal: ReturnModel<PermissionGroupModel[]>) => {
      handleReturn(returnVal, res, next);
    });
});

/*query the permissions that this permission group has paging*/
router.get('/get_permission_group_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.permissionGroupId || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 ||
    parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getPermissionGroupPermissions(parseInt(query.page, 10), parseInt(query.pageSize, 10), parseInt(query.permissionGroupId, 10),
    (returnVal: ReturnModel<PermissionModel[]>) => {
      handleReturn(returnVal, res, next);
    });
});

/*query the permissions that this permission group does not have client paging*/
router.get('/get_permission_group_donot_have_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.permissionGroupId) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  getPermissionGroupDonotHavePermissions(parseInt(query.permissionGroupId, 10), (returnVal: ReturnModel<PermissionModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add permissions to the permission group  batch add*/
router.post('/add_permission_group_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const permissionIdArray = req.body.permissionIdArray;
  const permissionGroupId = req.body.permissionGroupId;
  const permissionIdArrayLength = req.body.permissionIdArrayLength;
  const operatorId = req.body.operatorId;
  if (!permissionIdArray || !permissionGroupId || !permissionIdArrayLength || !operatorId) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  addPermissionGroupPermissions(parseInt(permissionGroupId, 10), permissionIdArray, parseInt(permissionIdArrayLength, 10),
    parseInt(operatorId, 10), (returnVal: ReturnModel<boolean>) => {
      handleReturn(returnVal, res, next);
    });
});

export const permissionRouter = router;
