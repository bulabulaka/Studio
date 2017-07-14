"use strict";
exports.__esModule = true;
var Error = (function () {
    function Error(status, message, name, stack) {
        this.status = status;
        this.message = message;
        this.name = name;
        this.stack = stack;
        this.status = status;
        this.name = name;
        this.message = message;
        this.stack = stack;
    }
    return Error;
}());
function error_config_init(app) {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error(404, 'Not Found');
        next(err);
    });
    // development error handler (will print stacktrace)
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500).send({
                message: err.message,
                error: err
            });
        });
    }
    // production error handler (no stacktraces leaked to user)
    app.use(function (err, req, res, next) {
        res.status(err.status || 500).send({
            message: err.message,
            error: {}
        });
    });
}
exports.error_config_init = error_config_init;
