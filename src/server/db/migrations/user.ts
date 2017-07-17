exports.up = (knex, Promise) => {
  return Promise.all([
 knex.schema.createTable('m_user', (table) => {
    table.increments();
    table.string('username',50).notNullable().defaultTo('');
    table.string('password',200).notNullable().defaultTo('');
    table.string('salt',200).notNullable().defaultTo('');
    table.tinyint('status').notNullable().defaultTo(0);

    table.integer('user_id_creator').unsigned().defaultTo(null).references('id').inTable('m_user');
    table.integer('user_id_modifier').unsigned().defaultTo(null).references('id').inTable('m_user');
    table.timestamp('created_datetime').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('modified_datetime').notNullable().defaultTo(knex.raw('now()'));
    table.tinyint('auditstat').notNullable().defaultTo(1);
  }),
  knex.schema.createTable('m_role', (table) => {
    table.increments();
    table.string('name',50).notNullable().defaultTo('');
    table.string('descrp',200).notNullable().defaultTo('');

    table.integer('user_id_creator').unsigned().notNullable().references('id').inTable('m_user');
    table.integer('user_id_modifier').unsigned().notNullable().references('id').inTable('m_user');
    table.timestamp('created_datetime').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('modified_datetime').notNullable().defaultTo(knex.raw('now()'));
    table.tinyint('auditstat').notNullable().defaultTo(1);
  }),
  knex.schema.createTable('m_user_role', (table) => {
    table.increments();
    table.integer('user_id',50).unsigned().notNullable().references('id').inTable('m_user');
    table.integer('role_id',200).unsigned().notNullable().references('id').inTable('m_role');

    table.integer('user_id_creator').unsigned().notNullable().references('id').inTable('m_user');
    table.integer('user_id_modifier').unsigned().notNullable().references('id').inTable('m_user');
    table.timestamp('created_datetime').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('modified_datetime').notNullable().defaultTo(knex.raw('now()'));
    table.tinyint('auditstat').notNullable().defaultTo(1);
  })
  ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('m_user_role'),
        knex.schema.dropTable('m_role'),
        knex.schema.dropTable('m_user')
    ]);
  };

