import {Router} from 'express';
import {handleResponse, verifyToken} from '../shared/index';
import {knex} from '../db/connection';
import {m_permission, m_service_api, m_page, permission} from '../../shared/index';
import {Get_Permissions, Add_Update_Permission, Add_Update_Permission_Group} from '../controllers/system_controllers/permission';
import * as express from 'express';

const router = Router();

//get all permissions
router.get('/get_permissions', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Get_Permissions(req, res, next);
});

router.post('/add_permission', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Permission('insert', req.body.permission, (error, mPermission?: m_permission, mServiceApi?: m_service_api, mPage?: m_page) => {
    if (error) return next(error);
    knex.transaction((trx) => {
      knex('m_permission')
        .transacting(trx)
        .insert(mPermission)
        .then((ids) => {
          if (mServiceApi) {
            mServiceApi.permission_id = ids[0];
            return knex('m_service_api').insert(mServiceApi).transacting(trx);
          }
          mPage.permission_id = ids[0];
          return knex('m_page').insert(mPage).transacting(trx);
        })
        .then(trx.commit)
        .catch((e) => {
          trx.rollback();
          return next(e);
        })
    }).then(() => {
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', null);
    }).catch((e) => {
      return next(e)
    });
  });
});

router.put('/update_permission', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Permission('update', req.body.permission, (error, mPermission?: m_permission, mServiceApi?: m_service_api, mPage?: m_page) => {
    if (error) return next(error);
    knex.transaction((trx) => {
      knex('m_permission')
        .transacting(trx)
        .where('id', '=', mPermission.id)
        .update(mPermission)
        .then(() => {
          if (mServiceApi) {
            return knex('m_service_api').where('permission_id', '=', mServiceApi.permission_id).update(mServiceApi).transacting(trx);
          }
          return knex('m_page').where('permission_id', '=', mPage.permission_id).update(mPage).transacting(trx);
        })
        .then(trx.commit)
        .catch((e) => {
          trx.rollback();
          return next(e);
        })
    }).then(() => {
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', null);
    }).catch((e) => {
      return next(e);
    });
  });
});

/*router.delete('/delete_permission', verifyToken, (req:, res: express.Response, next: any) => {

});*/


router.post('/add_permission_group', verifyToken, (req: express.Request, res: express.Response, next: any) => {
  Add_Update_Permission_Group('insert', req.body.permission_group, (error, permissionGroup) => {
    if (error) return next(error);
    knex('m_permission_group').returning('id').insert(permissionGroup)
      .then((ids) => {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', ids[0]);
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


export const PermissionRouter = router;
