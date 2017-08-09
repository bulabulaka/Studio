import {Router} from 'express';
import {handleResponse, verifyToken} from '../shared/index';
import {knex} from '../db/connection';
import {BaseEntityContainer} from '../db/entity/entityContainer';
import {m_permission} from '../../shared/index';

const router = Router();

router.post('/add_permission', verifyToken, (req, res, next) => {
  const reqBody = req.body;
  let baseEntityContainer = new BaseEntityContainer('m_permission');
  baseEntityContainer.insert(reqBody.permission)
    .then((response) => {
      if (response[0]) {
        //used for debugger
        /* knex('m_permission').first().then((response) => {
           console.log(response);
         });*/
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', response[0]);
      } else {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'Insert Fail', null);
      }
    });
});

export const PermissionRouter = router;
