const databaseName = 'studio';

module.exports = {
    development: {
        client: 'mysql',
        connection: {
            database: databaseName,
            port: 3306,
            user: 'root',
            password: 'Seacon123'
        },
        migrations: {
            directory: __dirname + '/src/server/db/migrations'
        },
        seeds: {
            directory: __dirname + '/src/server/db/seeds'
        }
    },
    test: {
        client: 'mysql',
        connection: {
            database: databaseName + '_test',
            port: 3306,
            user: 'root',
            password: 'Seacon123'
        },
        migrations: {
            directory: __dirname + '/src/server/db/migrations'
        },
        seeds: {
            directory: __dirname + '/src/server/db/seeds'
        }
    }
};