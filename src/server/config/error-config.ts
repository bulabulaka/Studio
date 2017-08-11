export function error_config_init(app: any) {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    let err = new Error('Not Found');
    res.locals.errorCode = 404;
    next(err);
  });

  // development error handler (will print stacktrace)
  if (app.get('env') === 'development') {
    app.use(function (err: Error, req, res, next) {
      res.status(res.locals.errorCode || 500).send({
        message: res.locals.errorMsg || err.message,
        error: err
      });
    });
  }

  // production error handler (no stacktraces leaked to user)
  app.use(function (err: Error, req, res, next) {
    res.status(res.locals.errorCode || 500).send({
      message: res.locals.errorMsg || err.message,
      error: {}
    });
  });
}

