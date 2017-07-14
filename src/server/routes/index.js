"use strict";
exports.__esModule = true;
var express_1 = require("express");
var router = express_1.Router();
var index_1 = require("../controllers/index");
router.get('/', function (req, res, next) {
    var renderObject = {
        title: "Welcome to Express!",
        sum: 0
    };
    index_1.sum(1, 2, function (error, results) {
        if (error)
            return next(error);
        if (results) {
            renderObject.sum = results;
            res.render('index', renderObject);
        }
    });
});
exports.IndexRouter = router;
module.exports = router;
