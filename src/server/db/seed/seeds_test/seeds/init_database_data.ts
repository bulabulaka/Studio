import {genSaltSync, hashSync} from 'bcryptjs'

export const seed = (knex, Promise) => {
  let adminUserId: number;
  let roleAdminId: number;
  let permissionGroupAdminId: number;
  let permissionId: number;
  return knex('m_user').del()
    .then(() => {
      const salt = genSaltSync();
      const hash = hashSync('johnson123', salt);
      return knex('m_user').insert({
        username: 'admin',
        password: hash,
        auditstat: 1,
        creator_id: 1,
        created_datetime: knex.raw('now()')
      })
        .then((ids) => {
          adminUserId = ids[0];
          return null;
        });
    })
    .then(() => {
      return Promise.join(
        knex.transaction((trx) => {
          knex('m_role').insert({
            name: 'admin',
            auditstat: 1,
            description: 'administrator',
            order_no: 1,
            creator_id: adminUserId,
            created_datetime: knex.raw('now()')
          })
            .transacting(trx)
            .then((ids) => {
              roleAdminId = ids[0];
              return knex('m_user_role').insert({
                user_id: ids[0],
                role_id: roleAdminId,
                auditstat: 1,
                creator_id: adminUserId,
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
          knex('m_permission_group').insert({
            name: 'admin',
            auditstat: 1,
            description: 'administrator',
            order_no: 1,
            creator_id: adminUserId,
            created_datetime: knex.raw('now()')
          })
            .transacting(trx)
            .then((ids) => {
              permissionGroupAdminId = ids[0];
              return knex('m_role_permission_group').insert({
                role_id: roleAdminId,
                permission_group_id: permissionGroupAdminId,
                auditstat: 1,
                creator_id: adminUserId,
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
            name: 'get_userinfo',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: adminUserId,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_userinfo',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/permission/get_permissions',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/permission/add_permission',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'create permission group',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/permission/add_permission_group',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/permission/get_permission_groups',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get permission group permissions',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/permission/get_permission_group_permissions',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get permission group donot have permissions',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/permission/get_permission_group_donot_have_permissions',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'add permission group permissions',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/permission/add_permission_group_permissions',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get users',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_users',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get user roles',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_user_roles',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get user donot have roles',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_user_donot_have_roles',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'add user roles',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/user/add_user_roles',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get user add or minus permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_user_add_or_minus_permission_group',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get user have not processing permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/user/get_user_have_not_processing_permission_groups',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'processing permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/user/processing_permission_groups',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get roles',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/role/get_roles',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'create role',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'post',
                route: '/api/role/add_role',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get role permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/role/get_role_permission_groups',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'get role donot have permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'GET',
                route: '/api/role/get_role_donot_have_permission_groups',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'add role permission groups',
            auditstat: 1,
            kind: 1,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_service_api').insert({
                permission_id: ids[0],
                method: 'POST',
                route: '/api/role/add_role_permission_groups',
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'page user table',
            auditstat: 1,
            kind: 0,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_page').insert({
                permission_id: ids[0],
                route: '/workspace/user/user_table',
                auditstat: 1,
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'page role table',
            auditstat: 1,
            kind: 0,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_page').insert({
                permission_id: ids[0],
                route: '/workspace/role/role_table',
                auditstat: 1,
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'page permission table',
            auditstat: 1,
            kind: 0,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_page').insert({
                permission_id: ids[0],
                route: '/workspace/permission/permission_table',
                auditstat: 1,
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
            name: 'page permission group',
            auditstat: 1,
            kind: 0,
            description: '',
            creator_id: 1,
            order_no: 1,
            created_datetime: new Date()
          })
            .transacting(trx)
            .then((ids) => {
              permissionId = ids[0];
              return knex('m_page').insert({
                permission_id: ids[0],
                route: '/workspace/permission/permission_group',
                auditstat: 1,
                creator_id: 1,
                created_datetime: new Date()
              })
                .transacting(trx)
                .then(() => {
                  return knex('m_permission_group_permission').insert({
                    permission_id: permissionId,
                    permission_group_id: permissionGroupAdminId,
                    auditstat: 1,
                    creator_id: adminUserId,
                    created_datetime: new Date()
                  }).transacting(trx);
                });
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
};
