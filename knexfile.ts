import {Config} from 'knex';

/*const databaseName = 'studio';*/
const databaseName = 'wjl_studio';
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
  },
  seeds: {
    directory: __dirname + '/src/server/db/seed/seeds'
  }
};
const test: Config = {
  client: 'mysql',
  connection: {
    /*database: databaseName + '_test',*/
    database: 'studio_test',
    port: 3306,
    user: 'root',
    password: 'WJL52wld',
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
