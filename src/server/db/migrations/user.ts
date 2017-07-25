exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('m_user', (table) => {
      table.increments();
      table.integer('id').notNullable().primary().autoIncrement();
      table.string('username', 50).notNullable();
      table.string('password', 100).notNullable();
      table.tinyint('auditstat').notNullable();
      table.timestamp('expiry_date').notNullable();
      table.integer('creator_id').notNullable();
      table.timestamp('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.timestamp('modified_datetime');
    }),
    knex.schema.createTable('m_role', (table) => {
      table.increments();
      table.integer('id').notNullable().primary().autoIncrement();
      table.tinyint('auditstat').notNullable();
      table.string('name', 50).notNullable();
      table.string('description', 200).notNullable();
      table.tinyint('order_no').notNullable();
      table.integer('creator_id').notNullable();
      table.timestamp('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.timestamp('modified_datetime');
    }),
    knex.schema.createTable('m_user_role', (table) => {
      table.increments();
      table.integer('id').notNullable().primary().autoIncrement();
      table.integer('user_id').notNullable().references('id').inTable('m_user');
      table.integer('role_id').notNullable().references('id').inTable('m_role');
      table.integer('creator_id').notNullable();
      table.timestamp('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.timestamp('modified_datetime');
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

