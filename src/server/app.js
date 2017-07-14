"use strict";
exports.__esModule = true;
// *** dependencies *** //
var express = require("express");
var main_config_1 = require("./config/main-config");
var route_config_1 = require("./config/route-config");
var error_config_1 = require("./config/error-config");
function init_config() {
    // *** express instance *** //
    var app = express();
    // *** config *** //
    main_config_1.main_config_init(app, express);
    route_config_1.route_config_init(app);
    error_config_1.error_config_init(app);
    return app;
}
exports.init_config = init_config;
