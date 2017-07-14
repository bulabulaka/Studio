"use strict";
exports.__esModule = true;
// *** routes *** //
var routes = require("../routes/index");
var authRoutes = require("../routes/auth");
var userRoutes = require("../routes/user");
function route_config_init(app) {
    // *** register routes *** //
    app.use('/', routes);
    app.use('/auth', authRoutes);
    app.use('/', userRoutes);
}
exports.route_config_init = route_config_init;
