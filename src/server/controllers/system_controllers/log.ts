import * as express from 'express';
import {m_operate_log, m_log_detail} from '../../../shared/index';
import * as _ from 'lodash';
import * as Knex from 'knex';

export function logOperate(knex: Knex, req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip;
  const accessToken = req.headers['x-access-token'] || req.body.token || req.query.token;
  const userAgent = req.headers['user-agent'];
  const contentType = req.headers['content-type'];
  const acceptEncoding = req.headers['accept-encoding'];
  const path = req.path;
  const method = req.method;
  const params = req.body;
  const query = req.query;
  const startTime = new Date().getTime();
  /* when res.end() is called, it will emit a "finish" event.*/
  res.on('finish', () => {
    const finishTime = new Date().getTime();
    const timeOfDuration = finishTime - startTime;
    const statusCode = res.statusCode;
    /*initial m_operate_log*/
    const operateLog = new m_operate_log();
    operateLog.ip = ip;
    operateLog.user_agent = userAgent;
    operateLog.accept_encoding = acceptEncoding;
    if (contentType) {
      operateLog.content_type = contentType;
    }
    if (res.locals.userId) {
      operateLog.user_id = parseInt(res.locals.userId, 10);
    }
    if (accessToken) {
      operateLog.access_token = accessToken;
    }
    if (!_.isEmpty(params)) {
      operateLog.params = JSON.stringify(params);
    }
    if (!_.isEmpty(query)) {
      operateLog.query = JSON.stringify(query);
    }
    operateLog.method = method;
    operateLog.route = path;
    operateLog.duration_time = timeOfDuration;
    operateLog.created_datetime = new Date();
    operateLog.creator_id = 1;
    /*initial m_log_detail*/
    const logDetail = new m_log_detail();
    logDetail.kind = parseInt(process.env.LOG_INFO, 10);
    logDetail.creator_id = 1;
    logDetail.created_datetime = new Date();
    logDetail.return_code = statusCode;
    logDetail.return_message = res.statusMessage;
    if (res.locals.err) {
      logDetail.error_message = JSON.stringify({message: res.locals.err.message, stack: res.locals.err.stack || ''});
    }
    knex.transaction((trx) => {
      knex('m_operate_log')
        .transacting(trx)
        .insert(operateLog)
        .then((ids) => {
          logDetail.operate_log_id = ids[0];
          return knex('m_log_detail').insert(logDetail).transacting(trx);
        })
        .then(trx.commit)
        .catch((e) => {
          trx.rollback();
          console.error(e);
        })
    }).catch((e) => {
      throw(e);
    });
  });
  next();
}
