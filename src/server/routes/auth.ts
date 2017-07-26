import {Router} from "express";
import * as Promise from "bluebird";

const router = Router();
import {createUser, loginRequired, loginRedirect} from "../auth/_helpers";
import {local} from "../auth/local";

router.post('/register', loginRedirect, (req, res, next) => {
  return createUser(req, res)
    .then((response) => {
      local.authenticate('local', (err, user, info) => {
        if (user) {
          handleResponse(res, 200, 'success');
        }
      })(req, res, next);
    })
    .catch((err) => {
      handleResponse(res, 500, 'error');
    });
});

router.post('/login', loginRedirect, (req, res, next) => {
  local.authenticate('local', (err, user, info) => {
    if (err) {
      handleResponse(res, 500, 'error');
    }
    if (!user) {
      handleResponse(res, 404, 'User not found');
    }
    if (user) {
      handleResponse(res, 200, 'success');
    }
  })(req, res, next);
});

router.get('/logout', loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, 'success');
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

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

export const AuthRouter = router;
