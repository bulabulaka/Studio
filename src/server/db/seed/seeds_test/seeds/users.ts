import {genSaltSync, hashSync} from 'bcryptjs'

export const seed = (knex, Promise) => {
  return knex('m_user').del()
    .then(() => {
      const salt = genSaltSync();
      const hash = hashSync('johnson123', salt);
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
      const salt = genSaltSync();
      const hash = hashSync('bryant123', salt);
      return Promise.join(
        knex('m_user').insert({
          username: 'kelly',
          password: hash,
          auditstat: 0,
          creator_id: 1,
          created_datetime: knex.raw('now()')
        })
      );
    })
    .then(() => {
      return Promise.join(
        knex.transaction((trx) => {
          knex('m_permission').insert({
            name: 'page',
            auditstat: 1,
            kind: 0,
            description: 'tests',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              return knex('m_page').insert({
                permission_id: ids[0],
                route: 'test',
                auditstat: 1,
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
            name: 'service_api',
            auditstat: 1,
            kind: 1,
            description: 'tests',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              return knex('m_service_api').insert({
                permission_id: ids[0],
                route: 'test',
                method: 'post',
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
        knex('m_permission_group').insert(
          {
            name: 'permissionGroup1',
            description: 'pg1',
            order_no: 1,
            auditstat: 1,
            creator_id: 1,
            created_datetime: new Date()
          }
        ).catch((error) => {
          console.log(error);
        })
      )
    });
};

