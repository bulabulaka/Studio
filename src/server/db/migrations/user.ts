exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('m_user', (table) => {
      table.increments('id').unique();
      table.string('username', 50).notNullable();
      table.string('password', 100).notNullable();
      table.tinyint('auditstat').notNullable();
      table.dateTime('expiry_date').notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_role', (table) => {
      table.increments('id').unique();
      table.tinyint('auditstat').notNullable();
      table.string('name', 50).notNullable();
      table.string('description', 200).notNullable();
      table.tinyint('order_no').notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_user_role', (table) => {
      table.increments('id').unique();
      table.integer('user_id').notNullable().unsigned().references('id').inTable('m_user');
      table.integer('role_id').notNullable().unsigned().references('id').inTable('m_role');
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
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

