const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('m_user').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('johnson123', salt);
    return Promise.join(
      knex('m_user').insert({
        username: 'jeremy',
        password: hash,
        status: 0
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
        status: 1
      })
    );
  });
};

