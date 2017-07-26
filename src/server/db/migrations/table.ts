exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('m_user', (table) => {
      table.increments('id').unique();
      table.string('username', 50).notNullable();
      table.string('password', 100).notNullable();
      table.tinyint('auditstat').notNullable();
      table.dateTime('expiry_date');
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_userinfo', (table) => {
      table.increments('id').unique();
      table.integer('user_id').notNullable().unsigned().references('id').inTable('m_user');
      table.string('name', 20);
      table.tinyint('sex');
      table.string('email', 50);
      table.string('tel', 30);
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
    knex.schema.createTable('m_permission_group', (table) => {
      table.increments('id').unique();
      table.string('name', 50).notNullable();
      table.tinyint('auditstat').notNullable();
      table.string('description', 200);
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
    }),
    knex.schema.createTable('m_role_permission_group', (table) => {
      table.increments('id').unique();
      table.integer('role_id').notNullable().unsigned().references('id').inTable('m_role');
      table.integer('permission_group_id').notNullable().unsigned().references('id').inTable('m_permission_group');
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_permission', (table) => {
      table.increments('id').unique();
      table.string('name', 100).notNullable();
      table.tinyint('auditstat').notNullable().comment('permission status default 1 delete 10');
      table.string('description', 200);
      table.tinyint('kind').notNullable().comment('0:page_info  1:page_operator');
      table.integer('order_no').notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_permission_group_permission', (table) => {
      table.increments('id').unique();
      table.integer('permission_id').notNullable().unsigned().references('id').inTable('m_permission');
      table.integer('permission_group_id').notNullable().unsigned().references('id').inTable('m_permission_group');
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_user_permission_group', (table) => {
      table.increments('id').unique();
      table.integer('user_id').notNullable().unsigned().references('id').inTable('m_user');
      table.integer('permission_group_id').notNullable().unsigned().references('id').inTable('m_permission_group');
      table.tinyint('flag').notNullable().comment('add or minus permission group');
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_service_api', (table) => {
      table.increments('id').unique();
      table.integer('permission_id').notNullable().unsigned().references('id').inTable('m_permission');
      table.string('method', 10).notNullable();
      table.string('route', 1000).notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_page', (table) => {
      table.increments('id').unique();
      table.integer('permission_id').notNullable().unsigned().references('id').inTable('m_permission');
      table.tinyint('auditstat').notNullable().comment('page status  e.g. maintain');
      table.string('title', 100);
      table.string('route', 1000).notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_operate_log', (table) => {
      table.increments('id').unique();
      table.string('ip', 50).notNullable();
      table.string('user_agent', 500);
      table.string('accept_encoding', 100).notNullable();
      table.string('content_type', 100).notNullable();
      table.string('access_token', 200);
      table.text('params');
      table.string('query', 1024);
      table.string('method', 10).notNullable();
      table.string('route', 1000).notNullable();
      table.integer('user_id');
      table.dateTime('finish_datetime').notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_dictionary_index', (table) => {
      table.increments('id').unique();
      table.string('description', 200).notNullable();
      table.string('key', 50).notNullable();
      table.tinyint('order_no');
      table.tinyint('auditstat').notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_dictionary_data', (table) => {
      table.increments('id').unique();
      table.integer('dictionary_index_id').notNullable().unsigned().references('id').inTable('m_dictionary_index');
      table.string('name', 50).notNullable();
      table.string('value', 500).notNullable();
      table.tinyint('order_no');
      table.tinyint('auditstat').notNullable();
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    }),
    knex.schema.createTable('m_log_detail', (table) => {
      table.increments('id').unique();
      table.integer('operate_log_id').notNullable().unsigned().references('id').inTable('m_operate_log');
      table.tinyint('kind').notNullable().comment('log kind: error or info');
      table.integer('return_code').notNullable();
      table.text('return_message');
      table.text('error_message');
      table.integer('creator_id').notNullable();
      table.dateTime('created_datetime').notNullable().defaultTo(knex.raw('now()'));
      table.integer('modifier_id');
      table.dateTime('modified_datetime');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('m_log_detail'),
    knex.schema.dropTable('m_dictionary_data'),
    knex.schema.dropTable('m_dictionary_index'),
    knex.schema.dropTable('m_operate_log'),
    knex.schema.dropTable('m_page'),
    knex.schema.dropTable('m_service_api'),
    knex.schema.dropTable('m_user_permission_group'),
    knex.schema.dropTable('m_permission_group_permission'),
    knex.schema.dropTable('m_permission'),
    knex.schema.dropTable('m_role_permission_group'),
    knex.schema.dropTable('m_user_role'),
    knex.schema.dropTable('m_permission_group'),
    knex.schema.dropTable('m_role'),
    knex.schema.dropTable('m_userinfo'),
    knex.schema.dropTable('m_user')
  ])
    ;
};

