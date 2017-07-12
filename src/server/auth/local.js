"use strict";
var passport = require("passport");
var LocalStrategy = require("passport-local");
var init = require("./passport");
var knex = require("../db/connection");
var authHelpers = require("./_helpers");
var options = {};
//var doneR:(error: any, user?: any, options?: IVerifyOptions) = null;
init();
passport.use(new LocalStrategy.Strategy(options, function (username, password, done) {
    // check to see if the username exists
    knex('m_user').where({ username: username }).first()
        .then(function (user) {
        if (!user)
            return done(null, false);
        if (!authHelpers.comparePass(password, user.password)) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
    })["catch"](function (err) { return done(err); });
}));
module.exports = passport;
