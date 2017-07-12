"use strict";
var passport = require("passport");
var knex = require("../db/connection");
module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        knex('m_user').where({ id: id }).first()
            .then(function (user) { done(null, user); })["catch"](function (err) { done(err, null); });
    });
};
