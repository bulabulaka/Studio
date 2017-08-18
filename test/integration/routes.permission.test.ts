process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';
import {permission, m_permission_group} from '../../src/shared/index';

const should = chai.should();

chai.use(chaiHttp);
describe('routes : /api/permission', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run({directory: 'src/server/db/seeds'});
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /api/permission/add_permission', () => {
    it('should add a new permission（service api）', (done) => {
      let new_permission = new permission();
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 1;
      new_permission.description = 'tests';
      new_permission.creator_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      new_permission.method = 'post';
      chai.request(server())
        .post('/api/permission/add_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        });
    });
    it('should add a new permission (page)', (done) => {
      let new_permission = new permission();
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 0;
      new_permission.description = 'tests';
      new_permission.creator_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      chai.request(server())
        .post('/api/permission/add_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        });
    });
    it('when an error occur,it should rollback', (done) => {
      let new_permission = new permission();
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 1;
      new_permission.description = 'tests';
      new_permission.creator_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      chai.request(server())
        .post('/api/permission/add_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
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
      let new_permission = new permission();
      new_permission.id = 2;
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 1;
      new_permission.description = 'tests';
      new_permission.modifier_id = 1;
      new_permission.order_no = 1;
      new_permission.route = 'tests';
      new_permission.method = 'post';
      chai.request(server())
        .put('/api/permission/update_permission')
        .send({
          permission: new_permission,
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        });
    })
  });

  describe('POST /api/permission/add_permission_group', () => {
    it('should add a new permission group', (done) => {
      let permissionGroup = new m_permission_group();
      permissionGroup.name = 'test';
      permissionGroup.auditstat = 1;
      permissionGroup.description = 'test';
      permissionGroup.order_no = 1;
      permissionGroup.creator_id = 1;
      permissionGroup.created_datetime = new Date();
      chai.request(server())
        .post('/api/permission/add_permission_group')
        .send({
          permission_group: permissionGroup,
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          res.body.resultValue.Data.should.eql(true);
          done();
        })
    })
  });

  describe('PUT /api/permission/update_permission_group', () => {
    it('should update a permission group', (done) => {
      let permissionGroup = new m_permission_group();
      permissionGroup.id = 1;
      permissionGroup.name = 'test_update';
      permissionGroup.auditstat = 1;
      permissionGroup.description = 'tests';
      permissionGroup.order_no = 1;
      permissionGroup.modifier_id = 1;
      permissionGroup.modified_datetime = new Date();
      chai.request(server())
        .put('/api/permission/update_permission_group')
        .send({
          permission_group: permissionGroup,
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        })
    })
  })
});
