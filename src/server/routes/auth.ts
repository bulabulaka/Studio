import {Router} from 'express';
import {m_user} from '../../shared/models/index';
import {handleResponse, verifyToken, comparePass} from '../shared/index';
import jwt = require('jsonwebtoken');
import {knex} from '../db/connection';
import {createUser} from '../controllers/business_controllers/user';
import * as express from 'express';

const router = Router();

router.post('/register', (req: express.Request, res: express.Response, next: any) => {
  createUser(req, res, next);
});

router.post('/login', (req, res, next) => {
  const reqUser = req.body;
  knex('m_user').where('username', reqUser.username).first()
    .then((user) => {
      if (!user) return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'User not found', null);
      if (!comparePass(reqUser.password, user.password)) {
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'User not found', null);
      } else {
        let token = jwt.sign(user.id, process.env.JWT_SECRET);
        return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'OK', user, 0, token);
      }
    })
    .catch((err) => {
      return next(err);
    });
});

router.get('/logout', verifyToken, (req, res, next) => {
  handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'success', null);
});

export const AuthRouter = router;
