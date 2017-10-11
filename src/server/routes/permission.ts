import * as express from 'express';
import * as _ from 'lodash';
import {handleResponse, ReturnModel} from '../shared/index';
import {permissionModel} from '../../shared/index';
import {
  Get_Permissions,
  Add_Update_Permission,
  Add_Update_Permission_Group,
  Get_Permission_Groups,
  Get_Permission_Group_Permissions,
  Get_Permission_Group_Donot_Have_Permissions,
  Add_Permission_Group_Permissions
} from '../controllers/system_controllers/permission';
import {permissionGroupModel} from '../../shared/models/view_models/permission-group.model';


const router = express.Router();

/*get all permissions*/
router.get('/get_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Permissions(parseInt(query.page),parseInt(query.pageSize),(returnVal:ReturnModel<permissionModel[]>,totalCount:number) =>{
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data,totalCount);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, null);
    }
  });
});

/*add permission*/
router.post('/add_permission', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let paramObj:permissionModel = req.body.permission;
  if(_.isEmpty(paramObj)){
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',false);
  }
  Add_Update_Permission(String(process.env.INSERT), paramObj, (returnVal:ReturnModel<boolean>) => {
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, false);
    }
  });
});

/*update permission*/
router.put('/update_permission', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let paramObj:permissionModel = req.body.permission;
  if(_.isEmpty(paramObj)){
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',false);
  }
  Add_Update_Permission(String(process.env.UPDATE), paramObj, (returnVal:ReturnModel<boolean>) => {
     if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
       return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
     }else if(returnVal.error){
       if(returnVal.errorCode){
         res.locals.errorCode = returnVal.errorCode;
       }
       return next(returnVal.error);
     }else{
       return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, false);
     }
  });
});

/*add permission group*/
router.post('/add_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let paramObj:permissionGroupModel = req.body.permission_group;
  if(_.isEmpty(paramObj)){
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',false);
  }
  Add_Update_Permission_Group(String(process.env.INSERT), paramObj, (returnVal:ReturnModel<boolean>) => {
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, false);
    }
  });
});

/*update permission group*/
router.put('/update_permission_group', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let paramObj:permissionGroupModel = req.body.permission_group;
  if(_.isEmpty(paramObj)){
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',false);
  }
  Add_Update_Permission_Group(String(process.env.UPDATE), paramObj, (returnVal:ReturnModel<boolean>) => {
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, false);
    }
  });
});

/*get all permission groups paging*/
router.get('/get_permission_groups',  (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Permission_Groups(parseInt(query.page),parseInt(query.pageSize),(returnVal:ReturnModel<permissionGroupModel[]>,totalCount:number) =>{
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data,totalCount);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, null);
    }
  });
});

/*query the permissions that this permission group has paging*/
router.get('/get_permission_group_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.permissionGroupId || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Permission_Group_Permissions(parseInt(query.page), parseInt(query.pageSize), parseInt(query.permissionGroupId),
    (returnVal:ReturnModel<permissionModel[]>,totalCount:number) =>{
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data,totalCount);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, null);
    }
  });
});

/*query the permissions that this permission group does not have client paging*/
router.get('/get_permission_group_donot_have_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.permissionGroupId) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Get_Permission_Group_Donot_Have_Permissions(parseInt(query.permissionGroupId),(returnVal:ReturnModel<permissionModel[]>)=>{
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, null);
    }
  });
});


/*add permissions to the permission group  batch add*/
router.post('/add_permission_group_permissions', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let permissionIdArray = req.body.permissionIdArray;
  let permissionGroupId = req.body.permissionGroupId;
  let permissionIdArrayLength = req.body.permissionIdArrayLength;
  let operatorId = req.body.operatorId;
  if (!permissionIdArray || !permissionGroupId || !permissionIdArrayLength || !operatorId) {
    return handleResponse(res,parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE),'param is invalid',null);
  }
  Add_Permission_Group_Permissions(permissionGroupId,permissionIdArray,permissionIdArrayLength,operatorId,(returnVal:ReturnModel<boolean>) =>{
    if(returnVal.RCode === parseInt(process.env.SUCCESS_CODE)){
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), returnVal.RMsg, returnVal.Data);
    }else if(returnVal.error){
      if(returnVal.errorCode){
        res.locals.errorCode = returnVal.errorCode;
      }
      return next(returnVal.error);
    }else{
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), returnVal.RMsg, false);
    }
  });
});


export const PermissionRouter = router;
