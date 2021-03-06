import * as express from 'express';
import * as NodeCache from 'node-cache';

export function errorConfigInit(app: express.Application, nodeCache: NodeCache) {
  /*catch 404 and forward to error handler*/
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    res.locals.errorCode = 404;
    next(err);
  });

  /* development error handler (will print stacktrace)*/
  if (app.get('env') === 'development') {
    app.use(function (err: Error, req, res, next) {
      res.locals.err = err;
      res.status(res.locals.errorCode || 500).send({
        message: err.message,
        error: err
      });
    });
  }

  /*production error handler (no stacktrace leaked to user)*/
  app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.locals.err = err;
    res.status(res.locals.errorCode || 500).send({
      message: err.message,
      error: {}
    });
  });
}

