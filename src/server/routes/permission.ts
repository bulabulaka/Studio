import {Router} from 'express';
import {handleResponse, verifyToken} from '../shared/index';
import {knex} from '../db/connection';
import {m_permission, m_service_api, m_page, permission} from '../../shared/index';
import {VerifyPermissionData} from '../controllers/permission';

const router = Router();

router.post('/add_permission', verifyToken, (req, res, next) => {
  VerifyPermissionData(req.body.permission, (error, mPermission?, mServiceApi?, mPage?) => {
    if (error) return next(error);
    knex.transaction((trx) => {
      return knex('m_permission')
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


export const PermissionRouter = router;
