import {ResultValue} from '../../shared/index';
import jwt = require('jsonwebtoken');
import * as bcrypt from 'bcryptjs';

export function handleResponse<T>(res, resStatusCode: number, code: number, msg: string, data: T, totalCount?: number, token?: string) {
  let resultData = new ResultValue<T>();
  resultData.RCode = code;
  resultData.RMsg = msg;
  resultData.Data = data;
  resultData.TotalCount = totalCount;
  resultData.Token = token;
  res.status(resStatusCode).json({resultValue: resultData});
}

export function verifyToken(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(err);
      res.locals.userId = decoded;
      next();
    })
  } else {
    handleResponse(res, parseInt(process.env.HTTP_STATUS_OK), parseInt(process.env.FAIL_CODE), 'No token exists.', null);
  }
}

export function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
