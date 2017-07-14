class Error {

  constructor(public status: number,
              public message: string,
              public name?: string,
              public stack?: string) {
    this.status = status;
    this.name = name;
    this.message = message;
    this.stack = stack;
  }
}

export function error_config_init(app: any) {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    let err = new Error(404, 'Not Found');
    next(err);
  });

  // development error handler (will print stacktrace)
  if (app.get('env') === 'development') {
    app.use(function (err: Error, req, res, next) {
      res.status(err.status || 500).send({
        message: err.message,
        error: err
      });
    });
  }

  // production error handler (no stacktraces leaked to user)
  app.use(function (err: Error, req, res, next) {
    res.status(err.status || 500).send({
      message: err.message,
      error: {}
    });
  });
}

