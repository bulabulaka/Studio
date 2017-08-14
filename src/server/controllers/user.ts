import * as bcrypt from 'bcryptjs';
import * as Promise from 'bluebird';
import * as express from 'express';
import {knex} from '../db/connection';
import {handleResponse} from '../shared/index';

export function createUser(req: express.Request, res: express.Response, next: any) {
  handleErrors(req)
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.password, salt);
      knex('m_user')
        .insert({
          username: req.body.username,
          password: hash,
          auditstat: 0,
          creator_id: 1,
          created_datetime: knex.raw('now()')
        })
        .then((ids) => {
          handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.SUCCESS_CODE), 'Regist Success', ids[0]);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      res.locals.errorCode = 400;
      next(err);
    });
}

function handleErrors(req: express.Request) {
  return new Promise((resolve, reject) => {
    if (req.body.username.length < 6) {
      reject({
        message: 'Username must be longer than 6 characters'
      });
    }
    else if (req.body.password.length < 6) {
      reject({
        message: 'Password must be longer than 6 characters'
      });
    } else {
      resolve();
    }
  });
}
