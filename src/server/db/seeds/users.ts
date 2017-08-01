import * as bcrypt from 'bcryptjs'

export const seed = (knex, Promise) => {
  return knex('m_user').del()
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('johnson123', salt);
      return Promise.join(
        knex('m_user').insert({
          username: 'jeremy',
          password: hash,
          auditstat: 0,
          creator_id: 1,
          created_datetime: knex.raw('now()')
        })
      );
    })
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('bryant123', salt);
      return Promise.join(
        knex('m_user').insert({
          username: 'kelly',
          password: hash,
          auditstat: 0,
          creator_id: 1,
          created_datetime: knex.raw('now()')
        })
      );
    });
};

