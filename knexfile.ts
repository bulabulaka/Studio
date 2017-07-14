import * as Knex from "knex";
import {Config} from "knex";
const databaseName = 'studio';
const development: Config = {
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
const test: Config = {
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

export class knexConfig {
  knex_Config: Config;
  knex: Knex;
  private seed: any;

  constructor(environment: string) {
    if (environment === "development") {
      this.knex_Config = development;
      this.seed = {
        directory: __dirname + '/src/server/db/seeds'
      };
    } else {
      this.knex_Config = test;
      this.seed = {
        directory: __dirname + '/src/server/db/seeds'
      };
    }
    this.knex = Knex(this.knex_Config);
    this.knex.seed.make("users.ts",this.seed);
  }
}


