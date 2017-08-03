import {Router} from 'express';
import * as Promise from 'bluebird';
import {createUser} from '../auth/_helpers';
import {m_user} from '../../shared/models/index';
import {handleResponse, verifyToken} from '../shared/index';
import jwt = require('jsonwebtoken');
import {knex} from '../db/connection';
import {comparePass} from '../auth/_helpers';

const router = Router();

router.post('/register', (req, res, next) => {
  return createUser(req, res)
    .then((response) => {
      handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'Regist Success', null);
    })
    .catch((err) => {
      next(err);
    });
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

// *** helpers *** //

function handleLogin(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export const AuthRouter = router;
