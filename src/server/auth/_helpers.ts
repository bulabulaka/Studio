import * as bcrypt from "bcryptjs";
import * as Promise from "bluebird";
import {knex} from "../db/connection";

export function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

export function createUser(req, res) {
  return handleErrors(req)
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.password, salt);
      return knex('m_user')
        .insert({
          username: req.body.username,
          password: hash,
          auditstat: 0,
          creator_id: 1,
          created_datetime: knex.raw('now()')
        })
        .returning('*');
    })
    .catch((err) => {
      res.status(400).json({status: err.message});
    });
}

export function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({status: 'Please log in'});
  return next();
}

export function adminRequired(req, res, next) {
  if (!req.user) res.status(401).json({status: 'Please log in'});
  return knex('m_user').where({username: req.user.username}).first()
    .then((user) => {
      if (user.status !== 1) res.status(401).json({status: 'You are not authorized'});
      return next();
    })
    .catch((err) => {
      res.status(500).json({status: 'Something bad happened'});
    });
}

export function loginRedirect(req, res, next) {
  if (req.user) return res.status(401).json(
    {status: 'You are already logged in'});
  return next();
}

function handleErrors(req) {
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




