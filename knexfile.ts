import * as Knex from "knex";
import {Config} from "knex";

const databaseName = 'studio';
const development: Config = {
  client: 'mysql',
  connection: {
    database: databaseName,
    port: 3306,
    user: 'root',
    password: 'Studio9527'
  },
  migrations: {
    directory: __dirname + '/src/server/db/migrations'
  }
};
const test: Config = {
  client: 'mysql',
  connection: {
    database: databaseName + '_test',
    port: 3306,
    user: 'root',
    password: 'Studio9527'
  },
  migrations: {
    directory: __dirname + '/src/server/db/migrations'
  }
};

const config = {
  'development':development,
  'test':test
};
export = config;

// export class knexConfig {
//   knex_Config: Config;
//   knex: Knex;

//   constructor(environment: string) {
//     if (environment === "development") {
//       this.knex_Config = development;
//     } else {
//       this.knex_Config = test;
//     }
//     this.knex = Knex(this.knex_Config);
//   }
// }


