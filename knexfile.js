"use strict";
exports.__esModule = true;
var Knex = require("knex");
var databaseName = 'studio';
var development = {
    client: 'mysql',
    connection: {
        database: databaseName,
        port: 3306,
        user: 'root',
        password: 'WJL52wld'
    },
    migrations: {
        directory: __dirname + '/src/server/db/migrations'
    }
};
var test = {
    client: 'mysql',
    connection: {
        database: databaseName + '_test',
        port: 3306,
        user: 'root',
        password: 'WJL52wld'
    },
    migrations: {
        directory: __dirname + '/src/server/db/migrations'
    }
};
var knexConfig = (function () {
    function knexConfig(environment) {
        if (environment === "development") {
            this.knex_Config = development;
            this.seed = {
                directory: __dirname + '/src/server/db/seeds'
            };
        }
        else {
            this.knex_Config = test;
            this.seed = {
                directory: __dirname + '/src/server/db/seeds'
            };
        }
        this.knex = Knex(this.knex_Config);
        this.knex.seed.make("users.ts", this.seed);
    }
    return knexConfig;
}());
exports.knexConfig = knexConfig;
