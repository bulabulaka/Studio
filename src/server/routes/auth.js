"use strict";
exports.__esModule = true;
var express_1 = require("express");
var Promise = require("bluebird");
var router = express_1.Router();
var _helpers_1 = require("../auth/_helpers");
var local_1 = require("../auth/local");
router.post('/register', _helpers_1.loginRedirect, function (req, res, next) {
    return _helpers_1.createUser(req, res)
        .then(function (response) {
        local_1.local.authenticate('local', function (err, user, info) {
            if (user) {
                handleResponse(res, 200, 'success');
            }
        })(req, res, next);
    })["catch"](function (err) {
        handleResponse(res, 500, 'error');
    });
});
router.post('/login', _helpers_1.loginRedirect, function (req, res, next) {
    local_1.local.authenticate('local', function (err, user, info) {
        if (err) {
            handleResponse(res, 500, 'error');
        }
        if (!user) {
            handleResponse(res, 404, 'User not found');
        }
        if (user) {
            handleResponse(res, 200, 'success');
        }
    })(req, res, next);
});
router.get('/logout', _helpers_1.loginRequired, function (req, res, next) {
    req.logout();
    handleResponse(res, 200, 'success');
});
// *** helpers *** //
function handleLogin(req, user) {
    return new Promise(function (resolve, reject) {
        req.login(user, function (err) {
            if (err)
                reject(err);
            resolve();
        });
    });
}
function handleResponse(res, code, statusMsg) {
    res.status(code).json({ status: statusMsg });
}
exports.AuthRouter = router;
module.exports = router;
