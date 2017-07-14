"use strict";
exports.__esModule = true;
var knexfile_1 = require("../../../knexfile");
var environment = process.env.NODE_ENV;
exports.knex = new knexfile_1.knexConfig(environment).knex;
