import {genSaltSync, hashSync} from 'bcryptjs'

export const seed = (knex, Promise) => {
  return knex('m_user').del()
    .then(() => {
      const salt = genSaltSync();
      const hash = hashSync('johnson123', salt);
      return Promise.join(
        knex('m_user').insert({
          username: 'admin',
          password: hash,
          auditstat: 1,
          creator_id: 1,
          created_datetime: knex.raw('now()')
        })
      );
    })
    .then(() => {
      return Promise.join(
        knex.transaction((trx) => {
          knex('m_permission').insert({
            name: 'get_userinfo',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_userinfo',
                creator_id: 1,
                created_datetime: new Date()
              }).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        }).then(() => {
        })
          .catch((error) => {
            console.error(error);
          })
      );
    })
    .then(() => {
      return Promise.join(
        knex.transaction((trx) => {
          knex('m_permission').insert({
            name: 'get permissions',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/permission/get_permissions',
                creator_id: 1,
                created_datetime: new Date()
              }).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        }).then(() => {
        })
          .catch((error) => {
            console.error(error);
          })
      );
    })
    .then(() => {
      return Promise.join(
        knex.transaction((trx) => {
          knex('m_permission').insert({
            name: 'create permission',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/permission/add_permission',
                creator_id: 1,
                created_datetime: new Date()
              }).transacting(trx);
            })
            .then(trx.commit)
            .catch(trx.rollback);
        }).then(() => {
        })
          .catch((error) => {
            console.error(error);
          })
      );
    });
};
