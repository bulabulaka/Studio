import * as express from 'express';
import * as _ from 'lodash';
import {handleResponse, verifyToken, ReturnModel} from '../shared/index';
import {knex} from '../db/connection';
import {m_permission, m_service_api, m_page, permissionModel} from '../../shared/index';
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

//get all permissions
router.get('/get_permissions', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  let query = req.query;
  if (_.isEmpty(query) || !query.page || !query.pageSize || parseInt(query.page) < 1 || parseInt(query.pageSize) < 1) {
    res.locals.errorCode = 400;
    return next('query is invalid');
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

//add permission
router.post('/add_permission', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  let paramObj = req.body.permission;
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

//update permission
router.put('/update_permission', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  let paramObj = req.body.permission;
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

/*router.delete('/delete_permission', verifyToken, (req:, res: express.Response, next: any) => {

});*/


router.post('/add_permission_group', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Permission_Group('insert', req.body.permission_group, (error, permissionGroup) => {
    if (error) return next(error);
    knex('m_permission_group').returning('id').insert(permissionGroup)
      .then((ids) => {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', true);
      })
      .catch((e) => {
        return next(e);
      })
  });
});

router.put('/update_permission_group', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Permission_Group('update', req.body.permission_group, (error, permissionGroup) => {
    if (error) return next(error);
    knex('m_permission_group').where('id', '=', permissionGroup.id).update(permissionGroup)
      .then(() => {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', null);
      })
      .catch((e) => {
        next(e);
      })
  });
});

//获取所有的权限组 分页
router.get('/get_permission_groups', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Get_Permission_Groups(req, res, next);
});

//查询权限组所拥有的权限 分页
router.get('/get_permission_group_permissions', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Get_Permission_Group_Permissions(req, res, next);
});

//查询权限组未拥有的权限
router.get('/get_permission_group_donot_have_permissions', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Get_Permission_Group_Donot_Have_Permissions(req, res, next);
});

//给权限组添加权限
router.post('/add_permission_group_permissions', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Add_Permission_Group_Permissions(req, res, next);
});


export const PermissionRouter = router;
