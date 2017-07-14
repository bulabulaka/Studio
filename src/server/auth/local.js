"use strict";
exports.__esModule = true;
var passport = require("passport");
var LocalStrategy = require("passport-local");
var _helpers_1 = require("./_helpers");
var connection_1 = require("../db/connection");
var passports_1 = require("./passports");
var options = {};
passports_1.passport_init();
passport.use(new LocalStrategy.Strategy(options, function (username, password, done) {
    // check to see if the username exists
    connection_1.knex('m_user').where({ username: username }).first()
        .then(function (user) {
        if (!user)
            return done(null, false);
        if (!_helpers_1.comparePass(password, user.password)) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
    })["catch"](function (err) {
        return done(err);
    });
}));
exports.local = passport;
