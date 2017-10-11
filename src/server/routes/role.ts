import * as express from 'express';
import {handleResponse,ReturnModel,handleReturn} from '../shared/index';
import * as _ from 'lodash';
import {roleModel} from '../../shared/index';
import {
  Get_Roles,
  Add_Update_Role,
  Get_Role_Permission_Groups,
  Get_Role_Donot_Have_Permission_Groups,
  Add_Role_Permission_Groups
} from '../controllers/system_controllers/role';
import {permissionGroupModel} from '../../shared/models/view_models/permission-group.model';

const router = express.Router();

/*get all the roles paging*/
router.get('/get_roles', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Roles(parseInt(query.page), parseInt(query.pageSize), (returnVal:ReturnModel<roleModel[]>) =>{
    handleReturn(returnVal,res,next);
  });
});

/*add role*/
router.post('/add_role',  (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let paramObj:roleModel = req.body.role;
  if(_.isEmpty(paramObj)){
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',false);
  }
  Add_Update_Role(String(process.env.INSERT), paramObj, (returnVal:ReturnModel<boolean>)  => {
    handleReturn(returnVal,res,next);
  });
});

/*update role*/
router.put('/update_role',  (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let paramObj:roleModel = req.body.role;
  if(_.isEmpty(paramObj)){
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',false);
  }
  Add_Update_Role(String(process.env.UPDATE), paramObj, (returnVal:ReturnModel<boolean>) => {
    handleReturn(returnVal,res,next);
  });
});

/*query the permission group that this role has paging*/
router.get('/get_role_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.roleId || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Role_Permission_Groups(parseInt(query.page), parseInt(query.pageSize), parseInt(query.roleId), (returnVal:ReturnModel<permissionGroupModel[]>) =>{
    handleReturn(returnVal,res,next);
  });
});

/*query the permission group that this role does not have  client paging*/
router.get('/get_role_donot_have_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.roleId) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Role_Donot_Have_Permission_Groups(parseInt(query.roleId), (returnVal:ReturnModel<permissionGroupModel[]>)=>{
    handleReturn(returnVal,res,next);
  });
});

/*add permission group to the role  batch add*/
router.post('/add_role_permission_groups', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let permissionGroupIdArray = req.body.permissionGroupIdArray;
  let roleId = req.body.roleId;
  let permissionGroupIdArrayLength = req.body.permissionGroupIdArrayLength;
  let operatorId = req.body.operatorId;
  if (!permissionGroupIdArray || !roleId || !permissionGroupIdArrayLength || !operatorId) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Add_Role_Permission_Groups(permissionGroupIdArray,roleId,permissionGroupIdArrayLength,operatorId,(returnVal:ReturnModel<boolean>) => {
    handleReturn(returnVal,res,next);
  });
});

export const RoleRouter = router;
