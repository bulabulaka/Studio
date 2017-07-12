const environment = process.env.NODE_ENV;
const config = require('../../../knexfile.js')[environment];

export = require('knex')(config);
