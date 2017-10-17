process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {initConfig} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';
import {PermissionModel, PermissionGroupModel} from '../../src/shared/index';
import {simulateUser} from './utils';

const should = chai.should();
chai.use(chaiHttp);
describe('routes : /api/permission', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run({directory: 'src/server/db/seed/seeds_test/seeds'});
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /api/permission/add_permission', () => {
    it('should add a new permission（service api）', (done) => {
      simulateUser('jeremy', 'johnson123', (token: string) => {
        const new_permission = new PermissionModel();
        new_permission.auditstat = 1;
        new_permission.name = 'test';
        new_permission.kind = 1;
        new_permission.description = 'tests';
        new_permission.creator_id = 1; // should be assigned based on user context from server side.
        new_permission.order_no = 1;
        new_permission.route = 'tests';
        new_permission.method = 'post';
        chai.request(initConfig())
          .post('/api/permission/add_permission')
          .send({
            permission: new_permission,
            token: token
          })
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.resultValue.RCode.should.eql(1);
            done();
          });
      });
    });
    it('should add a new permission (page)', (done) => {
      const new_permission = new PermissionModel();
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 0;
      new_permission.description = 'tests';
      new_permission.creator_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      chai.request(initConfig())
        .post('/api/permission/add_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.MQ.IvPF3tP5GHowtWyZMqn_2yxJ8fbh3gYp2pdTdXg4ERs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(1);
          done();
        });
    });
    it('when an error occur,it should rollback', (done) => {
      const new_permission = new PermissionModel();
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 1;
      new_permission.description = 'tests';
      new_permission.creator_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      chai.request(initConfig())
        .post('/api/permission/add_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.MQ.IvPF3tP5GHowtWyZMqn_2yxJ8fbh3gYp2pdTdXg4ERs'
        })
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(500);
          res.type.should.eql('application/json');
          done();
        });
    })
  });

  describe('PUT /api/permission/update_permission', () => {
    it('should update a permission (service api)', (done) => {
      const new_permission = new PermissionModel();
      new_permission.id = 2;
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 1;
      new_permission.description = 'tests';
      new_permission.modifier_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      new_permission.method = 'post';
      chai.request(initConfig())
        .put('/api/permission/update_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.MQ.IvPF3tP5GHowtWyZMqn_2yxJ8fbh3gYp2pdTdXg4ERs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(1);
          done();
        });
    })
  });

  describe('POST /api/permission/add_permission_group', () => {
    it('should add a new permission group', (done) => {
      const permissionGroup = new PermissionGroupModel();
      permissionGroup.name = 'test';
      permissionGroup.auditstat = 1;
      permissionGroup.description = 'test';
      permissionGroup.order_no = 1;
      permissionGroup.creator_id = 1;
      chai.request(initConfig())
        .post('/api/permission/add_permission_group')
        .send({
          permission_group: permissionGroup,
          token: 'eyJhbGciOiJIUzI1NiJ9.MQ.IvPF3tP5GHowtWyZMqn_2yxJ8fbh3gYp2pdTdXg4ERs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(1);
          res.body.resultValue.Data.should.eql(true);
          done();
        })
    })
  });

  describe('PUT /api/permission/update_permission_group', () => {
    it('should update a permission group', (done) => {
      const permissionGroup = new PermissionGroupModel();
      permissionGroup.id = 1;
      permissionGroup.name = 'test_update';
      permissionGroup.auditstat = 1;
      permissionGroup.description = 'tests';
      permissionGroup.order_no = 1;
      permissionGroup.modifier_id = 1;
      chai.request(initConfig())
        .put('/api/permission/update_permission_group')
        .send({
          permission_group: permissionGroup,
          token: 'eyJhbGciOiJIUzI1NiJ9.MQ.IvPF3tP5GHowtWyZMqn_2yxJ8fbh3gYp2pdTdXg4ERs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(1);
          done();
        })
    })
  });

  describe('GET /api/permission/get_permissions', () => {
    it('need token', (done) => {
      chai.request(initConfig())
        .get('/api/permission/get_permissions')
        .query({page: 1, pageSize: 10})
        .end((err, res) => {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.resultValue.RMsg.should.eql('No token exists.');
          done();
        });
    });
  });
});
