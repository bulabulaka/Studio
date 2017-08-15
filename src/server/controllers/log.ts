import * as express from 'express';
import {m_operate_log, m_log_detail} from '../../shared/index';
import * as _ from 'lodash';

export function LogOperate(knex: any, req: express.Request, res: express.Response, next: any) {
  let ip = req.ip;
  let accessToken = req.headers['x-access-token'] || req.body.token || req.query.token;
  let userAgent = req.headers['user-agent'];
  let contentType = req.headers['content-type'];
  let acceptEncoding = req.headers['accept-encoding'];
  let path = req.path;
  let method = req.method;
  let params = req.body;
  let query = req.query;
  let startTime = new Date().getTime();
  //when res.end() is called, it will emit a "finish" event.
  res.on('finish', () => {
    let finishTime = new Date().getTime();
    let timeOfDuration = finishTime - startTime;
    let statusCode = res.statusCode;
    //initial m_operate_log
    let operateLog = new m_operate_log();
    operateLog.ip = ip;
    operateLog.user_agent = userAgent;
    operateLog.accept_encoding = acceptEncoding;
    if (contentType) {
      operateLog.content_type = contentType;
    }
    if (res.locals.userId) {
      operateLog.user_id = parseInt(res.locals.userId);
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
    //initial m_log_detail
    let logDetail = new m_log_detail();
    logDetail.kind = parseInt(process.env.LOG_INFO);
    logDetail.creator_id = 1;
    logDetail.created_datetime = new Date();
    logDetail.return_code = statusCode;
    logDetail.return_message = res.statusMessage;
    if (res.locals.err) {
      logDetail.error_message = JSON.stringify(res.locals.err);
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
