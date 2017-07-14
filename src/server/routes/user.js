"use strict";
exports.__esModule = true;
var express_1 = require("express");
var router = express_1.Router();
var _helpers_1 = require("../auth/_helpers");
router.get('/user', _helpers_1.loginRequired, function (req, res, next) {
    handleResponse(res, 200, 'success');
});
router.get('/admin', _helpers_1.adminRequired, function (req, res, next) {
    handleResponse(res, 200, 'success');
});
function handleResponse(res, code, statusMsg) {
    res.status(code).json({ status: statusMsg });
}
exports.UserRouter = router;
module.exports = router;
