"use strict";
exports.__esModule = true;
var bcrypt = require("bcryptjs");
var Promise = require("bluebird");
var connection_1 = require("../db/connection");
function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
}
exports.comparePass = comparePass;
function createUser(req, res) {
    return this.handleErrors(req)
        .then(function () {
        var salt = bcrypt.genSaltSync();
        var hash = bcrypt.hashSync(req.body.password, salt);
        return connection_1.knex('m_user')
            .insert({
            username: req.body.username,
            password: hash
        })
            .returning('*');
    })["catch"](function (err) {
        res.status(400).json({ status: err.message });
    });
}
exports.createUser = createUser;
function loginRequired(req, res, next) {
    if (!req.user)
        return res.status(401).json({ status: 'Please log in' });
    return next();
}
exports.loginRequired = loginRequired;
function adminRequired(req, res, next) {
    if (!req.user)
        res.status(401).json({ status: 'Please log in' });
    return connection_1.knex('m_user').where({ username: req.user.username }).first()
        .then(function (user) {
        if (user.status !== 1)
            res.status(401).json({ status: 'You are not authorized' });
        return next();
    })["catch"](function (err) {
        res.status(500).json({ status: 'Something bad happened' });
    });
}
exports.adminRequired = adminRequired;
function loginRedirect(req, res, next) {
    if (req.user)
        return res.status(401).json({ status: 'You are already logged in' });
    return next();
}
exports.loginRedirect = loginRedirect;
function handleErrors(req) {
    return new Promise(function (resolve, reject) {
        if (req.body.username.length < 6) {
            reject({
                message: 'Username must be longer than 6 characters'
            });
        }
        else if (req.body.password.length < 6) {
            reject({
                message: 'Password must be longer than 6 characters'
            });
        }
        else {
            resolve();
        }
    });
}
