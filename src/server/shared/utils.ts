import {ResultValue} from '../../shared/index';
import {ReturnModel} from './models/index';
import jwt = require('jsonwebtoken');
import * as bcrypt from 'bcryptjs';
import * as express from 'express';

export function handleResponse<T>(res: express.Response, resStatusCode: number, code: number, msg: string, data: T,
                                  totalCount?: number, token?: string): void {
  const resultData = new ResultValue<T>();
  resultData.RCode = code;
  resultData.RMsg = msg;
  resultData.Data = data;
  resultData.TotalCount = totalCount;
  resultData.Token = token;
  res.status(resStatusCode).json({resultValue: resultData});
}

export function handleReturn<T>(returnVal: ReturnModel<T>, res: express.Response, next: express.NextFunction): void {
  if (returnVal.RCode === parseInt(process.env.SUCCESS_CODE, 10)) {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.SUCCESS_CODE, 10), returnVal.RMsg,
      returnVal.Data, returnVal.totalCount, returnVal.token);
  } else if (returnVal.error) {
    if (returnVal.errorCode) {
      res.locals.errorCode = returnVal.errorCode;
    }
    return next(returnVal.error);
  } else {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10),
      returnVal.RMsg, returnVal.Data);
  }
}

export function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(err);
      }
      res.locals.userId = decoded;
      return next();
    })
  } else {
    return handleResponse(res, parseInt(process.env.HTTP_STATUS_OK, 10), parseInt(process.env.FAIL_CODE, 10), 'No token exists.', null);
  }
}

export function normalizePort(val: string): number {
  const port: number = parseInt(val, 10);
  if (isNaN(port)) {
    return -1;
  }
  if (port >= 0) {
    return port;
  }
  return -1;
}

export function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
