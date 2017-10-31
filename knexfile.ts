import {Config} from 'knex';

/*const databaseName = 'studio';*/
const databaseName = 'Studio';
const development: Config = {
  client: 'mysql',
  connection: {
    database: databaseName,
    port: 3306,
    user: 'root',
    password: 'Studio9527',
    multipleStatements: true,
    host: 'localhost'
  },
  migrations: {
    directory: __dirname + '/src/server/db/migrations'
  },
  seeds: {
    directory: __dirname + '/src/server/db/seed/seeds'
  }
};
const test: Config = {
  client: 'mysql',
  connection: {
    database: databaseName + '_test',
    port: 3306,
    user: 'root',
    password: 'Studio9527',
    multipleStatements: true,
    host: 'localhost'
  },
  migrations: {
    directory: __dirname + '/src/server/db/migrations'
  },
  seeds: {
    directory: __dirname + '/src/server/db/seed/seeds_test/seeds'
  }
};

const config = {
  'development': development,
  'test': test
};
export = config;
