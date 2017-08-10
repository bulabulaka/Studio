process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';
import {permission} from '../../src/shared/index';

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
    it('should add a new permission', (done) => {
      let new_permission = new permission();
      new_permission.auditstat = 1;
      new_permission.name = 'test';
      new_permission.kind = 1;
      new_permission.description = 'tests';
      new_permission.creator_id = 1;
      new_permission.order_no = 1;
      new_permission.created_datetime = new Date();
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
  });
});
