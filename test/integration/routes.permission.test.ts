process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';

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
      chai.request(server())
        .post('/api/permission/add_permission')
        .send({
          permission: {
            name: 'test',
            kind: 0,
            description: 'tests',
            creator_id: 1,
            order_no: 1
          },
          token: 'eyJhbGciOiJIUzI1NiJ9.Mg.xKZd6m-ie89vgofFC4OjLN6M3wUbSPB0u0wWYPY69rs'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          res.body.resultValue.Data.should.eql(1);
          done();
        });
    });
  });
});
