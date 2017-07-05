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
        status : ''
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
        status: ''
      })
    );
  });
};


// exports.seed = (knex, Promise) => {
//   return knex('m_user').del()
//   .then(() => {
//     const salt = bcrypt.genSaltSync();
//     const hash = bcrypt.hashSync('johnson123', salt);
//     return Promise.join(
//       knex('m_user').insert({
//         username: 'jeremy',
//         password: hash
//       })
//     );
//   })
//   .then(() => {
//     const salt = bcrypt.genSaltSync();
//     const hash = bcrypt.hashSync('bryant123', salt);
//     return Promise.join(
//       knex('m_user').insert({
//         username: 'kelly',
//         password: hash,
//         admin: true
//       })
//     );
//   });
// };
