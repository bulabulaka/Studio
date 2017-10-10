import * as express from 'express';
import {handleResponse} from '../shared/index';
import {knex} from '../db/connection';
import {m_role} from '../../shared/index';
import {
  Get_Roles,
  Add_Update_Role,
  Get_Role_Permission_Groups,
  Get_Role_Donot_Have_Permission_Groups,
  Add_Role_Permission_Groups
} from '../controllers/system_controllers/role';

const router = express.Router();

//获取所有角色 分页
router.get('/get_roles', (req: express.Request, res: express.Response, next: any) => {
  Get_Roles(req, res, next);
});

//添加角色
router.post('/add_role',  (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Role('insert', req.body.role, (error, mRole?: m_role) => {
    if (error) return next(error);
    knex('m_role').returning('id').insert(mRole)
      .then((ids) => {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', true);
      })
      .catch((e) => {
        return next(e);
      })
  });
});

//修改角色
router.put('/update_role',  (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Role('update', req.body.role, (error, mRole?: m_role) => {
    if (error) return next(error);
    knex('m_role').where('id', '=', mRole.id).update(mRole)
      .then(() => {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', true);
      })
      .catch((e) => {
        next(e);
      })
  });
});

//查寻角色拥有的权限组 分页
router.get('/get_role_permission_groups', (req: express.Request, res: express.Response, next: any) => {
  Get_Role_Permission_Groups(req, res, next);
});

//查询角色未拥有的权限组 前端分页
router.get('/get_role_donot_have_permission_groups', (req: express.Request, res: express.Response, next: any) => {
  Get_Role_Donot_Have_Permission_Groups(req, res, next);
});

//给角色添加权限组
router.post('/add_role_permission_groups', (req: express.Request, res: express.Response, next: any) => {
  Add_Role_Permission_Groups(req, res, next);
});

export const RoleRouter = router;
