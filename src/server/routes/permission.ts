import * as express from 'express';
import * as _ from 'lodash';
import {handleResponse, ReturnModel, handleReturn} from '../shared/index';
import {PermissionModel, PermissionGroupModel} from '../../shared/index';
import {
  Get_Permissions,
  Add_Update_Permission,
  Add_Update_Permission_Group,
  Get_Permission_Groups,
  Get_Permission_Group_Permissions,
  Get_Permission_Group_Donot_Have_Permissions,
  Add_Permission_Group_Permissions
} from '../controllers/system_controllers/permission';


const router = express.Router();

/*get all permissions*/
router.get('/get_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page, 10) < 1 || parseInt(query.pageSize, 10) < 1) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', null);
  }
  Get_Permissions(parseInt(query.page, 10), parseInt(query.pageSize, 10), (returnVal: ReturnModel<PermissionModel[]>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add permission*/
router.post('/add_permission', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionModel = req.body.permission;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  Add_Update_Permission(String(process.env.INSERT), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*update permission*/
router.put('/update_permission', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionModel = req.body.permission;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  Add_Update_Permission(String(process.env.UPDATE), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*add permission group*/
router.post('/add_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionGroupModel = req.body.permission_group;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  Add_Update_Permission_Group(String(process.env.INSERT), paramObj, (returnVal: ReturnModel<boolean>) => {
    handleReturn(returnVal, res, next);
  });
});

/*update permission group*/
router.put('/update_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const paramObj: PermissionGroupModel = req.body.permission_group;
  if (_.isEmpty(paramObj)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'param is invalid', false);
  }
  Add_Update_Permission_Group(String(process.env.UPDATE), paramObj, (returnVal: ReturnModel<boolean>) => {
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
  Get_Permission_Groups(parseInt(query.flag, 10), parseInt(query.page, 10), parseInt(query.pageSize, 10),
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
  Get_Permission_Group_Permissions(parseInt(query.page, 10), parseInt(query.pageSize, 10), parseInt(query.permissionGroupId, 10),
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
  Get_Permission_Group_Donot_Have_Permissions(parseInt(query.permissionGroupId, 10), (returnVal: ReturnModel<PermissionModel[]>) => {
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
  Add_Permission_Group_Permissions(permissionGroupId, permissionIdArray, permissionIdArrayLength, operatorId,
    (returnVal: ReturnModel<boolean>) => {
      handleReturn(returnVal, res, next);
    });
});


export const PermissionRouter = router;
