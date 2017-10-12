import {Config} from 'knex';

const databaseName = 'studio';
const development: Config = {
  client: 'mysql',
  connection: {
    database: databaseName,
    port: 3306,
    user: 'root',
    password: 'WJL52wld',
    multipleStatements: true,
    host: 'localhost'
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
    password: 'WJL52wld',
    multipleStatements: true,
    host: 'localhost'
  },
  migrations: {
    directory: __dirname + '/src/server/db/migrations'
  }
};

const config = {
  'development': development,
  'test': test
};
export = config;
