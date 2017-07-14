"use strict";
exports.__esModule = true;
// *** main dependencies *** //
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var flash = require("connect-flash");
var morgan = require("morgan");
var nunjucks = require("nunjucks");
var passport = require("passport");
var dotenv = require("dotenv");
// *** load environment variables *** //
dotenv.config();
function main_config_init(app, express) {
    // *** view folders *** //
    var viewFolders = [path.join(__dirname, '..', 'views')];
    // *** view engine *** //
    nunjucks.configure(viewFolders, {
        express: app,
        autoescape: true
    });
    app.set('view engine', 'html');
    // *** app middleware *** //
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    }
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // uncomment if using express-session
    app.use(session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(express.static(path.join(__dirname, '..', '..', 'client')));
}
exports.main_config_init = main_config_init;
