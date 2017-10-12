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
  },
  seeds: {
    directory: __dirname + '/src/server/db/seeds'
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
  },
  seeds: {
    directory: __dirname + '/src/server/db/seeds'
  }
};

const config = {
  'development': development,
  'test': test
};
export = config;



