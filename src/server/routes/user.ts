import {Router} from 'express';
import {handleResponse, verifyToken} from '../shared/index'
import {knex} from '../db/connection';

const router = Router();

router.get('/user', verifyToken, (req, res, next) => {
  knex('m_user').where('id', res.locals.userId).first()
    .then((user) => {
      if (!user) return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'User not found', null);
      return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', user);
    })
    .catch((err) => {
      return next(err);
    });
});

export const UserRouter = router;
