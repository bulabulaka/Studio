import {Router} from 'express';
import * as Promise from 'bluebird';
import {createUser, loginRequired, loginRedirect} from '../auth/_helpers';
import {local} from '../auth/local';
import {m_user} from '../../shared/models/index';
import {handleResponse} from '../shared/index';

const router = Router();

router.post('/register', loginRedirect, (req, res, next) => {
  return createUser(req, res)
    .then((response) => {
      local.authenticate('local', (err, user, info) => {
        if (user) {
          handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'success', user);
        }
      })(req, res, next);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/login', loginRedirect, (req, res, next) => {
  local.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'User not found', null);
    }
    if (user) {
      req.logIn(user, (err) => {
        if (err) next(err);
        handleResponse<m_user>(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'success', user);
      });
    }
  })(req, res, next);
});

router.get('/logout', loginRequired, (req, res, next) => {
  req.logout();
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
